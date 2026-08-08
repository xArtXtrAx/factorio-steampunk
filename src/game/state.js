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

function cellKey(x, y) {
  return `${x}:${y}`;
}

export class GameState {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.inventory = Object.fromEntries(Object.keys(RESOURCE_TYPES).map((key) => [key, 0]));
    this.deposits = [];
    this.extractors = [];
    this.extractorStock = 0;
    this.hoppers = [];
    this.hopperStock = 0;
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

  getHopperCost() {
    return {
      iron: Math.max(0, Math.floor(Number(this.config.hopperCostIron) || 0)),
      copper: Math.max(0, Math.floor(Number(this.config.hopperCostCopper) || 0)),
      stone: Math.max(0, Math.floor(Number(this.config.hopperCostStone) || 0)),
      coal: Math.max(0, Math.floor(Number(this.config.hopperCostCoal) || 0)),
    };
  }

  canAfford(cost) {
    return Object.entries(cost).every(([type, amount]) => (this.inventory[type] || 0) >= amount);
  }

  payCost(cost) {
    Object.entries(cost).forEach(([type, amount]) => {
      this.inventory[type] -= amount;
    });
  }

  canAffordExtractor() {
    return this.canAfford(this.getExtractorCost());
  }

  canAffordHopper() {
    return this.canAfford(this.getHopperCost());
  }

  buyExtractor() {
    if (!this.canAffordExtractor()) return false;
    this.payCost(this.getExtractorCost());
    this.extractorStock += 1;
    this.touch();
    return true;
  }

  buyHopper() {
    if (!this.canAffordHopper()) return false;
    this.payCost(this.getHopperCost());
    this.hopperStock += 1;
    this.touch();
    return true;
  }

  setExtractorStock(value) {
    this.extractorStock = clampInt(value, 0, 9999);
    if (this.extractorStock <= 0 && this.placementMode === 'burnerExtractor') this.placementMode = null;
    this.touch();
  }

  setHopperStock(value) {
    this.hopperStock = clampInt(value, 0, 9999);
    if (this.hopperStock <= 0 && this.placementMode === 'storageHopper') this.placementMode = null;
    this.touch();
  }

  findVeinSeed(used, centerX, centerY) {
    const radius = Math.max(1, Math.floor(Number(this.config.spawnRadius) || 1));
    const columns = this.config.gridColumns;
    const rows = this.config.gridRows;

    for (let attempt = 0; attempt < 250; attempt += 1) {
      const x = Math.max(0, Math.min(columns - 1, centerX + randomInt(-radius, radius)));
      const y = Math.max(0, Math.min(rows - 1, centerY + randomInt(-radius, radius)));
      if (!used.has(cellKey(x, y))) return { x, y };
    }

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        if (!used.has(cellKey(x, y))) return { x, y };
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
    used.add(cellKey(seed.x, seed.y));

    let stalledAttempts = 0;
    while (cells.length < targetCells && stalledAttempts < targetCells * 24) {
      const anchor = Math.random() < irregularity
        ? cells[randomInt(0, cells.length - 1)]
        : cells[cells.length - 1];
      let placed = false;

      for (const [dx, dy] of shuffledDirections()) {
        const x = anchor.x + dx;
        const y = anchor.y + dy;
        if (x < 0 || y < 0 || x >= this.config.gridColumns || y >= this.config.gridRows) continue;
        const key = cellKey(x, y);
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
    if (this.hoppers.length) this.hopperStock += this.hoppers.length;
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
    this.hoppers = [];
    this.placementMode = null;
    this.stopMining();
    this.touch();
  }

  resetToDefaults() {
    this.config = { ...DEFAULT_CONFIG };
    this.inventory = Object.fromEntries(Object.keys(RESOURCE_TYPES).map((key) => [key, 0]));
    this.extractors = [];
    this.extractorStock = 0;
    this.hoppers = [];
    this.hopperStock = 0;
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
      hoppers: this.hoppers.map((hopper) => ({ ...hopper })),
      hopperStock: this.hopperStock,
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
        const key = cellKey(x, y);
        if (occupied.has(key)) return [];
        occupied.add(key);
        let id = typeof rawDeposit.id === 'string' && rawDeposit.id ? rawDeposit.id : `${rawDeposit.type}-${crypto.randomUUID()}`;
        if (ids.has(id)) id = `${rawDeposit.type}-${crypto.randomUUID()}`;
        ids.add(id);
        const veinId = typeof rawDeposit.veinId === 'string' && rawDeposit.veinId
          ? rawDeposit.veinId
          : `${rawDeposit.type}-vein-legacy-${id}`;
        return [{ id, veinId, type: rawDeposit.type, x, y, amount: Math.max(0, Number(rawDeposit.amount) || 0) }];
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

    const hopperCapacity = Math.max(1, Math.floor(Number(nextConfig.hopperCapacity) || 1));
    const hopperIds = new Set();
    const nextHoppers = Array.isArray(snapshot.hoppers)
      ? snapshot.hoppers.flatMap((rawHopper) => {
        if (!rawHopper) return [];
        const x = clampInt(rawHopper.x, 0, nextConfig.gridColumns - 1);
        const y = clampInt(rawHopper.y, 0, nextConfig.gridRows - 1);
        const key = cellKey(x, y);
        if (occupied.has(key)) return [];
        occupied.add(key);
        let id = typeof rawHopper.id === 'string' && rawHopper.id ? rawHopper.id : `hopper-${crypto.randomUUID()}`;
        if (hopperIds.has(id)) id = `hopper-${crypto.randomUUID()}`;
        hopperIds.add(id);
        const resourceType = rawHopper.resourceType in RESOURCE_TYPES ? rawHopper.resourceType : null;
        const amount = resourceType ? Math.min(hopperCapacity, Math.max(0, Number(rawHopper.amount) || 0)) : 0;
        return [{ id, x, y, resourceType, amount }];
      })
      : [];

    this.config = nextConfig;
    this.inventory = nextInventory;
    this.deposits = nextDeposits;
    this.extractors = nextExtractors;
    this.extractorStock = clampInt(snapshot.extractorStock, 0, 9999);
    this.hoppers = nextHoppers;
    this.hopperStock = clampInt(snapshot.hopperStock, 0, 9999);
    this.placementMode = null;
    this.miningTargetId = null;
    this.miningAccumulator = 0;
    this.extractionSerial = 0;
    this.lastExtraction = null;
    this.touch();
    return true;
  }

  findFreeCellNear(x, y, used, size) {
    const startX = clampInt(x, 0, size - 1);
    const startY = clampInt(y, 0, size - 1);
    if (!used.has(cellKey(startX, startY))) return { x: startX, y: startY };
    for (let radius = 1; radius < size; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const candidateX = clampInt(startX + dx, 0, size - 1);
          const candidateY = clampInt(startY + dy, 0, size - 1);
          if (!used.has(cellKey(candidateX, candidateY))) return { x: candidateX, y: candidateY };
        }
      }
    }
    return null;
  }

