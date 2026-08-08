# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Principio de desarrollo: control total desde DEV

Durante desarrollo buscamos **control total y explícito sobre mecánicas y presentación** antes de consolidar balance definitivo.

- Toda mecánica nueva expone desde su implementación en DEV sus parámetros de balance relevantes, ubicados contextualmente en la pestaña adecuada.
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
| Dirección siguiente acordada | `v0.3 — yacimientos multicelda y logística básica, afinada por subfases` |
| Rama estable | `main` |
| Rama activa | `main` |
| Integración | `PR #2 fusionado` |
| Merge v0.2 | `5e13885a061a17e616f44496c72f1ce215700ba3` |
| Estado del build | `build específico del checkpoint final v0.2 todavía pendiente de confirmación` |
| Estado de pruebas | `apariencia del extractor validada positivamente; regresión sistemática final de v0.2 sigue pendiente` |
| Bugs abiertos relevantes | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

**Diseñar y acordar la primera subfase de v0.3: yacimientos multicelda y múltiples yacimientos por recurso.** No implementar todavía tolvas, carritos ni transporte. Primero definir el contrato espacial, sus parámetros DEV y la compatibilidad con minería, extractores, perfiles y regeneración. Una vez acordado ese alcance, crear una rama nueva desde `main`.

Antes o al comienzo de esa rama, ejecutar `npm run build` sobre el `main` integrado y hacer una regresión corta de v0.2 para saldar la deuda de validación documentada.

## Dirección de diseño v0.3 — territorio industrial y logística

Objetivo general: hacer que **espacio, distancia y distribución de recursos importen**. El tablero debe dejar de ser cuatro nodos aislados y empezar a comportarse como un territorio industrial que obliga a decidir dónde extraer, almacenar y mover materiales.

La dirección está acordada como plan evolutivo, no como especificación cerrada. Cada subfase se discute y afina antes de implementar.

### Subfase 1 — Yacimientos multicelda

Primer paso propuesto y acordado para discusión:

- sustituir el modelo conceptual `un recurso = una casilla` por **yacimientos formados por varias celdas contiguas**;
- permitir **más de un yacimiento del mismo recurso** en el mapa;
- mantener reserva propia por celda;
- conservar la posibilidad de colocar un Extractor Mk.I sobre una celda válida del yacimiento;
- permitir que varios extractores trabajen distintas celdas del mismo yacimiento;
- mantener minería manual por celda;
- regeneración, resize de retícula y perfiles temporales deben conservar contratos coherentes.

Parámetros previstos para DEV desde el inicio:

- cantidad de yacimientos por recurso;
- tamaño mínimo y máximo del yacimiento en celdas;
- reserva base/media por celda;
- dispersión o irregularidad de la forma;
- distancia/radio de aparición respecto al centro;
- opción experimental futura de riqueza variable dentro del yacimiento (bordes pobres / centro rico), inicialmente como toggle DEV si se implementa.

La UI DEV debe permitir inspeccionar las celdas activas y sus reservas sin confundirlas con el inventario del jugador.

### Subfase 2 — Almacenamiento local

Después de estabilizar los yacimientos:

- introducir una `Tolva/Cajón Mk.I` 1×1;
- capacidad limitada y configurable;
- separar progresivamente producción automática del inventario global;
- permitir que una máquina entregue a almacenamiento local o, temporalmente, mantener salida global como modo de compatibilidad/DEV.

Parámetros previstos en DEV: capacidad, reglas de aceptación, costo, comportamiento de salida del extractor y cualquier radio de interacción que se adopte.

### Subfase 3 — Transporte físico básico

Primer candidato: **Carrito logístico Mk.I** o porteador mecánico.

Concepto inicial:

- origen y destino explícitos;
- capacidad limitada;
- velocidad por celdas;
- tiempo de carga/descarga;
- viaje visible entre nodos;
- la distancia afecta throughput real.

Parámetros previstos en DEV: capacidad, velocidad, tiempos de carga/descarga, costo y límites de rutas.

