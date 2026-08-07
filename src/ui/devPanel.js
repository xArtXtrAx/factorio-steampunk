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

function toggleControl(label, value, onInput) {
  const row = document.createElement('label');
  row.className = 'control-row control-toggle';
  const text = document.createElement('span');
  text.textContent = label;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = Boolean(value);
  input.addEventListener('change', () => onInput(input.checked));
  row.append(text, input);
  return row;
}

function colorControl(label, value, onInput) {
  const row = document.createElement('label');
  row.className = 'control-row';
  row.innerHTML = `<span>${label}</span>`;
  const fields = document.createElement('div');
  fields.className = 'color-fields';
  const color = document.createElement('input');
  color.type = 'color';
  color.value = value;
  const text = document.createElement('input');
  text.type = 'text';
  text.value = value;

  const sync = (raw) => {
    const normalized = /^#[0-9a-f]{6}$/i.test(raw) ? raw.toLowerCase() : color.value;
    color.value = normalized;
    text.value = normalized;
    onInput(normalized);
  };

  color.addEventListener('input', () => sync(color.value));
  text.addEventListener('change', () => sync(text.value.trim()));
  fields.append(color, text);
  row.append(fields);
  return row;
}

function selectControl(label, value, options, onInput) {
  const row = document.createElement('label');
  row.className = 'control-row';
  const text = document.createElement('span');
  text.textContent = label;
  const select = document.createElement('select');
  options.forEach(([optionValue, optionLabel]) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionLabel;
    option.selected = optionValue === value;
    select.append(option);
  });
  select.addEventListener('change', () => onInput(select.value));
  row.append(text, select);
  return row;
}

function tabButton(label, tabId, activeTab, onSelect) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `dev-tab${activeTab === tabId ? ' is-active' : ''}`;
  button.textContent = label;
  button.setAttribute('aria-selected', String(activeTab === tabId));
  button.addEventListener('click', () => onSelect(tabId));
  return button;
}