  setGridSize(value) {
    const nextSize = clampInt(value, 8, 60);
    const previousColumns = Math.max(1, this.config.gridColumns);
    const previousRows = Math.max(1, this.config.gridRows);
    if (nextSize === previousColumns && nextSize === previousRows) return;

    const used = new Set();
    this.deposits.forEach((deposit) => {
      const normalizedX = previousColumns > 1 ? deposit.x / (previousColumns - 1) : 0.5;
      const normalizedY = previousRows > 1 ? deposit.y / (previousRows - 1) : 0.5;
      const position = this.findFreeCellNear(normalizedX * (nextSize - 1), normalizedY * (nextSize - 1), used, nextSize);
      if (!position) return;
      deposit.x = position.x;
      deposit.y = position.y;
      used.add(cellKey(position.x, position.y));
    });

    this.hoppers = this.hoppers.flatMap((hopper) => {
      const normalizedX = previousColumns > 1 ? hopper.x / (previousColumns - 1) : 0.5;
      const normalizedY = previousRows > 1 ? hopper.y / (previousRows - 1) : 0.5;
      const position = this.findFreeCellNear(normalizedX * (nextSize - 1), normalizedY * (nextSize - 1), used, nextSize);
      if (!position) {
        this.hopperStock += 1;
        return [];
      }
      used.add(cellKey(position.x, position.y));
      return [{ ...hopper, x: position.x, y: position.y }];
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
    if (key === 'hopperCapacity') {
      const capacity = Math.max(1, Math.floor(Number(this.config.hopperCapacity) || 1));
      this.hoppers.forEach((hopper) => {
        hopper.amount = Math.min(hopper.amount, capacity);
        if (hopper.amount <= 0) hopper.resourceType = null;
      });
    }
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

  beginHopperPlacement() {
    if (this.hopperStock <= 0) return false;
    this.placementMode = 'storageHopper';
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
    if (!deposit || this.extractors.some((extractor) => extractor.depositId === depositId)) return false;

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

  placeHopper(x, y) {
    if (this.placementMode !== 'storageHopper' || this.hopperStock <= 0) return false;
    const gridX = clampInt(x, 0, this.config.gridColumns - 1);
    const gridY = clampInt(y, 0, this.config.gridRows - 1);
    if (this.deposits.some((deposit) => deposit.x === gridX && deposit.y === gridY)) return false;
    if (this.hoppers.some((hopper) => hopper.x === gridX && hopper.y === gridY)) return false;

    this.hoppers.push({
      id: `hopper-${crypto.randomUUID()}`,
      x: gridX,
      y: gridY,
      resourceType: null,
      amount: 0,
    });
    this.hopperStock -= 1;
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

  removeHopper(id) {
    const index = this.hoppers.findIndex((item) => item.id === id);
    if (index < 0) return;
    const [hopper] = this.hoppers.splice(index, 1);
    if (hopper.resourceType && hopper.amount > 0) this.inventory[hopper.resourceType] += hopper.amount;
    this.hopperStock += 1;
    this.touch();
  }

  removeAllExtractors() {
    if (!this.extractors.length) return;
    this.extractorStock += this.extractors.length;
    this.extractors = [];
    this.touch();
  }

  removeAllHoppers() {
    if (!this.hoppers.length) return;
    this.hoppers.forEach((hopper) => {
      if (hopper.resourceType && hopper.amount > 0) this.inventory[hopper.resourceType] += hopper.amount;
    });
    this.hopperStock += this.hoppers.length;
    this.hoppers = [];
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

  setHopperResourceType(id, type) {
    const hopper = this.hoppers.find((item) => item.id === id);
    if (!hopper) return;
    if (!(type in RESOURCE_TYPES)) {
      hopper.resourceType = null;
      hopper.amount = 0;
    } else if (hopper.amount <= 0 || hopper.resourceType === type) {
      hopper.resourceType = type;
    }
    this.touch();
  }

  setHopperAmount(id, value) {
    const hopper = this.hoppers.find((item) => item.id === id);
    if (!hopper) return;
    const capacity = Math.max(1, Math.floor(Number(this.config.hopperCapacity) || 1));
    hopper.amount = Math.max(0, Math.min(capacity, Number(value) || 0));
    if (hopper.amount <= 0) hopper.resourceType = null;
    if (hopper.amount > 0 && !hopper.resourceType) hopper.resourceType = 'iron';
    this.touch();
  }

  emptyHopper(id) {
    const hopper = this.hoppers.find((item) => item.id === id);
    if (!hopper) return;
    hopper.amount = 0;
    hopper.resourceType = null;
    this.touch();
  }

  fillHopper(id) {
    const hopper = this.hoppers.find((item) => item.id === id);
    if (!hopper) return;
    hopper.resourceType = hopper.resourceType || 'iron';
    hopper.amount = Math.max(1, Math.floor(Number(this.config.hopperCapacity) || 1));
    this.touch();
  }

  collectHopper(id) {
    const hopper = this.hoppers.find((item) => item.id === id);
    if (!hopper || !hopper.resourceType || hopper.amount <= 0) return false;
    this.inventory[hopper.resourceType] += hopper.amount;
    hopper.amount = 0;
    hopper.resourceType = null;
    this.touch();
    return true;
  }

  getAdjacentHoppers(deposit) {
    return this.hoppers.filter((hopper) => Math.abs(hopper.x - deposit.x) + Math.abs(hopper.y - deposit.y) === 1);
  }

  getExtractorOutputCapacity(deposit) {
    const adjacent = this.getAdjacentHoppers(deposit);
    if (!adjacent.length) return this.config.extractorGlobalOutputFallback ? Number.POSITIVE_INFINITY : 0;
    const capacity = Math.max(1, Math.floor(Number(this.config.hopperCapacity) || 1));
    const localSpace = adjacent.reduce((total, hopper) => {
      if (hopper.resourceType && hopper.resourceType !== deposit.type) return total;
      return total + Math.max(0, capacity - hopper.amount);
    }, 0);
    if (localSpace > 0) return localSpace;
    return this.config.hopperBlocksExtractorWhenFull ? 0 : Number.POSITIVE_INFINITY;
  }

  routeExtractorOutput(deposit, amount) {
    const adjacent = this.getAdjacentHoppers(deposit);
    if (!adjacent.length || (!this.config.hopperBlocksExtractorWhenFull && this.getExtractorOutputCapacity(deposit) === Number.POSITIVE_INFINITY)) {
      this.inventory[deposit.type] += amount;
      return;
    }

    const capacity = Math.max(1, Math.floor(Number(this.config.hopperCapacity) || 1));
    let remaining = amount;
    adjacent.forEach((hopper) => {
      if (remaining <= 0 || (hopper.resourceType && hopper.resourceType !== deposit.type)) return;
      const space = Math.max(0, capacity - hopper.amount);
      if (space <= 0) return;
      const transferred = Math.min(space, remaining);
      hopper.resourceType = deposit.type;
      hopper.amount += transferred;
      remaining -= transferred;
    });
    if (remaining > 0 && !this.config.hopperBlocksExtractorWhenFull) this.inventory[deposit.type] += remaining;
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
      const outputCapacity = this.getExtractorOutputCapacity(deposit);
      if (outputCapacity <= 0) {
        extractor.status = 'salida bloqueada';
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
      const extracted = Math.min(units, possibleByFuel, Math.floor(deposit.amount), outputCapacity);
      if (extracted <= 0) return;

      deposit.amount -= extracted;
      this.routeExtractorOutput(deposit, extracted);
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
