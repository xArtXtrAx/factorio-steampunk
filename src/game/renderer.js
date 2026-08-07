import { Application, Container, Graphics, Text } from 'pixi.js';
import { RESOURCE_TYPES } from './config.js';

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ease(type, t) {
  const x = clamp(t);
  if (type === 'linear') return x;
  if (type === 'easeOut') return 1 - ((1 - x) ** 3);
  if (type === 'easeInOut') return x < 0.5 ? 4 * x ** 3 : 1 - ((-2 * x + 2) ** 3) / 2;
  return x ** 3;
}

function colorNumber(value, fallback) {
  if (typeof value === 'number') return value;
  const normalized = String(value || '').trim().replace('#', '');
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export class GameRenderer {
  constructor(state, host) {
    this.state = state;
    this.host = host;
    this.app = new Application();
    this.gridLayer = new Graphics();
    this.resourceLayer = new Container();
    this.machineLayer = new Graphics();
    this.fxLayer = new Graphics();
    this.lastVersion = -1;
    this.lastMiningTargetId = null;
    this.visualMiningClock = 0;
    this.lastExtractionSerial = 0;
    this.impactFlash = null;
    this.extractorAngles = new Map();
  }

  async init() {
    await this.app.init({
      resizeTo: this.host,
      antialias: true,
      backgroundAlpha: 0,
      preference: 'webgl',
    });

    this.host.appendChild(this.app.canvas);
    this.app.stage.addChild(this.gridLayer, this.resourceLayer, this.machineLayer, this.fxLayer);
    this.app.ticker.add((ticker) => this.frame(ticker.deltaMS / 1000));
    window.addEventListener('pointerup', () => this.state.stopMining());
    window.addEventListener('pointercancel', () => this.state.stopMining());
    window.addEventListener('resize', () => {
      this.drawGrid();
      this.redrawResources();
    });
    this.drawGrid();
    this.redrawResources();
  }

  getLayout() {
    const { gridColumns, gridRows } = this.state.config;
    const pad = 22;
    const width = this.app.renderer.width;
    const height = this.app.renderer.height;
    const cell = Math.max(1, Math.floor(Math.min((width - pad * 2) / gridColumns, (height - pad * 2) / gridRows)));
    const gridWidth = cell * gridColumns;
    const gridHeight = cell * gridRows;
    return {
      cell,
      x: Math.floor((width - gridWidth) / 2),
      y: Math.floor((height - gridHeight) / 2),
      gridWidth,
      gridHeight,
    };
  }

  getDepositCenter(deposit) {
    const { cell, x, y } = this.getLayout();
    return {
      cell,
      cx: x + deposit.x * cell + cell / 2,
      cy: y + deposit.y * cell + cell / 2,
    };
  }

  drawGrid() {
    const { gridColumns, gridRows, gridGlow } = this.state.config;
    const { cell, x, y, gridWidth, gridHeight } = this.getLayout();
    this.gridLayer.clear();
    this.gridLayer.rect(x, y, gridWidth, gridHeight).fill({ color: 0x11100f, alpha: 0.72 });

    for (let col = 0; col <= gridColumns; col += 1) {
      const px = x + col * cell;
      this.gridLayer.moveTo(px, y).lineTo(px, y + gridHeight);
    }
    for (let row = 0; row <= gridRows; row += 1) {
      const py = y + row * cell;
      this.gridLayer.moveTo(x, py).lineTo(x + gridWidth, py);
    }
    this.gridLayer.stroke({ color: 0x6bd8df, width: 1, alpha: gridGlow });
  }

  redrawResources() {
    this.resourceLayer.removeChildren().forEach((child) => child.destroy({ children: true }));
    const { cell, x, y } = this.getLayout();

    this.state.deposits.forEach((deposit) => {
      const meta = RESOURCE_TYPES[deposit.type];
      const extractor = this.state.extractors.find((item) => item.depositId === deposit.id);
      const group = new Container();
      const tile = new Graphics();
      const px = x + deposit.x * cell;
      const py = y + deposit.y * cell;
      const inset = Math.max(3, cell * 0.12);
      const placementCandidate = this.state.placementMode === 'burnerExtractor' && !extractor && deposit.amount > 0;

      tile.roundRect(px + inset, py + inset, cell - inset * 2, cell - inset * 2, Math.max(4, cell * 0.14))
        .fill({ color: meta.color, alpha: deposit.amount > 0 ? 0.95 : 0.18 })
        .stroke({
          color: placementCandidate ? 0xf2c66d : meta.glow,
          width: placementCandidate ? 3 : 2,
          alpha: deposit.amount > 0 ? 0.95 : 0.25,
        });

      tile.eventMode = deposit.amount > 0 ? 'static' : 'none';
      tile.cursor = placementCandidate ? 'copy' : extractor ? 'default' : deposit.amount > 0 ? 'pointer' : 'default';
      tile.on('pointerdown', (event) => {
        if (event.button !== 0) return;
        if (this.state.placementMode === 'burnerExtractor') {
          this.state.placeExtractor(deposit.id);
          return;
        }
        if (!extractor) this.state.startMining(deposit.id);
      });

      const amount = new Text({
        text: String(Math.floor(deposit.amount)),
        style: {
          fontFamily: 'Georgia, serif',
          fontSize: Math.max(10, Math.floor(cell * (extractor ? 0.2 : 0.28))),
          fill: 0xf5e8ca,
          fontWeight: '700',
          dropShadow: { color: 0x000000, alpha: 0.8, distance: 1, blur: 2 },
        },
      });
      amount.anchor.set(0.5);
      amount.position.set(px + cell / 2, py + cell * (extractor ? 0.8 : 0.5));
      group.addChild(tile, amount);
      this.resourceLayer.addChild(group);
    });
  }

  updateFxClock(deltaSeconds) {
    const targetId = this.state.miningTargetId;
    if (targetId !== this.lastMiningTargetId) {
      this.visualMiningClock = 0;
      this.lastMiningTargetId = targetId;
    }

    if (!targetId) return;
    const timeScale = Math.max(0.05, Number(this.state.config.pulseTimeScale) || 1);
    this.visualMiningClock += (deltaSeconds * this.state.config.miningRate) / timeScale;
    this.visualMiningClock %= 1;
  }

  captureImpact() {
    if (this.state.extractionSerial === this.lastExtractionSerial) return;
    this.lastExtractionSerial = this.state.extractionSerial;
    const extraction = this.state.lastExtraction;
    if (!extraction) return;
    const deposit = this.state.deposits.find((item) => item.id === extraction.depositId);
    if (!deposit) return;
    this.impactFlash = { deposit, elapsedMs: 0 };
  }

  drawExtractorMachines(deltaSeconds) {
    const config = this.state.config;
    const bodyColor = colorNumber(config.extractorBodyColor, 0x5b4937);
    const brassColor = colorNumber(config.extractorBrassColor, 0xc49445);
    const glowColor = colorNumber(config.extractorGlowColor, 0x58ffe3);
    const scale = clamp(Number(config.extractorVisualScale) || 0.84, 0.3, 1.2);
    const gearSpeed = Math.max(0, Number(config.extractorGearSpeed) || 0);
    const glowIntensity = clamp(Number(config.extractorGlowIntensity) || 0);
    const fuelRingWidth = Math.max(0.5, Number(config.extractorFuelRingWidth) || 2.5);
    const efficiency = Math.max(1, Number(config.extractorResourcesPerCoal) || 1);

    this.machineLayer.clear();

    this.state.extractors.forEach((extractor) => {
      const deposit = this.state.deposits.find((item) => item.id === extractor.depositId);
      if (!deposit) return;
      const { cell, cx, cy } = this.getDepositCenter(deposit);
      const machineSize = cell * scale;
      const half = machineSize / 2;
      const running = extractor.enabled && extractor.status === 'trabajando';
      const oldAngle = this.extractorAngles.get(extractor.id) || 0;
      const angle = running ? oldAngle + deltaSeconds * gearSpeed * Math.PI * 2 : oldAngle;
      this.extractorAngles.set(extractor.id, angle);

      this.machineLayer.roundRect(cx - half, cy - half, machineSize, machineSize, Math.max(3, cell * 0.1))
        .fill({ color: bodyColor, alpha: 0.93 })
        .stroke({ color: brassColor, width: Math.max(1, cell * 0.055), alpha: 0.95 });

      const hubRadius = Math.max(2, cell * 0.12);
      const spokeRadius = Math.max(hubRadius + 1, cell * 0.24);
      for (let spoke = 0; spoke < 4; spoke += 1) {
        const spokeAngle = angle + spoke * Math.PI / 2;
        this.machineLayer.moveTo(
          cx + Math.cos(spokeAngle) * hubRadius,
          cy + Math.sin(spokeAngle) * hubRadius,
        ).lineTo(
          cx + Math.cos(spokeAngle) * spokeRadius,
          cy + Math.sin(spokeAngle) * spokeRadius,
        );
      }
      this.machineLayer.stroke({ color: brassColor, width: Math.max(1, cell * 0.06), alpha: 0.95 });
      this.machineLayer.circle(cx, cy, hubRadius)
        .fill({ color: 0x201b17, alpha: 1 })
        .stroke({ color: running ? glowColor : brassColor, width: Math.max(1, cell * 0.04), alpha: running ? 0.95 : 0.55 });

      if (running && glowIntensity > 0) {
        this.machineLayer.circle(cx, cy, spokeRadius * 1.08).stroke({
          color: glowColor,
          width: Math.max(2, cell * 0.12),
          alpha: glowIntensity * 0.12,
        });
      }

      const fuelProgress = clamp(extractor.fuelWorkRemaining / efficiency);
      const ringRadius = Math.max(3, half * 0.92);
      this.machineLayer.circle(cx, cy, ringRadius).stroke({
        color: 0x30281f,
        width: fuelRingWidth,
        alpha: 0.8,
      });
      if (fuelProgress > 0) {
        const segments = Math.max(1, Math.floor(24 * fuelProgress));
        for (let i = 0; i < segments; i += 1) {
          const a1 = -Math.PI / 2 + (i / 24) * Math.PI * 2;
          const a2 = -Math.PI / 2 + ((i + 0.72) / 24) * Math.PI * 2;
          this.machineLayer.moveTo(cx + Math.cos(a1) * ringRadius, cy + Math.sin(a1) * ringRadius)
            .arc(cx, cy, ringRadius, a1, a2);
        }
        this.machineLayer.stroke({ color: running ? glowColor : brassColor, width: fuelRingWidth, alpha: 0.95 });
      }

      if (!running) {
        const warningColor = extractor.status === 'depósito agotado' ? 0x777777 : 0xff8b42;
        this.machineLayer.circle(cx + half * 0.68, cy - half * 0.68, Math.max(2, cell * 0.065))
          .fill({ color: warningColor, alpha: 0.95 });
      }
    });
  }

  drawPulseAtDeposit(deposit, phase) {
    const config = this.state.config;
    const pulseColor = colorNumber(config.pulseColor, 0x58ffe3);
    const glowColor = colorNumber(config.pulseGlowColor, 0x00ffd5);
    const { cell, cx, cy } = this.getDepositCenter(deposit);
    const count = Math.max(1, Math.round(config.pulseRingCount));
    const requestedSpacing = Math.max(0, config.pulseRingSpacing);
    const spacing = count > 1 ? Math.min(requestedSpacing, 0.8 / (count - 1)) : 0;
    const totalDelay = spacing * (count - 1);
    const ringLife = Math.max(0.2, 1 - totalDelay);

    for (let index = 0; index < count; index += 1) {
      const delay = index * spacing;
      const localPhase = (phase - delay) / ringLife;
      if (localPhase < 0 || localPhase >= 1) continue;

      const eased = ease(config.pulseEasing, localPhase);
      const sizeOffset = 1 + index * config.pulseRingSizeOffset;
      const startRadius = cell * config.pulseStartScale * sizeOffset * 0.5;
      const endRadius = cell * config.pulseEndScale * 0.5;
      const radius = Math.max(0.5, lerp(startRadius, endRadius, eased));
      const alpha = clamp(lerp(config.pulseStartAlpha, config.pulseImpactAlpha, eased));
      const lineWidth = Math.max(0.5, config.pulseLineWidth);
      const glowSize = Math.max(0, config.pulseGlowSize);
      const glowIntensity = clamp(config.pulseGlowIntensity);

      if (glowSize > 0 && glowIntensity > 0) {
        this.fxLayer.circle(cx, cy, radius).stroke({ color: glowColor, width: lineWidth + glowSize * 2, alpha: alpha * glowIntensity * 0.16 });
        this.fxLayer.circle(cx, cy, radius).stroke({ color: glowColor, width: lineWidth + glowSize * 0.8, alpha: alpha * glowIntensity * 0.38 });
      }
      this.fxLayer.circle(cx, cy, radius).stroke({ color: pulseColor, width: lineWidth, alpha });
    }
  }

  drawMiningPulse(deltaSeconds) {
    const config = this.state.config;
    this.fxLayer.clear();
    if (!config.pulseEnabled) return;

    const target = this.state.deposits.find((item) => item.id === this.state.miningTargetId);
    if (target && target.amount > 0) this.drawPulseAtDeposit(target, this.visualMiningClock);

    const rate = Math.max(0.01, Number(config.extractorMiningRate) || 1);
    this.state.extractors.forEach((extractor) => {
      if (!extractor.enabled || extractor.status !== 'trabajando') return;
      const deposit = this.state.deposits.find((item) => item.id === extractor.depositId && item.amount > 0);
      if (!deposit) return;
      const phase = (extractor.workAccumulator * rate) % 1;
      this.drawPulseAtDeposit(deposit, phase);
    });

    if (!this.impactFlash) return;
    const pulseColor = colorNumber(config.pulseColor, 0x58ffe3);
    const glowColor = colorNumber(config.pulseGlowColor, 0x00ffd5);
    const flashMs = Math.max(1, config.pulseFadeMs);
    this.impactFlash.elapsedMs += deltaSeconds * 1000;
    const t = clamp(this.impactFlash.elapsedMs / flashMs);
    const { cell, cx, cy } = this.getDepositCenter(this.impactFlash.deposit);
    const flashAlpha = clamp(config.pulseImpactFlash) * (1 - t) ** 2;
    const flashRadius = cell * lerp(config.pulseEndScale * 0.5, 0.28, t);

    this.fxLayer.circle(cx, cy, Math.max(1, flashRadius)).fill({ color: pulseColor, alpha: flashAlpha * 0.22 });
    this.fxLayer.circle(cx, cy, Math.max(1, flashRadius)).stroke({
      color: glowColor,
      width: Math.max(2, config.pulseGlowSize * (1 - t)),
      alpha: flashAlpha,
    });

    if (t >= 1) this.impactFlash = null;
  }

  frame(deltaSeconds) {
    this.state.tick(deltaSeconds);
    this.updateFxClock(deltaSeconds);
    this.captureImpact();
    this.drawExtractorMachines(deltaSeconds);
    this.drawMiningPulse(deltaSeconds);

    if (this.lastVersion !== this.state.version) {
      this.drawGrid();
      this.redrawResources();
      this.lastVersion = this.state.version;
      window.dispatchEvent(new CustomEvent('game-state-change'));
    }
  }
}
