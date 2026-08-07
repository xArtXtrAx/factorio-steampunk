import { RESOURCE_TYPES } from '../game/config.js';

function numberControl(label, value, min, max, step, onInput) {
  const row = document.createElement('label');
  row.className = 'control-row';
  row.innerHTML = `<span>${label}</span>`;

  const fields = document.createElement('div');
  fields.className = 'control-fields';
  const range = document.createElement('input');
  range.type = 'range';
  range.min = min;
  range.max = max;
  range.step = step;
  range.value = value;
  const number = document.createElement('input');
  number.type = 'number';
  number.min = min;
  number.max = max;
  number.step = step;
  number.value = value;

  const sync = (raw) => {
    const next = Math.max(Number(min), Math.min(Number(max), Number(raw)));
    range.value = next;
    number.value = next;
    onInput(next);
  };

  range.addEventListener('input', () => sync(range.value));
  number.addEventListener('input', () => sync(number.value));
  fields.append(range, number);
  row.append(fields);
  return row;
}

export function mountDevPanel(state, host) {
  const render = () => {
    host.replaceChildren();

    const title = document.createElement('div');
    title.className = 'panel-title';
    title.innerHTML = '<small>FORGE CONTROL</small><h1>DEV PANEL</h1><p>Parámetros vivos de simulación</p>';
    host.append(title);

    const simulation = document.createElement('section');
    simulation.className = 'dev-section';
    simulation.innerHTML = '<h2>Simulación</h2>';
    simulation.append(
      numberControl('Extracción / s', state.config.miningRate, 0.1, 20, 0.1, (value) => state.setConfig('miningRate', value)),
      numberControl('Reserva inicial', state.config.initialDepositAmount, 1, 10000, 1, (value) => state.setConfig('initialDepositAmount', value)),
      numberControl('Radio aparición', state.config.spawnRadius, 1, 14, 1, (value) => state.setConfig('spawnRadius', value)),
      numberControl('Brillo retícula', state.config.gridGlow, 0.05, 1, 0.05, (value) => state.setConfig('gridGlow', value)),
      numberControl('Pulso FX', state.config.pulseSpeed, 0, 5, 0.1, (value) => state.setConfig('pulseSpeed', value)),
    );

    const regenerate = document.createElement('button');
    regenerate.className = 'brass-button';
    regenerate.textContent = 'REGENERAR DEPÓSITOS';
    regenerate.addEventListener('click', () => state.regenerateDeposits());
    simulation.append(regenerate);
    host.append(simulation);

    const inventory = document.createElement('section');
    inventory.className = 'dev-section';
    inventory.innerHTML = '<h2>Inventario</h2>';
    Object.entries(RESOURCE_TYPES).forEach(([type, meta]) => {
      inventory.append(numberControl(meta.label, state.inventory[type], 0, 100000, 1, (value) => state.setInventory(type, value)));
    });
    host.append(inventory);

    const deposits = document.createElement('section');
    deposits.className = 'dev-section';
    deposits.innerHTML = '<h2>Depósitos activos</h2>';
    state.deposits.forEach((deposit) => {
      const meta = RESOURCE_TYPES[deposit.type];
      deposits.append(numberControl(`${meta.label} [${deposit.x},${deposit.y}]`, deposit.amount, 0, 10000, 1, (value) => state.setDepositAmount(deposit.id, value)));
    });
    host.append(deposits);
  };

  let scheduled = false;
  const requestRender = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  };

  window.addEventListener('game-state-change', requestRender);
  render();
}
