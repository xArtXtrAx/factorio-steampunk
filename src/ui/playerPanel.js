import { RESOURCE_TYPES } from '../game/config.js';

function resourceCostLabel(state) {
  const cost = state.getExtractorCost();
  return [
    ['iron', cost.iron],
    ['copper', cost.copper],
    ['stone', cost.stone],
    ['coal', cost.coal],
  ]
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => `${amount} ${RESOURCE_TYPES[type].label}`)
    .join(' · ');
}

export function mountPlayerPanel(state, host) {
  const render = () => {
    host.replaceChildren();

    const heading = document.createElement('div');
    heading.className = 'machine-panel-heading';
    heading.innerHTML = '<small>TALLER DE CAMPO</small><strong>Extractores Mk.I</strong>';

    const summary = document.createElement('div');
    summary.className = 'machine-panel-summary';
    summary.innerHTML = `
      <span>Disponibles <strong>${state.extractorStock}</strong></span>
      <span>Instalados <strong>${state.extractors.length}</strong></span>
    `;

    const buy = document.createElement('button');
    buy.type = 'button';
    buy.className = 'machine-panel-button';
    buy.disabled = !state.canAffordExtractor();
    buy.innerHTML = `<span>COMPRAR EXTRACTOR</span><small>${resourceCostLabel(state)}</small>`;
    buy.addEventListener('click', () => state.buyExtractor());

    const place = document.createElement('button');
    place.type = 'button';
    place.className = `machine-panel-button machine-panel-button-secondary${state.placementMode === 'burnerExtractor' ? ' is-active' : ''}`;
    place.disabled = state.extractorStock <= 0 && state.placementMode !== 'burnerExtractor';
    place.textContent = state.placementMode === 'burnerExtractor'
      ? 'CANCELAR COLOCACIÓN'
      : `COLOCAR DISPONIBLE (${state.extractorStock})`;
    place.addEventListener('click', () => {
      if (state.placementMode === 'burnerExtractor') state.cancelPlacement();
      else state.beginExtractorPlacement();
    });

    const status = document.createElement('p');
    status.className = 'machine-panel-status';
    if (state.placementMode === 'burnerExtractor') {
      status.textContent = 'Selecciona un depósito libre en la retícula.';
    } else if (state.extractorStock > 0) {
      status.textContent = 'Hay máquinas listas para instalar.';
    } else {
      status.textContent = 'Compra un extractor para comenzar la automatización.';
    }

    const locations = document.createElement('div');
    locations.className = 'machine-panel-locations';
    const locationsTitle = document.createElement('span');
    locationsTitle.className = 'machine-panel-label';
    locationsTitle.textContent = 'Ubicaciones';
    locations.append(locationsTitle);

    if (!state.extractors.length) {
      const empty = document.createElement('p');
      empty.className = 'machine-panel-empty';
      empty.textContent = 'Ningún extractor instalado.';
      locations.append(empty);
    } else {
      const list = document.createElement('ul');
      state.extractors.forEach((extractor, index) => {
        const deposit = state.deposits.find((item) => item.id === extractor.depositId);
        const item = document.createElement('li');
        if (!deposit) {
          item.textContent = `#${index + 1} · ubicación desconocida`;
        } else {
          const meta = RESOURCE_TYPES[deposit.type];
          item.innerHTML = `<strong>#${index + 1} ${meta.label}</strong><span>[${deposit.x}, ${deposit.y}] · ${extractor.status}</span>`;
        }
        list.append(item);
      });
      locations.append(list);
    }

    host.append(heading, summary, buy, place, status, locations);
  };

  window.addEventListener('game-state-change', render);
  render();
}
