import { DEFAULT_CONFIG, RESOURCE_TYPES } from './config.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class GameState {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.inventory = Object.fromEntries(Object.keys(RESOURCE_TYPES).map((key) => [key, 0]));
    this.deposits = [];
    this.miningTargetId = null;
    this.miningAccumulator = 0;
    this.extractionSerial = 0;
    this.lastExtraction = null;
    this.version = 0;
    this.regenerateDeposits();
  }

  touch() {
    this.version += 1;
  }

  regenerateDeposits() {
    const centerX = Math.floor(this.config.gridColumns / 2);
    const centerY = Math.floor(this.config.gridRows / 2);
    const used = new Set();

    this.deposits = Object.keys(RESOURCE_TYPES).map((type) => {
      let x;
      let y;
      do {
        x = Math.max(0, Math.min(this.config.gridColumns - 1, centerX + randomInt(-this.config.spawnRadius, this.config.spawnRadius)));
        y = Math.max(0, Math.min(this.config.gridRows - 1, centerY + randomInt(-this.config.spawnRadius, this.config.spawnRadius)));
      } while (used.has(`${x}:${y}`));

      used.add(`${x}:${y}`);
      return {
        id: `${type}-${crypto.randomUUID()}`,
        type,
        x,
        y,
        amount: this.config.initialDepositAmount,
      };
    });

    this.stopMining();
    this.touch();
  }

  setConfig(key, value) {
    if (!(key in this.config)) return;
    if (typeof this.config[key] === 'number' && Number.isNaN(Number(value))) return;
    this.config[key] = typeof this.config[key] === 'number' ? Number(value) : value;
    this.touch();
  }

  setInventory(type, value) {
    if (!(type in this.inventory)) return;
    this.inventory[type] = Math.max(0, Number(value) || 0);
    this.touch();
  }

  setDepositAmount(id, value) {
    const deposit = this.deposits.find((item) => item.id === id);
    if (!deposit) return;
    deposit.amount = Math.max(0, Number(value) || 0);
    if (deposit.amount <= 0 && this.miningTargetId === id) this.stopMining();
    this.touch();
  }

  startMining(id) {
    const deposit = this.deposits.find((item) => item.id === id && item.amount > 0);
    if (!deposit) return;
    this.miningTargetId = id;
    this.miningAccumulator = 0;
    this.touch();
  }

  stopMining() {
    if (this.miningTargetId !== null || this.miningAccumulator !== 0) {
      this.miningTargetId = null;
      this.miningAccumulator = 0;
      this.touch();
    }
  }

  tick(deltaSeconds) {
    if (!this.miningTargetId) return;
    const deposit = this.deposits.find((item) => item.id === this.miningTargetId);
    if (!deposit || deposit.amount <= 0) {
      this.stopMining();
      return;
    }

    this.miningAccumulator += deltaSeconds * this.config.miningRate;
    const units = Math.floor(this.miningAccumulator);
    if (units < 1) return;

    const extracted = Math.min(units, deposit.amount);
    deposit.amount -= extracted;
    this.inventory[deposit.type] += extracted;
    this.miningAccumulator -= extracted;
    this.extractionSerial += extracted;
    this.lastExtraction = {
      depositId: deposit.id,
      type: deposit.type,
      units: extracted,
      serial: this.extractionSerial,
    };
    this.touch();

    if (deposit.amount <= 0) this.stopMining();
  }
}
