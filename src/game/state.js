import { DEFAULT_CONFIG, DEFAULT_GRAPHICS_CONFIG, RESOURCE_TYPES } from './config.js';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampInt(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || min)));
}

const CARDINAL_DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function shuffledDirections() {
  return [...CARDINAL_DIRECTIONS].sort(() => Math.random() - 0.5);
}

export class GameState {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.inventory = Object.fromEntries(Object.keys(RESOURCE_TYPES).map((key) => [key, 0]));
    this.deposits = [];
    this.extractors = [];
    this.extractorStock = 0;
    this.placementMode = null;
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

  getExtractorCost() {
    return {
      iron: Math.max(0, Math.floor(Number(this.config.extractorCostIron) || 0)),
      copper: Math.max(0, Math.floor(Number(this.config.extractorCostCopper) || 0)),
      stone: Math.max(0, Math.floor(Number(this.config.extractorCostStone) || 0)),
      coal: Math.max(0, Math.floor(Number(this.config.extractorCostCoal) || 0)),
    };
  }

  canAffordExtractor() {
    const cost = this.getExtractorCost();
    return Object.entries(cost).every(([type, amount]) => (this.inventory[type] || 0) >= amount);
  }

  buyExtractor() {
    if (!this.canAffordExtractor()) return false;
    const cost = this.getExtractorCost();
    Object.entries(cost).forEach(([type, amount]) => {
      this.inventory[type] -= amount;
    });
    this.extractorStock += 1;
    this.touch();
    return true;
  }

  setExtractorStock(value) {
    this.extractorStock = clampInt(value, 0, 9999);
    if (this.extractorStock <= 0 && this.placementMode === 'burnerExtractor') this.placementMode = null;
    this.touch();
  }

