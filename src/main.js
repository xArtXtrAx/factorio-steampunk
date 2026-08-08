import './styles.css';
import './ui/devProfiles.css';
import { RESOURCE_TYPES } from './game/config.js';
import { GameState } from './game/state.js';
import { GameRenderer } from './game/renderer.js';
import { mountDevPanel } from './ui/devPanel.js';
import { mountPlayerPanel } from './ui/playerPanel.js';

const state = new GameState();
const canvasHost = document.querySelector('#game-canvas');
const devPanel = document.querySelector('#dev-panel');
const resourceHud = document.querySelector('#resource-hud');
const machinePanel = document.querySelector('#machine-panel');

function renderHud() {
  resourceHud.replaceChildren();
  Object.entries(RESOURCE_TYPES).forEach(([type, meta]) => {
    const item = document.createElement('div');
    item.className = `resource-counter resource-${type}`;
    item.innerHTML = `<span>${meta.label}</span><strong>${Math.floor(state.inventory[type])}</strong>`;
    resourceHud.append(item);
  });
}

window.addEventListener('game-state-change', renderHud);
renderHud();
mountPlayerPanel(state, machinePanel);
mountDevPanel(state, devPanel);

const renderer = new GameRenderer(state, canvasHost);
await renderer.init();
