export const RESOURCE_TYPES = {
  coal: { label: 'Carbón', color: 0x2f3338, glow: 0x8df7ff },
  copper: { label: 'Cobre', color: 0xc66b2b, glow: 0xff9b4a },
  iron: { label: 'Hierro', color: 0xaeb8c2, glow: 0xcff7ff },
  stone: { label: 'Piedra', color: 0x8a8174, glow: 0xd9c4a1 },
};

export const DEFAULT_CONFIG = {
  referenceWidth: 1920,
  referenceHeight: 1080,
  gridColumns: 30,
  gridRows: 30,
  miningRate: 1,
  initialDepositAmount: 100,
  spawnRadius: 5,
  gridGlow: 0.55,
  pulseSpeed: 1,
};
