export const RESOURCE_TYPES = {
  coal: { label: 'Carbón', color: 0x2f3338, glow: 0x8df7ff },
  copper: { label: 'Cobre', color: 0xc66b2b, glow: 0xff9b4a },
  iron: { label: 'Hierro', color: 0xaeb8c2, glow: 0xcff7ff },
  stone: { label: 'Piedra', color: 0x8a8174, glow: 0xd9c4a1 },
};

export const DEFAULT_GRAPHICS_CONFIG = {
  gridGlow: 0.55,
  pulseEnabled: true,
  pulseRingCount: 1,
  pulseRingSpacing: 0.18,
  pulseRingSizeOffset: 0,
  pulseStartScale: 1.2,
  pulseEndScale: 0.08,
  pulseStartAlpha: 0.1,
  pulseImpactAlpha: 0.8,
  pulseLineWidth: 2,
  pulseGlowSize: 8,
  pulseGlowIntensity: 0.65,
  pulseColor: '#58ffe3',
  pulseGlowColor: '#00ffd5',
  pulseEasing: 'easeIn',
  pulseImpactFlash: 0.35,
  pulseFadeMs: 120,
  pulseTimeScale: 1,

  extractorVisualScale: 0.84,
  extractorGearSpeed: 1.25,
  extractorGlowIntensity: 0.7,
  extractorFuelRingWidth: 2.5,
  extractorBodyColor: '#5b4937',
  extractorBrassColor: '#c49445',
  extractorGlowColor: '#58ffe3',
};

export const DEFAULT_CONFIG = {
  referenceWidth: 1920,
  referenceHeight: 1080,
  gridColumns: 30,
  gridRows: 30,
  miningRate: 1,
  initialDepositAmount: 100,
  spawnRadius: 5,

  extractorMiningRate: 1,
  extractorResourcesPerCoal: 10,
  extractorFuelBufferCapacity: 5,
  extractorAutoLoadFuel: true,
  extractorCoalSelfFeed: true,
  extractorCostIron: 20,
  extractorCostCopper: 10,
  extractorCostStone: 10,
  extractorCostCoal: 0,

  ...DEFAULT_GRAPHICS_CONFIG,
};