  findVeinSeed(used, centerX, centerY) {
    const radius = Math.max(1, Math.floor(Number(this.config.spawnRadius) || 1));
    const columns = this.config.gridColumns;
    const rows = this.config.gridRows;

    for (let attempt = 0; attempt < 250; attempt += 1) {
      const x = Math.max(0, Math.min(columns - 1, centerX + randomInt(-radius, radius)));
      const y = Math.max(0, Math.min(rows - 1, centerY + randomInt(-radius, radius)));
      if (!used.has(`${x}:${y}`)) return { x, y };
    }

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        if (!used.has(`${x}:${y}`)) return { x, y };
      }
    }

    return null;
  }

  growResourceVein(type, veinIndex, used, centerX, centerY) {
    const seed = this.findVeinSeed(used, centerX, centerY);
    if (!seed) return [];

    const minCells = clampInt(this.config.resourceVeinMinCells, 1, 100);
    const maxCells = clampInt(this.config.resourceVeinMaxCells, minCells, 100);
    const targetCells = randomInt(minCells, maxCells);
    const irregularity = Math.max(0, Math.min(1, Number(this.config.resourceVeinIrregularity) || 0));
    const veinId = `${type}-vein-${veinIndex + 1}-${crypto.randomUUID()}`;
    const cells = [seed];
    used.add(`${seed.x}:${seed.y}`);

    let stalledAttempts = 0;
    while (cells.length < targetCells && stalledAttempts < targetCells * 24) {
      const useRandomAnchor = Math.random() < irregularity;
      const anchor = useRandomAnchor
        ? cells[randomInt(0, cells.length - 1)]
        : cells[cells.length - 1];
      let placed = false;

      for (const [dx, dy] of shuffledDirections()) {
        const x = anchor.x + dx;
        const y = anchor.y + dy;
        if (x < 0 || y < 0 || x >= this.config.gridColumns || y >= this.config.gridRows) continue;
        const key = `${x}:${y}`;
        if (used.has(key)) continue;
        used.add(key);
        cells.push({ x, y });
        placed = true;
        break;
      }

      stalledAttempts = placed ? 0 : stalledAttempts + 1;
    }

    return cells.map(({ x, y }) => ({
      id: `${type}-${crypto.randomUUID()}`,
      veinId,
      type,
      x,
      y,
      amount: Math.max(1, Number(this.config.initialDepositAmount) || 1),
    }));
  }

  regenerateDeposits() {
    if (this.extractors.length) this.extractorStock += this.extractors.length;
    const centerX = Math.floor(this.config.gridColumns / 2);
    const centerY = Math.floor(this.config.gridRows / 2);
    const used = new Set();
    const veinsPerType = clampInt(this.config.resourceVeinsPerType, 1, 12);
    const nextDeposits = [];

    Object.keys(RESOURCE_TYPES).forEach((type) => {
      for (let veinIndex = 0; veinIndex < veinsPerType; veinIndex += 1) {
        nextDeposits.push(...this.growResourceVein(type, veinIndex, used, centerX, centerY));
      }
    });

    this.deposits = nextDeposits;
    this.extractors = [];
    this.placementMode = null;
    this.stopMining();
    this.touch();
  }

  resetToDefaults() {
    this.config = { ...DEFAULT_CONFIG };
    this.inventory = Object.fromEntries(Object.keys(RESOURCE_TYPES).map((key) => [key, 0]));
    this.extractors = [];
    this.extractorStock = 0;
    this.placementMode = null;
    this.miningTargetId = null;
    this.miningAccumulator = 0;
    this.extractionSerial = 0;
    this.lastExtraction = null;
    this.regenerateDeposits();
  }

  resetGraphicsToDefaults() {
    Object.assign(this.config, DEFAULT_GRAPHICS_CONFIG);
    this.touch();
  }

  captureStartProfile() {
    return {
      schemaVersion: 1,
      config: { ...this.config },
      inventory: { ...this.inventory },
      deposits: this.deposits.map((deposit) => ({ ...deposit })),
      extractors: this.extractors.map((extractor) => ({ ...extractor })),
      extractorStock: this.extractorStock,
    };
  }

  restoreStartProfile(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return false;

    const nextConfig = { ...DEFAULT_CONFIG };
    Object.entries(DEFAULT_CONFIG).forEach(([key, defaultValue]) => {
      const candidate = snapshot.config?.[key];
      if (typeof defaultValue === 'number') {
        const parsed = Number(candidate);
        if (Number.isFinite(parsed)) nextConfig[key] = parsed;
      } else if (typeof defaultValue === 'boolean') {
        if (typeof candidate === 'boolean') nextConfig[key] = candidate;
      } else if (typeof defaultValue === 'string') {
        if (typeof candidate === 'string') nextConfig[key] = candidate;
      }
    });
    nextConfig.gridColumns = clampInt(nextConfig.gridColumns, 8, 60);
    nextConfig.gridRows = clampInt(nextConfig.gridRows, 8, 60);

    const nextInventory = Object.fromEntries(Object.keys(RESOURCE_TYPES).map((type) => [
      type,
      Math.max(0, Number(snapshot.inventory?.[type]) || 0),
    ]));

    const occupied = new Set();
    const ids = new Set();
    const nextDeposits = Array.isArray(snapshot.deposits)
      ? snapshot.deposits.flatMap((rawDeposit) => {
        if (!rawDeposit || !(rawDeposit.type in RESOURCE_TYPES)) return [];
        const x = clampInt(rawDeposit.x, 0, nextConfig.gridColumns - 1);
        const y = clampInt(rawDeposit.y, 0, nextConfig.gridRows - 1);
        const cellKey = `${x}:${y}`;
        if (occupied.has(cellKey)) return [];
        occupied.add(cellKey);
        let id = typeof rawDeposit.id === 'string' && rawDeposit.id ? rawDeposit.id : `${rawDeposit.type}-${crypto.randomUUID()}`;
        if (ids.has(id)) id = `${rawDeposit.type}-${crypto.randomUUID()}`;
        ids.add(id);
        const veinId = typeof rawDeposit.veinId === 'string' && rawDeposit.veinId
          ? rawDeposit.veinId
          : `${rawDeposit.type}-vein-legacy-${id}`;
        return [{
          id,
          veinId,
          type: rawDeposit.type,
          x,
          y,
          amount: Math.max(0, Number(rawDeposit.amount) || 0),
        }];
      })
      : [];

    if (!nextDeposits.length) return false;

    const depositIds = new Set(nextDeposits.map((deposit) => deposit.id));
    const usedDeposits = new Set();
    const nextExtractors = Array.isArray(snapshot.extractors)
      ? snapshot.extractors.flatMap((rawExtractor) => {
        if (!rawExtractor || !depositIds.has(rawExtractor.depositId) || usedDeposits.has(rawExtractor.depositId)) return [];
        usedDeposits.add(rawExtractor.depositId);
        return [{
          id: typeof rawExtractor.id === 'string' && rawExtractor.id ? rawExtractor.id : `extractor-${crypto.randomUUID()}`,
          depositId: rawExtractor.depositId,
          fuelBuffer: clampInt(rawExtractor.fuelBuffer, 0, Math.max(0, nextConfig.extractorFuelBufferCapacity)),
          fuelWorkRemaining: Math.max(0, Number(rawExtractor.fuelWorkRemaining) || 0),
          workAccumulator: Math.max(0, Number(rawExtractor.workAccumulator) || 0),
          producedTotal: Math.max(0, Number(rawExtractor.producedTotal) || 0),
          enabled: rawExtractor.enabled !== false,
          status: typeof rawExtractor.status === 'string' ? rawExtractor.status : 'en espera',
        }];
      })
      : [];

    this.config = nextConfig;
    this.inventory = nextInventory;
    this.deposits = nextDeposits;
    this.extractors = nextExtractors;
    this.extractorStock = clampInt(snapshot.extractorStock, 0, 9999);
    this.placementMode = null;
    this.miningTargetId = null;
    this.miningAccumulator = 0;
    this.extractionSerial = 0;
    this.lastExtraction = null;
    this.touch();
    return true;
  }

  setGridSize(value) {
    const nextSize = clampInt(value, 8, 60);
    const previousColumns = Math.max(1, this.config.gridColumns);
    const previousRows = Math.max(1, this.config.gridRows);
    if (nextSize === previousColumns && nextSize === previousRows) return;

    const used = new Set();
    const center = Math.floor(nextSize / 2);

    this.deposits.forEach((deposit, index) => {
      const normalizedX = previousColumns > 1 ? deposit.x / (previousColumns - 1) : 0.5;
      const normalizedY = previousRows > 1 ? deposit.y / (previousRows - 1) : 0.5;
      let x = clampInt(normalizedX * (nextSize - 1), 0, nextSize - 1);
      let y = clampInt(normalizedY * (nextSize - 1), 0, nextSize - 1);

      if (used.has(`${x}:${y}`)) {
        const maxRadius = nextSize;
        let placed = false;
        for (let radius = 1; radius < maxRadius && !placed; radius += 1) {
          for (let dy = -radius; dy <= radius && !placed; dy += 1) {
            for (let dx = -radius; dx <= radius; dx += 1) {
              if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
              const candidateX = clampInt(x + dx, 0, nextSize - 1);
              const candidateY = clampInt(y + dy, 0, nextSize - 1);
              if (!used.has(`${candidateX}:${candidateY}`)) {
                x = candidateX;
                y = candidateY;
                placed = true;
                break;
              }
            }
          }
        }

        if (!placed) {
          x = clampInt(center + index, 0, nextSize - 1);
          y = center;
        }
      }

      deposit.x = x;
      deposit.y = y;
      used.add(`${x}:${y}`);
    });

    this.config.gridColumns = nextSize;
    this.config.gridRows = nextSize;
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

  beginExtractorPlacement() {
    if (this.extractorStock <= 0) return false;
    this.placementMode = 'burnerExtractor';
    this.stopMining();
    this.touch();
    return true;
  }

  cancelPlacement() {
    if (!this.placementMode) return;
    this.placementMode = null;
    this.touch();
  }

  placeExtractor(depositId) {
    if (this.placementMode !== 'burnerExtractor' || this.extractorStock <= 0) return false;
    const deposit = this.deposits.find((item) => item.id === depositId && item.amount > 0);
    if (!deposit) return false;
    if (this.extractors.some((extractor) => extractor.depositId === depositId)) return false;

    this.extractors.push({
      id: `extractor-${crypto.randomUUID()}`,
      depositId,
      fuelBuffer: 0,
      fuelWorkRemaining: 0,
      workAccumulator: 0,
      producedTotal: 0,
      enabled: true,
      status: 'sin combustible',
    });
    this.extractorStock -= 1;
    this.placementMode = null;
    this.touch();
    return true;
  }

  removeExtractor(id) {
    const index = this.extractors.findIndex((item) => item.id === id);
    if (index < 0) return;
    this.extractors.splice(index, 1);
    this.extractorStock += 1;
    this.touch();
  }

  removeAllExtractors() {
    if (!this.extractors.length) return;
    this.extractorStock += this.extractors.length;
    this.extractors = [];
    this.touch();
  }

  setExtractorEnabled(id, enabled) {
    const extractor = this.extractors.find((item) => item.id === id);
    if (!extractor) return;
    extractor.enabled = Boolean(enabled);
    extractor.status = extractor.enabled ? 'en espera' : 'detenido';
    this.touch();
  }

  setExtractorFuel(id, value) {
    const extractor = this.extractors.find((item) => item.id === id);
    if (!extractor) return;
    extractor.fuelBuffer = clampInt(value, 0, Math.max(0, this.config.extractorFuelBufferCapacity));
    this.touch();
  }

  autoLoadFuel(extractor) {
    if (!this.config.extractorAutoLoadFuel) return;
    const capacity = Math.max(0, Math.floor(this.config.extractorFuelBufferCapacity));
    const missing = Math.max(0, capacity - extractor.fuelBuffer);
    if (missing <= 0 || this.inventory.coal <= 0) return;
    const transferred = Math.min(missing, Math.floor(this.inventory.coal));
    this.inventory.coal -= transferred;
    extractor.fuelBuffer += transferred;
  }

  igniteExtractor(extractor, deposit) {
    const efficiency = Math.max(1, Number(this.config.extractorResourcesPerCoal) || 1);

    if (extractor.fuelBuffer > 0) {
      extractor.fuelBuffer -= 1;
      extractor.fuelWorkRemaining += efficiency;
      return true;
    }

    if (this.config.extractorCoalSelfFeed && deposit.type === 'coal' && deposit.amount > 0) {
      deposit.amount -= 1;
      extractor.fuelWorkRemaining += efficiency;
      extractor.status = 'autoalimentando carbón';
      return true;
    }

    return false;
  }

  tickExtractors(deltaSeconds) {
    const rate = Math.max(0, Number(this.config.extractorMiningRate) || 0);
    if (rate <= 0) return false;
    let changed = false;

    this.extractors.forEach((extractor) => {
      const deposit = this.deposits.find((item) => item.id === extractor.depositId);
      if (!extractor.enabled) {
        extractor.status = 'detenido';
        return;
      }
      if (!deposit || deposit.amount <= 0) {
        extractor.status = 'depósito agotado';
        extractor.workAccumulator = 0;
        return;
      }

      const beforeFuel = extractor.fuelBuffer;
      const beforeCoal = this.inventory.coal;
      this.autoLoadFuel(extractor);
      if (extractor.fuelBuffer !== beforeFuel || this.inventory.coal !== beforeCoal) changed = true;

      if (extractor.fuelWorkRemaining <= 0 && !this.igniteExtractor(extractor, deposit)) {
        extractor.status = 'sin combustible';
        return;
      }

      extractor.status = 'trabajando';
      extractor.workAccumulator += deltaSeconds * rate;
      const units = Math.floor(extractor.workAccumulator);
      if (units < 1) return;

      const possibleByFuel = Math.floor(extractor.fuelWorkRemaining);
      const extracted = Math.min(units, possibleByFuel, Math.floor(deposit.amount));
      if (extracted <= 0) return;

      deposit.amount -= extracted;
      this.inventory[deposit.type] += extracted;
      extractor.workAccumulator -= extracted;
      extractor.fuelWorkRemaining -= extracted;
      extractor.producedTotal += extracted;
      this.extractionSerial += extracted;
      this.lastExtraction = {
        depositId: deposit.id,
        type: deposit.type,
        units: extracted,
        serial: this.extractionSerial,
        source: 'extractor',
        extractorId: extractor.id,
      };
      changed = true;

      if (deposit.amount <= 0) extractor.status = 'depósito agotado';
    });

    return changed;
  }

  startMining(id) {
    if (this.placementMode) return;
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

  tickManualMining(deltaSeconds) {
    if (!this.miningTargetId) return false;
    const deposit = this.deposits.find((item) => item.id === this.miningTargetId);
    if (!deposit || deposit.amount <= 0) {
      this.stopMining();
      return false;
    }

    this.miningAccumulator += deltaSeconds * this.config.miningRate;
    const units = Math.floor(this.miningAccumulator);
    if (units < 1) return false;

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
      source: 'manual',
    };

    if (deposit.amount <= 0) this.stopMining();
    return true;
  }

  tick(deltaSeconds) {
    const manualChanged = this.tickManualMining(deltaSeconds);
    const extractorChanged = this.tickExtractors(deltaSeconds);
    if (manualChanged || extractorChanged) this.touch();
  }
}