### Evolución posterior prevista

Sin compromiso de orden definitivo:

- transportadores mecánicos/cadenas para flujo continuo;
- ferrocarril o vagonetas para largas distancias;
- fundición y materiales procesados;
- edificios de distintos tamaños (`1×1`, `2×2`, `3×3`, etc.);
- terreno básico (suelo, roca, agua);
- vapor como primera red energética temática;
- posible separación futura entre potencia mecánica y electricidad.

### Principio logístico

La progresión deseada es aproximadamente:

`extracción → almacenamiento local → transporte → almacenamiento/consumo industrial → procesamiento`

El carbón debe evolucionar de combustible abstracto a recurso logístico real capaz de sostener extractores, hornos, calderas y futuras redes energéticas.

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

`TALLER DE CAMPO — Extractores Mk.I` vive dentro del área de juego y permanece separado del DEV Panel. Permite comprar extractores, ver disponibles e instalados, iniciar/cancelar colocación y consultar recurso, coordenadas y estado de cada máquina instalada.

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

## Decisiones activas

| ID | Decisión | Motivo |
|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D y expansión modular |
| `ADR-002` | Tres perfiles DEV en `localStorage`, original fuera de persistencia | Experimentación persistente sin convertir DEV en sistema de saves |
| `DEV-001` | Toda mecánica nueva expone parámetros relevantes en DEV desde su implementación | Tuning antes de fijar balance |
| `UI-002` | Sliders continuos; campos numéricos confirman al terminar | Fluidez y edición textual sin pérdida de foco |
| `MACHINE-001` | Extractor Mk.I 1×1 ligado a depósito | Legibilidad espacial |
| `FUEL-001` | Combustible expresado en recursos por carbón | Relación fácil de entender y tunear |
| `ECON-001` | Extractor cuesta 20 hierro + 10 cobre + 10 piedra | Fase manual breve antes de automatizar |
| `ECON-002` | Compra crea stock; colocación consume stock; retirada recupera máquina | Separar propiedad y ubicación física |
| `UI-003` | Panel jugador separado del DEV Panel | Gameplay real distinto de herramientas de tuning |
| `STATE-001` | Reset global evoluciona con todos los sistemas | Retorno reproducible al arranque canónico |
| `ROADMAP-003` | v0.3 prioriza yacimientos multicelda antes de logística física | La logística requiere primero un mundo donde espacio y distancia importen |

## Deuda de validación heredada de v0.2

- Ejecutar `npm run build` sobre el `main` integrado.
- Recorrer `BUG-LOCAL-001`: varias cifras, Enter/blur, negativos y máximo configurable.
- Guardar/cargar/sobrescribir los tres perfiles y verificar persistencia tras recarga.
- Probar compra con inventario insuficiente, exacto y excedente.
- Probar compra → stock → colocación → retirada → recolocación.
- Validar autoalimentación sobre carbón y consumo `1 carbón → 10 recursos`.
- Verificar panel de jugador en retículas 8×8, 30×30 y 60×60.

## Historial de hitos

### 2026-08-07 — Dirección v0.3 acordada

- Acordada evolución hacia yacimientos multicelda y múltiples yacimientos por recurso.
- Acordado que el primer paso de v0.3 será resolver el modelo espacial antes de almacenamiento o transporte.
- Registrada hoja de ruta: yacimientos → almacenamiento local → carrito logístico → sistemas posteriores.
- Reforzado `DEV-001`: toda mecánica y presentación nueva nace con controles DEV relevantes y contextuales.

### 2026-08-07 — Integración v0.2

- PR #2 `Implementa extractor de combustión Mk.I` fusionado a `main`.
- Merge: `5e13885a061a17e616f44496c72f1ce215700ba3`.
- La integración fue autorizada explícitamente aun con deuda de validación final.
- Rama activa volvió a `main`.

### 2026-08-07 — Edición numérica e inventario DEV

- Registrado `BUG-LOCAL-001`.
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
