# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Principio de desarrollo: control total desde DEV

Durante desarrollo buscamos **control total y explícito sobre mecánicas y presentación** antes de consolidar balance definitivo.

- Toda mecánica nueva expone en DEV sus parámetros de balance relevantes.
- Toda presentación/FX nueva expone tuning razonable en `Gráficos`.
- Estados de entidades nuevas deben ser inspeccionables y, cuando sea razonable, manipulables desde DEV.
- Presets iniciales son hipótesis de diseño, no balance definitivo.
- Resets parciales/globales evolucionan junto con los sistemas.
- Sólo se ocultan o fijan parámetros por una decisión explícita de diseño.

El DEV Panel es una herramienta de experimentación y diagnóstico; no es la interfaz final del jugador.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Fase integrada | `v0.2 — Extractor Mk.I + economía + perfiles de arranque DEV` |
| Rama estable | `main` |
| Rama activa | `main` |
| Integración | `PR #2 fusionado` |
| Merge de referencia | `5e13885a061a17e616f44496c72f1ce215700ba3` |
| Estado del build | `hubo ejecución local funcional durante el desarrollo del extractor; build específico del checkpoint final posterior a perfiles/inventario no quedó confirmado` |
| Estado de pruebas | `apariencia general/minimalista validada positivamente por el usuario; recorrido sistemático final de economía, perfiles y BUG-LOCAL-001 sigue pendiente` |
| Bugs abiertos relevantes | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

**Discutir y definir el objetivo de la siguiente fase antes de modificar código.** Una vez acordado el alcance, crear una rama nueva desde `main`. Antes o al comienzo de esa rama, ejecutar `npm run build` sobre el `main` integrado y hacer una pasada corta de regresión de v0.2 para saldar la deuda de validación documentada.

No marcar las validaciones pendientes como superadas por el solo hecho de haber integrado PR #2; la integración fue autorizada explícitamente por el propietario del proyecto.

## v0.2 integrada

### Extractor de combustión Mk.I

Preset vigente:

- tamaño: `1×1`;
- producción: `1 recurso/s`;
- eficiencia: `10 recursos / carbón`;
- buffer de carbón: `5`;
- auto-carga desde inventario: activa;
- autoalimentación sobre carbón: activa;
- costo: `20 hierro + 10 cobre + 10 piedra + 0 carbón`;
- stock inicial: `0`.

Contrato económico:

- comprar descuenta materiales y suma una máquina al stock;
- colocar consume una máquina del stock;
- retirar devuelve la máquina al stock, sin reembolsar materiales;
- regenerar depósitos recupera máquinas instaladas al stock antes de reemplazar los depósitos.

La apariencia minimalista del extractor fue validada positivamente por el usuario: cuerpo oscuro/latón, rotor central, glow cian, aro de combustible e integración con el pulso de extracción.

### Panel de jugador

`TALLER DE CAMPO — Extractores Mk.I` vive dentro del área de juego y permanece separado del DEV Panel. Permite:

- comprar extractores;
- ver disponibles e instalados;
- iniciar/cancelar colocación;
- consultar recurso, coordenadas y estado de cada máquina instalada.

### DEV Panel

Pestañas vigentes:

- `General`: perfiles de arranque, retícula, simulación manual, inventario y depósitos activos;
- `Máquinas`: producción, eficiencia, combustible, costos, stock y manipulación de extractores;
- `Gráficos`: entorno, FX de extracción y tuning visual del extractor.

`DEV > General > Inventario` representa recursos que posee el jugador. `Depósitos activos` representa la reserva restante de cada casilla del mapa; ambos conceptos se mantienen separados.

Los sliders aplican cambios continuamente. Los campos numéricos permiten escribir cifras completas y confirman al terminar (`change`/Enter), evitando pérdida de foco.

El inventario manual usa mínimo `0` y `inventoryEditMax` como máximo. El preset original de `inventoryEditMax` es `100000` y puede ajustarse desde DEV hasta `1000000`.

### Perfiles de arranque DEV

- `Original · bloqueado`: definido por `DEFAULT_CONFIG` + `resetToDefaults()`, nunca se serializa ni puede sobrescribirse.
- `Temporal 1–3`: tres slots persistentes y sobrescribibles mediante `localStorage`.
- Los snapshots guardan configuración, inventario, depósitos/posiciones, stock y máquinas instaladas.
- Al cargar se eliminan estados transitorios como minería activa, colocación y último evento de extracción.
- Esta persistencia es exclusivamente DEV y no constituye el futuro sistema de saves del jugador.

Referencia: `docs/decisiones/ADR-002-perfiles-dev-localstorage.md`.

## Contratos de estado vigentes

