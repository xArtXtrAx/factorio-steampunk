import { Application, Container, Graphics, Text } from 'pixi.js';
import { RESOURCE_TYPES } from './config.js';

export class GameRenderer {
  constructor(state, host) {
    this.state = state;
    this.host = host;
    this.app = new Application();
    this.gridLayer = new Graphics();
    this.resourceLayer = new Container();
    this.lastVersion = -1;
  }

  async init() {
    await this.app.init({
      resizeTo: this.host,
      antialias: true,
      backgroundAlpha: 0,
      preference: 'webgl',
    });

    this.host.appendChild(this.app.canvas);
    this.app.stage.addChild(this.gridLayer, this.resourceLayer);
    this.app.ticker.add((ticker) => this.frame(ticker.deltaMS / 1000));
    window.addEventListener('pointerup', () => this.state.stopMining());
    window.addEventListener('pointercancel', () => this.state.stopMining());
    window.addEventListener('resize', () => this.drawGrid());
    this.drawGrid();
    this.redrawResources();
  }

  getLayout() {
    const { gridColumns, gridRows } = this.state.config;
    const pad = 22;
    const width = this.app.renderer.width;
    const height = this.app.renderer.height;
    const cell = Math.floor(Math.min((width - pad * 2) / gridColumns, (height - pad * 2) / gridRows));
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
      const group = new Container();
      const tile = new Graphics();
      const px = x + deposit.x * cell;
      const py = y + deposit.y * cell;
      const inset = Math.max(3, cell * 0.12);

      tile.roundRect(px + inset, py + inset, cell - inset * 2, cell - inset * 2, Math.max(4, cell * 0.14))
        .fill({ color: meta.color, alpha: deposit.amount > 0 ? 0.95 : 0.18 })
        .stroke({ color: meta.glow, width: 2, alpha: deposit.amount > 0 ? 0.95 : 0.25 });
      tile.eventMode = deposit.amount > 0 ? 'static' : 'none';
      tile.cursor = deposit.amount > 0 ? 'pointer' : 'default';
      tile.on('pointerdown', (event) => {
        if (event.button === 0) this.state.startMining(deposit.id);
      });

      const amount = new Text({
        text: String(Math.floor(deposit.amount)),
        style: {
          fontFamily: 'Georgia, serif',
          fontSize: Math.max(10, Math.floor(cell * 0.28)),
          fill: 0xf5e8ca,
          fontWeight: '700',
          dropShadow: { color: 0x000000, alpha: 0.8, distance: 1, blur: 2 },
        },
      });
      amount.anchor.set(0.5);
      amount.position.set(px + cell / 2, py + cell / 2);
      group.addChild(tile, amount);
      this.resourceLayer.addChild(group);
    });
  }

  frame(deltaSeconds) {
    this.state.tick(deltaSeconds);
    if (this.lastVersion !== this.state.version) {
      this.drawGrid();
      this.redrawResources();
      this.lastVersion = this.state.version;
      window.dispatchEvent(new CustomEvent('game-state-change'));
    }
  }
}