export function mountDevPanel(state, host) {
  let activeTab = 'general';
  let rangeDragActive = false;
  let renderPendingAfterDrag = false;

  const renderGeneral = () => {
    const simulation = document.createElement('section');
    simulation.className = 'dev-section';
    simulation.innerHTML = '<h2>Simulación</h2>';
    simulation.append(
      numberControl('Extracción / s', state.config.miningRate, 0.1, 20, 0.1, (value) => state.setConfig('miningRate', value)),
      numberControl('Reserva inicial', state.config.initialDepositAmount, 1, 10000, 1, (value) => state.setConfig('initialDepositAmount', value)),
      numberControl('Radio aparición', state.config.spawnRadius, 1, 14, 1, (value) => state.setConfig('spawnRadius', value)),
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

  const renderGraphics = () => {
    const graphicsEnvironment = document.createElement('section');
    graphicsEnvironment.className = 'dev-section';
    graphicsEnvironment.innerHTML = '<h2>Entorno gráfico</h2>';

    const resetGraphics = document.createElement('button');
    resetGraphics.type = 'button';
    resetGraphics.className = 'brass-button';
    resetGraphics.textContent = 'RESTAURAR VALORES GRÁFICOS';
    resetGraphics.title = 'Restaura únicamente la configuración visual al preset inicial sin modificar simulación, inventario ni depósitos.';
    resetGraphics.addEventListener('click', () => state.resetGraphicsToDefaults());

    graphicsEnvironment.append(
      resetGraphics,
      numberControl('Brillo retícula', state.config.gridGlow, 0.05, 1, 0.05, (value) => state.setConfig('gridGlow', value)),
    );

    const extractionFx = document.createElement('div');
    extractionFx.className = 'dev-subsection';
    extractionFx.innerHTML = '<h3>Efectos de extracción</h3><p class="dev-subsection-note">Feedback visual sincronizado con cada unidad extraída.</p>';
    extractionFx.append(
      toggleControl('Activar pulso', state.config.pulseEnabled, (value) => state.setConfig('pulseEnabled', value)),
      numberControl('Cantidad de anillos', state.config.pulseRingCount, 1, 6, 1, (value) => state.setConfig('pulseRingCount', value)),
      numberControl('Separación temporal', state.config.pulseRingSpacing, 0, 0.3, 0.01, (value) => state.setConfig('pulseRingSpacing', value)),
      numberControl('Desfase de tamaño', state.config.pulseRingSizeOffset, -0.15, 0.3, 0.01, (value) => state.setConfig('pulseRingSizeOffset', value)),
      numberControl('Diámetro inicial × celda', state.config.pulseStartScale, 0.2, 3, 0.01, (value) => state.setConfig('pulseStartScale', value)),
      numberControl('Diámetro final × celda', state.config.pulseEndScale, 0, 1, 0.01, (value) => state.setConfig('pulseEndScale', value)),
      numberControl('Opacidad inicial', state.config.pulseStartAlpha, 0, 1, 0.01, (value) => state.setConfig('pulseStartAlpha', value)),
      numberControl('Opacidad impacto', state.config.pulseImpactAlpha, 0, 1, 0.01, (value) => state.setConfig('pulseImpactAlpha', value)),
      numberControl('Grosor del anillo', state.config.pulseLineWidth, 0.5, 12, 0.5, (value) => state.setConfig('pulseLineWidth', value)),
      numberControl('Tamaño glow', state.config.pulseGlowSize, 0, 30, 1, (value) => state.setConfig('pulseGlowSize', value)),
      numberControl('Intensidad glow', state.config.pulseGlowIntensity, 0, 1, 0.01, (value) => state.setConfig('pulseGlowIntensity', value)),
      colorControl('Color del anillo', state.config.pulseColor, (value) => state.setConfig('pulseColor', value)),
      colorControl('Color del glow', state.config.pulseGlowColor, (value) => state.setConfig('pulseGlowColor', value)),
      selectControl('Curva de contracción', state.config.pulseEasing, [
        ['linear', 'Lineal'],
        ['easeIn', 'Ease In'],
        ['easeOut', 'Ease Out'],
        ['easeInOut', 'Ease In-Out'],
      ], (value) => state.setConfig('pulseEasing', value)),
      numberControl('Flash de impacto', state.config.pulseImpactFlash, 0, 1, 0.01, (value) => state.setConfig('pulseImpactFlash', value)),
      numberControl('Fade de impacto (ms)', state.config.pulseFadeMs, 0, 1000, 10, (value) => state.setConfig('pulseFadeMs', value)),
      numberControl('Multiplicador temporal', state.config.pulseTimeScale, 0.1, 3, 0.05, (value) => state.setConfig('pulseTimeScale', value)),
    );

    graphicsEnvironment.append(extractionFx);
    host.append(graphicsEnvironment);
  };

  const render = () => {
    host.replaceChildren();

    const title = document.createElement('div');
    title.className = 'panel-title';
    title.innerHTML = '<small>FORGE CONTROL</small><h1>DEV PANEL</h1><p>Parámetros vivos de simulación y presentación</p>';
    host.append(title);

    const tabs = document.createElement('nav');
    tabs.className = 'dev-tabs';
    tabs.setAttribute('aria-label', 'Secciones del panel de desarrollo');
    tabs.append(
      tabButton('General', 'general', activeTab, (nextTab) => {
        activeTab = nextTab;
        render();
      }),
      tabButton('Gráficos', 'graphics', activeTab, (nextTab) => {
        activeTab = nextTab;
        render();
      }),
    );
    host.append(tabs);

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'brass-button';
    reset.textContent = 'RESTAURAR VALORES INICIALES';
    reset.title = 'Restaura todo el juego al estado inicial: configuración, inventario, depósitos y sistemas futuros incluidos en el preset global.';
    reset.addEventListener('click', () => state.resetToDefaults());
    host.append(reset);

    if (activeTab === 'graphics') renderGraphics();
    else renderGeneral();
  };

  let scheduled = false;
  const requestRender = () => {
    if (rangeDragActive) {
      renderPendingAfterDrag = true;
      return;
    }
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  };

  const finishRangeDrag = () => {
    if (!rangeDragActive) return;
    rangeDragActive = false;
    if (renderPendingAfterDrag) {
      renderPendingAfterDrag = false;
      requestRender();
    }
  };

  host.addEventListener('pointerdown', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.type === 'range') {
      rangeDragActive = true;
      renderPendingAfterDrag = false;
    }
  });
  window.addEventListener('pointerup', finishRangeDrag);
  window.addEventListener('pointercancel', finishRangeDrag);
  window.addEventListener('blur', finishRangeDrag);
  window.addEventListener('game-state-change', requestRender);
  render();
}
