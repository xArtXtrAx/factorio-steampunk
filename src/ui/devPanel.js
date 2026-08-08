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

function actionButton(label, onClick, title = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'brass-button';
  button.textContent = label;
  if (title) button.title = title;
  button.addEventListener('click', onClick);
  return button;
}

export function mountDevPanel(state, host) {
  let activeTab = 'general';
  let rangeDragActive = false;
  let renderPendingAfterDrag = false;

  const renderGeneral = () => {
    const grid = document.createElement('section');
    grid.className = 'dev-section';
    const totalCells = state.config.gridColumns * state.config.gridRows;
    grid.innerHTML = `<h2>Retícula</h2><p class="dev-subsection-note">Actual: <strong>${state.config.gridColumns} × ${state.config.gridRows}</strong> · ${totalCells.toLocaleString('es-MX')} cuadros. Los recursos conservan sus cantidades y se recolocan proporcionalmente al cambiar el tamaño.</p>`;
    grid.append(numberControl('Tamaño de retícula (N × N)', state.config.gridColumns, 8, 60, 1, (value) => state.setGridSize(value)));
    host.append(grid);

    const simulation = document.createElement('section');
    simulation.className = 'dev-section';
    simulation.innerHTML = '<h2>Simulación</h2>';
    simulation.append(
      numberControl('Extracción manual / s', state.config.miningRate, 0.1, 20, 0.1, (value) => state.setConfig('miningRate', value)),
      numberControl('Reserva inicial', state.config.initialDepositAmount, 1, 10000, 1, (value) => state.setConfig('initialDepositAmount', value)),
      numberControl('Radio aparición', state.config.spawnRadius, 1, 14, 1, (value) => state.setConfig('spawnRadius', value)),
      actionButton('REGENERAR DEPÓSITOS', () => state.regenerateDeposits()),
    );
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

  const renderMachines = () => {
    const mechanics = document.createElement('section');
    mechanics.className = 'dev-section';
    mechanics.innerHTML = '<h2>Extractor de combustión Mk.I</h2><p class="dev-subsection-note">Primer sistema automático. El preset inicial produce 1 recurso/s, convierte 1 carbón en 10 unidades de trabajo y cuesta 20 hierro + 10 cobre + 10 piedra.</p>';
    mechanics.append(
      numberControl('Producción / s', state.config.extractorMiningRate, 0.1, 20, 0.1, (value) => state.setConfig('extractorMiningRate', value)),
      numberControl('Recursos por carbón', state.config.extractorResourcesPerCoal, 1, 100, 1, (value) => state.setConfig('extractorResourcesPerCoal', value)),
      numberControl('Capacidad buffer carbón', state.config.extractorFuelBufferCapacity, 0, 50, 1, (value) => state.setConfig('extractorFuelBufferCapacity', value)),
      toggleControl('Auto-cargar desde inventario', state.config.extractorAutoLoadFuel, (value) => state.setConfig('extractorAutoLoadFuel', value)),
      toggleControl('Autoalimentación sobre carbón', state.config.extractorCoalSelfFeed, (value) => state.setConfig('extractorCoalSelfFeed', value)),
    );

    const economy = document.createElement('div');
    economy.className = 'dev-subsection';
    economy.innerHTML = '<h3>Economía y stock</h3><p class="dev-subsection-note">Costos de compra del panel del jugador y cantidad de máquinas no instaladas.</p>';
    economy.append(
      numberControl('Costo hierro', state.config.extractorCostIron, 0, 500, 1, (value) => state.setConfig('extractorCostIron', value)),
      numberControl('Costo cobre', state.config.extractorCostCopper, 0, 500, 1, (value) => state.setConfig('extractorCostCopper', value)),
      numberControl('Costo piedra', state.config.extractorCostStone, 0, 500, 1, (value) => state.setConfig('extractorCostStone', value)),
      numberControl('Costo carbón', state.config.extractorCostCoal, 0, 500, 1, (value) => state.setConfig('extractorCostCoal', value)),
      numberControl('Extractores disponibles', state.extractorStock, 0, 100, 1, (value) => state.setExtractorStock(value)),
    );
    mechanics.append(economy);

    const placementNote = document.createElement('p');
    placementNote.className = 'dev-subsection-note';
    placementNote.textContent = state.placementMode === 'burnerExtractor'
      ? 'Modo colocación activo: haz click sobre un depósito sin extractor.'
      : state.extractorStock > 0
        ? 'Hay extractores disponibles. Pulsa colocar y selecciona un depósito.'
        : 'No hay extractores disponibles; compra uno en el panel de juego o ajusta el stock aquí.';
    mechanics.append(
      placementNote,
      actionButton(
        state.placementMode === 'burnerExtractor' ? 'CANCELAR COLOCACIÓN' : 'COLOCAR EXTRACTOR Mk.I',
        () => state.placementMode === 'burnerExtractor' ? state.cancelPlacement() : state.beginExtractorPlacement(),
      ),
      actionButton('RETIRAR TODOS LOS EXTRACTORES', () => state.removeAllExtractors()),
    );
    host.append(mechanics);

    const active = document.createElement('section');
    active.className = 'dev-section';
    active.innerHTML = `<h2>Extractores activos</h2><p class="dev-subsection-note">${state.extractors.length} instalado(s) · ${state.extractorStock} disponible(s). Retirar una máquina la devuelve al stock, no a materiales.</p>`;

    if (!state.extractors.length) {
      const empty = document.createElement('p');
      empty.className = 'dev-subsection-note';
      empty.textContent = 'Todavía no hay extractores instalados.';
      active.append(empty);
    }

    state.extractors.forEach((extractor, index) => {
      const deposit = state.deposits.find((item) => item.id === extractor.depositId);
      const meta = deposit ? RESOURCE_TYPES[deposit.type] : { label: 'Sin depósito' };
      const coords = deposit ? `[${deposit.x},${deposit.y}]` : '[?,?]';
      const machine = document.createElement('div');
      machine.className = 'dev-subsection';
      machine.innerHTML = `<h3>Extractor ${index + 1} · ${meta.label} ${coords}</h3><p class="dev-subsection-note">Estado: <strong>${extractor.status}</strong> · producido: ${Math.floor(extractor.producedTotal)} · trabajo del combustible: ${extractor.fuelWorkRemaining.toFixed(1)}</p>`;
      machine.append(
        toggleControl('Activo', extractor.enabled, (value) => state.setExtractorEnabled(extractor.id, value)),
        numberControl('Carbón en buffer', extractor.fuelBuffer, 0, Math.max(0, state.config.extractorFuelBufferCapacity), 1, (value) => state.setExtractorFuel(extractor.id, value)),
        actionButton('RETIRAR EXTRACTOR', () => state.removeExtractor(extractor.id)),
      );
      active.append(machine);
    });
    host.append(active);
  };

  const renderGraphics = () => {
    const graphicsEnvironment = document.createElement('section');
    graphicsEnvironment.className = 'dev-section';
    graphicsEnvironment.innerHTML = '<h2>Entorno gráfico</h2>';

    const resetGraphics = actionButton(
      'RESTAURAR VALORES GRÁFICOS',
      () => state.resetGraphicsToDefaults(),
      'Restaura únicamente la configuración visual al preset inicial sin modificar simulación, inventario, depósitos ni máquinas.',
    );

    graphicsEnvironment.append(
      resetGraphics,
      numberControl('Brillo retícula', state.config.gridGlow, 0.05, 1, 0.05, (value) => state.setConfig('gridGlow', value)),
    );

    const extractionFx = document.createElement('div');
    extractionFx.className = 'dev-subsection';
    extractionFx.innerHTML = '<h3>Efectos de extracción</h3><p class="dev-subsection-note">Feedback visual sincronizado con cada unidad extraída, manual o automáticamente.</p>';
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

    const extractorFx = document.createElement('div');
    extractorFx.className = 'dev-subsection';
    extractorFx.innerHTML = '<h3>Extractores</h3><p class="dev-subsection-note">Apariencia de las máquinas de combustión instaladas sobre depósitos.</p>';
    extractorFx.append(
      numberControl('Escala visual × celda', state.config.extractorVisualScale, 0.3, 1.2, 0.01, (value) => state.setConfig('extractorVisualScale', value)),
      numberControl('Velocidad engranaje', state.config.extractorGearSpeed, 0, 5, 0.05, (value) => state.setConfig('extractorGearSpeed', value)),
      numberControl('Intensidad glow extractor', state.config.extractorGlowIntensity, 0, 1, 0.01, (value) => state.setConfig('extractorGlowIntensity', value)),
      numberControl('Grosor aro combustible', state.config.extractorFuelRingWidth, 0.5, 10, 0.5, (value) => state.setConfig('extractorFuelRingWidth', value)),
      colorControl('Color cuerpo extractor', state.config.extractorBodyColor, (value) => state.setConfig('extractorBodyColor', value)),
      colorControl('Color latón extractor', state.config.extractorBrassColor, (value) => state.setConfig('extractorBrassColor', value)),
      colorControl('Color glow extractor', state.config.extractorGlowColor, (value) => state.setConfig('extractorGlowColor', value)),
    );

    graphicsEnvironment.append(extractionFx, extractorFx);
    host.append(graphicsEnvironment);
  };

  const render = () => {
    host.replaceChildren();

    const title = document.createElement('div');
    title.className = 'panel-title';
    title.innerHTML = '<small>FORGE CONTROL</small><h1>DEV PANEL</h1><p>Control total de simulación y presentación durante desarrollo</p>';
    host.append(title);

    const tabs = document.createElement('nav');
    tabs.className = 'dev-tabs';
    tabs.setAttribute('aria-label', 'Secciones del panel de desarrollo');
    tabs.append(
      tabButton('General', 'general', activeTab, (nextTab) => { activeTab = nextTab; render(); }),
      tabButton('Máquinas', 'machines', activeTab, (nextTab) => { activeTab = nextTab; render(); }),
      tabButton('Gráficos', 'graphics', activeTab, (nextTab) => { activeTab = nextTab; render(); }),
    );
    host.append(tabs);

    host.append(actionButton(
      'RESTAURAR VALORES INICIALES',
      () => state.resetToDefaults(),
      'Restaura todo el juego al estado inicial: configuración, inventario, depósitos, máquinas y sistemas futuros incluidos en el preset global.',
    ));

    if (activeTab === 'graphics') renderGraphics();
    else if (activeTab === 'machines') renderMachines();
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