- `DEFAULT_CONFIG` es la fuente de verdad del arranque canónico global.
- `DEFAULT_GRAPHICS_CONFIG` es la fuente del preset visual.
- `resetToDefaults()` define el perfil original bloqueado y debe incorporar futuros sistemas.
- `resetGraphicsToDefaults()` sólo modifica presentación/FX.
- `captureStartProfile()` serializa el estado estable de un comienzo experimental.
- `restoreStartProfile()` valida/normaliza snapshots y limpia estados transitorios.
- IDs de depósitos se regeneran al recrear mapa; las máquinas deben tratar esas referencias con cuidado.

## Arquitectura vigente

- PixiJS 8.19.0 + Vite 8.1.5.
- `src/game/config.js`: recursos, balance, economía y presets visuales.
- `src/game/state.js`: minería, retícula, economía, stock, extractores, combustible, perfiles y resets.
- `src/game/startProfiles.js`: persistencia DEV versionada.
- `src/game/renderer.js`: retícula, depósitos, máquinas y FX.
- `src/ui/playerPanel.js`: UI de gameplay del extractor.
- `src/ui/devPanel.js`: herramientas DEV.
- `src/ui/devProfiles.css`: presentación de perfiles.
- `src/main.js`: composición, HUD y montaje de UI.

## Decisiones activas

| ID | Decisión | Motivo |
|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D y expansión modular |
| `ADR-002` | Tres perfiles DEV en `localStorage`, original fuera de persistencia | Experimentación persistente sin convertir DEV en sistema de saves |
| `DEV-001` | Toda mecánica nueva expone parámetros relevantes en DEV | Tuning antes de fijar balance |
| `UI-002` | Sliders continuos; campos numéricos confirman al terminar | Fluidez y edición textual sin pérdida de foco |
| `MACHINE-001` | Extractor Mk.I 1×1 ligado a depósito | Legibilidad espacial |
| `FUEL-001` | Combustible expresado en recursos por carbón | Relación fácil de entender y tunear |
| `ECON-001` | Extractor cuesta 20 hierro + 10 cobre + 10 piedra | Fase manual breve antes de automatizar |
| `ECON-002` | Compra crea stock; colocación consume stock; retirada recupera máquina | Separar propiedad y ubicación física |
| `UI-003` | Panel jugador separado del DEV Panel | Gameplay real distinto de herramientas de tuning |
| `STATE-001` | Reset global evoluciona con todos los sistemas | Retorno reproducible al arranque canónico |

## Deuda de validación heredada de v0.2

- Ejecutar `npm run build` sobre el `main` integrado.
- Recorrer `BUG-LOCAL-001`: varias cifras, Enter/blur, negativos y máximo configurable.
- Guardar/cargar/sobrescribir los tres perfiles y verificar persistencia tras recarga.
- Probar compra con inventario insuficiente, exacto y excedente.
- Probar compra → stock → colocación → retirada → recolocación.
- Validar autoalimentación sobre carbón y consumo `1 carbón → 10 recursos`.
- Verificar panel de jugador en retículas 8×8, 30×30 y 60×60.

## Historial de hitos

### 2026-08-07 — Integración v0.2

- PR #2 `Implementa extractor de combustión Mk.I` fusionado a `main`.
- Merge: `5e13885a061a17e616f44496c72f1ce215700ba3`.
- La integración fue autorizada explícitamente aun con la deuda de validación final registrada arriba.
- Rama activa vuelve a `main` hasta definir la siguiente fase.

### 2026-08-07 — Edición numérica e inventario DEV

- Registrado `BUG-LOCAL-001`: campos numéricos perdían foco al mutar estado en cada tecla.
- Sliders quedaron continuos; campos numéricos confirman al terminar.
- Añadido bloqueo/normalización de negativos y `inventoryEditMax`.

### 2026-08-07 — Perfiles de arranque DEV

- Añadido perfil original bloqueado y tres temporales persistentes/sobrescribibles.
- Persistencia aislada en `localStorage` y documentada en ADR-002.

### 2026-08-07 — Economía y panel del extractor

- Acordado costo base `20 hierro + 10 cobre + 10 piedra`.
- Añadidos compra, stock, colocación/retirada y `TALLER DE CAMPO`.
- Apariencia minimalista validada positivamente por el usuario.

### 2026-08-07 — Inicio v0.2

- Añadido Extractor Mk.I con producción automática, combustible, auto-carga y autoalimentación.
- Formalizado `DEV-001`.

### 2026-08-07 — Integración v0.1

- PR #1 fusionado a `main`, merge `fe55692aa95adea043c19d8f1f8b121003c5c1d9`.
- v0.1 estableció minería manual, retícula, HUD, DEV Panel, FX y resets.
