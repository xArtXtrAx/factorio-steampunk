import { RESOURCE_TYPES } from '../game/config.js';

function costLabel(cost) {
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
    heading.innerHTML = '<small>TALLER DE CAMPO</small><strong>Automatización Mk.I</strong>';

    const summary = document.createElement('div');
    summary.className = 'machine-panel-summary';
    summary.innerHTML = `
      <span>Extractores <strong>${state.extractorStock}</strong> / ${state.extractors.length}</span>
      <span>Tolvas <strong>${state.hopperStock}</strong> / ${state.hoppers.length}</span>
    `;

    const extractorLabel = document.createElement('span');
    extractorLabel.className = 'machine-panel-label';
    extractorLabel.textContent = 'Extractor de combustión Mk.I';

    const buyExtractor = document.createElement('button');
    buyExtractor.type = 'button';
    buyExtractor.className = 'machine-panel-button';
    buyExtractor.disabled = !state.canAffordExtractor();
    buyExtractor.innerHTML = `<span>COMPRAR EXTRACTOR</span><small>${costLabel(state.getExtractorCost())}</small>`;
    buyExtractor.addEventListener('click', () => state.buyExtractor());

    const placeExtractor = document.createElement('button');
    placeExtractor.type = 'button';
    placeExtractor.className = `machine-panel-button machine-panel-button-secondary${state.placementMode === 'burnerExtractor' ? ' is-active' : ''}`;
    placeExtractor.disabled = state.extractorStock <= 0 && state.placementMode !== 'burnerExtractor';
    placeExtractor.textContent = state.placementMode === 'burnerExtractor'
      ? 'CANCELAR COLOCACIÓN'
      : `COLOCAR EXTRACTOR (${state.extractorStock})`;
    placeExtractor.addEventListener('click', () => {
      if (state.placementMode === 'burnerExtractor') state.cancelPlacement();
      else state.beginExtractorPlacement();
    });

    const hopperLabel = document.createElement('span');
    hopperLabel.className = 'machine-panel-label';
    hopperLabel.textContent = 'Tolva Mk.I';

    const buyHopper = document.createElement('button');
    buyHopper.type = 'button';
    buyHopper.className = 'machine-panel-button';
    buyHopper.disabled = !state.canAffordHopper();
    buyHopper.innerHTML = `<span>COMPRAR TOLVA</span><small>${costLabel(state.getHopperCost())}</small>`;
    buyHopper.addEventListener('click', () => state.buyHopper());

    const placeHopper = document.createElement('button');
    placeHopper.type = 'button';
    placeHopper.className = `machine-panel-button machine-panel-button-secondary${state.placementMode === 'storageHopper' ? ' is-active' : ''}`;
    placeHopper.disabled = state.hopperStock <= 0 && state.placementMode !== 'storageHopper';
    placeHopper.textContent = state.placementMode === 'storageHopper'
      ? 'CANCELAR COLOCACIÓN'
      : `COLOCAR TOLVA (${state.hopperStock})`;
    placeHopper.addEventListener('click', () => {
      if (state.placementMode === 'storageHopper') state.cancelPlacement();
      else state.beginHopperPlacement();
    });

    const status = document.createElement('p');
    status.className = 'machine-panel-status';
    if (state.placementMode === 'burnerExtractor') {
      status.textContent = 'Selecciona una celda de recurso libre.';
    } else if (state.placementMode === 'storageHopper') {
      status.textContent = 'Selecciona una celda vacía. Una tolva adyacente ortogonalmente recibe la salida del extractor.';
    } else {
      status.textContent = 'Haz click sobre una tolva con contenido para recogerlo al inventario.';
    }

    const locations = document.createElement('div');
    locations.className = 'machine-panel-locations';
    const locationsTitle = document.createElement('span');
    locationsTitle.className = 'machine-panel-label';
    locationsTitle.textContent = 'Instalaciones';
    locations.append(locationsTitle);

    if (!state.extractors.length && !state.hoppers.length) {
      const empty = document.createElement('p');
      empty.className = 'machine-panel-empty';
      empty.textContent = 'Ninguna instalación construida.';
      locations.append(empty);
    } else {
      const list = document.createElement('ul');
      state.extractors.forEach((extractor, index) => {
        const deposit = state.deposits.find((item) => item.id === extractor.depositId);
        const item = document.createElement('li');
        if (!deposit) item.textContent = `Extractor #${index + 1} · ubicación desconocida`;
        else {
          const meta = RESOURCE_TYPES[deposit.type];
          item.innerHTML = `<strong>Extractor #${index + 1} · ${meta.label}</strong><span>[${deposit.x}, ${deposit.y}] · ${extractor.status}</span>`;
        }
        list.append(item);
      });

      const capacity = Math.max(1, Math.floor(Number(state.config.hopperCapacity) || 1));
      state.hoppers.forEach((hopper, index) => {
        const item = document.createElement('li');
        const resource = hopper.resourceType ? RESOURCE_TYPES[hopper.resourceType].label : 'Vacía';
        item.innerHTML = `<strong>Tolva #${index + 1} · ${resource}</strong><span>[${hopper.x}, ${hopper.y}] · ${Math.floor(hopper.amount)} / ${capacity}</span>`;
        list.append(item);
      });
      locations.append(list);
    }

    host.append(
      heading,
      summary,
      extractorLabel,
      buyExtractor,
      placeExtractor,
      hopperLabel,
      buyHopper,
      placeHopper,
      status,
      locations,
    );
  };

  window.addEventListener('game-state-change', render);
  render();
}
