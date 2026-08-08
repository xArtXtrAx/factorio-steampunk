# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Principio de desarrollo: control total desde DEV

Durante el desarrollo buscamos **control total y explícito sobre las mecánicas y la presentación** para evaluar parámetros junto con el propietario del proyecto antes de consolidarlos como balance definitivo.

Regla operativa:

- toda mecánica nueva debe exponer en el DEV Panel sus parámetros de balance relevantes;
- toda presentación/FX nueva debe exponer sus parámetros visuales relevantes en `Gráficos`;
- los estados de entidades nuevas deben poder inspeccionarse y, cuando sea razonable, manipularse desde DEV;
- los presets iniciales son hipótesis de diseño, no valores finales;
- los resets parciales/globales deben evolucionar junto con los nuevos sistemas;
- sólo se ocultan o fijan parámetros cuando exista una decisión explícita de diseño para hacerlo.

El DEV Panel es por tanto una herramienta de experimentación y diagnóstico, no la interfaz final del jugador.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `v0.2 — Extractor Mk.I + economía + perfiles de arranque DEV` |
| Rama estable | `main` |
| Rama activa | `agent/extractor-v0-2` |
| Último checkpoint verificable | `edición numérica libre del DEV Panel y límite configurable de inventario implementados sobre perfiles/economía` |
| Estado del build | `dependencias locales restauradas por el usuario; build del checkpoint actual pendiente de confirmación` |
| Estado de pruebas | `apariencia general del extractor validada positivamente; economía, perfiles e interacción numérica pendientes de recorrido completo` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar el checkout local de `agent/extractor-v0-2`, ejecutar `npm run build`, arrancar con `npm run dev` y validar primero `BUG-LOCAL-001`: escribir cifras de varias posiciones en `DEV > General > Inventario`, confirmar con Enter/blur, probar negativos y valores por encima del máximo, cambiar el límite máximo y verificar que se conserva en perfiles temporales y vuelve a `100000` con el perfil original. Después continuar con la validación de economía y perfiles ya pendiente.

### Criterio de la fase v0.2

- [x] Rama `agent/extractor-v0-2` creada desde `main`.
- [x] Extractor 1×1 ligado a un depósito.
- [x] Producción inicial de 1 recurso/s.
- [x] Eficiencia inicial de 10 recursos por carbón.
- [x] Buffer de carbón configurable, valor inicial 5.
- [x] Carga automática desde inventario configurable.
- [x] Autoalimentación sobre depósito de carbón configurable.
- [x] Silueta steampunk 1×1 sobre el recurso, engranaje animado y aro de combustible.
- [x] Apariencia general del extractor validada positivamente por el usuario.
- [x] Costo inicial: 20 hierro + 10 cobre + 10 piedra + 0 carbón.
- [x] Compra descuenta materiales y añade una máquina al stock.
- [x] Colocación consume una máquina del stock.
- [x] Retirada devuelve la máquina al stock, sin devolución de materiales.
- [x] Panel jugador dentro del área de juego con compra, disponibles, instalados y ubicaciones.
- [x] Costos y stock expuestos como interactuables en `DEV > Máquinas`.
- [x] `Gráficos > Extractores` mantiene tuning visual completo.
- [x] Reset global elimina máquinas/stock y devuelve parámetros al preset inicial.
- [x] Perfil original de arranque protegido mediante `DEFAULT_CONFIG` + `resetToDefaults()`.
- [x] Tres perfiles temporales persistentes y sobrescribibles desde `DEV > General`.
- [x] Snapshots incluyen configuración, inventario, retícula/depósitos, stock y máquinas.
- [x] Persistencia DEV encapsulada en `localStorage` y documentada en ADR-002.
- [x] Campos numéricos DEV permiten escribir cifras completas antes de aplicar el valor.
- [x] Inventario manual bloquea negativos y usa un máximo configurable desde DEV.
- [x] `inventoryEditMax` pertenece a `DEFAULT_CONFIG`; base original `100000`, rango DEV hasta `1000000`.
- [ ] Build local del checkpoint actual ejecutado y registrado.
- [ ] `BUG-LOCAL-001` validado manualmente.
- [ ] Validación manual del flujo compra → stock → colocación → retirada.
- [ ] Validación manual guardar → recargar → cargar → sobrescribir perfiles.
- [ ] Validación manual completa de combustible, autoalimentación y balance.

## Perfiles de arranque DEV

### Perfil original · bloqueado

- Es la base canónica establecida desde el inicio del proyecto.
- No es un snapshot editable ni se almacena en navegador.
- Siempre ejecuta `resetToDefaults()` y reconstruye `DEFAULT_CONFIG`, inventario cero, stock cero, sin máquinas y depósitos iniciales aleatorios según el contrato original.
- El botón global `RESTAURAR VALORES INICIALES` y `CARGAR PERFIL ORIGINAL` convergen al mismo contrato.
- Ningún perfil temporal puede sobrescribirlo.
- El límite original de edición manual de inventario es `100000`.

### Temporales 1–3

- Existen tres slots persistentes.
- Un slot vacío puede guardar el estado actual.
- Un slot guardado puede cargarse o sobrescribirse explícitamente; sobrescribir requiere confirmación.
- Persisten entre recargas del navegador mediante `localStorage`.
- Cada snapshot contiene `config`, inventario, depósitos con posiciones/cantidades, extractores instalados y `extractorStock`.
- `inventoryEditMax` se persiste automáticamente dentro de `config`.
- Al cargar se limpian minería activa, modo de colocación y último evento de extracción.
- La carga normaliza límites y referencias antes de aplicar el snapshot.
- Los perfiles son locales al navegador/origen; no son el futuro sistema de guardado del jugador.

Referencia arquitectónica: `docs/decisiones/ADR-002-perfiles-dev-localstorage.md`.

## Diseño funcional vigente del Extractor Mk.I

Preset inicial:

- producción: `1 recurso/s`;
- eficiencia: `10 recursos / carbón`;
- consumo equivalente: `0.10 carbón/s` a producción continua;
- buffer de combustible: `5 carbón`;
- costo de compra: `20 hierro + 10 cobre + 10 piedra`;
- carbón como costo de fabricación: `0`;
- tamaño: `1×1`;
- requiere depósito: sí;
- un depósito admite un extractor;
- auto-carga de carbón: desde inventario global hasta llenar el buffer;
- autoalimentación en carbón: si no hay combustible disponible, un extractor sobre carbón puede consumir directamente una unidad del propio depósito para iniciar un ciclo de combustible.

### Economía y ciclo de propiedad

- `buyExtractor()` valida el inventario, descuenta el costo configurado y suma `1` a `extractorStock`.
- Sólo puede activarse colocación cuando existe al menos un extractor disponible.
- Una colocación válida resta `1` de `extractorStock` y crea la máquina ligada al depósito.
- Retirar una máquina devuelve `1` al stock; no devuelve hierro/cobre/piedra.
- Regenerar depósitos desde DEV devuelve las máquinas instaladas al stock antes de reemplazar los depósitos.
- El reset global vuelve inventario, máquinas instaladas y stock a cero.

Los extractores tienen estado inspeccionable: activo/detenido, trabajando, sin combustible, autoalimentando o depósito agotado; además registran combustible, trabajo restante y producción acumulada.

## UI del jugador

`src/ui/playerPanel.js` vive dentro de `#game-shell`, separado del DEV Panel.

El panel `TALLER DE CAMPO — Extractores Mk.I` muestra:

- botón `COMPRAR EXTRACTOR` con costo actual;
- botón para colocar/cancelar colocación;
- cantidad de extractores disponibles en stock;
- cantidad de extractores instalados;
- lista de ubicaciones instaladas con recurso, coordenadas `[x,y]` y estado de la máquina.

El botón de compra se deshabilita cuando faltan materiales y el botón de colocación cuando no existen máquinas disponibles.

## Diseño visual vigente

- El recurso permanece visible debajo de la máquina.
- Cuerpo cuadrado oscuro con borde de latón, ocupando ~84% de la celda.
- Engranaje/rotor central gira sólo mientras la máquina trabaja.
- Glow cian durante funcionamiento.
- Aro exterior representa el trabajo restante del carbón actualmente encendido.
- Indicador ámbar cuando la máquina no está trabajando por combustible/estado; gris al agotarse el depósito.
- El pulso concéntrico existente converge también sobre extractores automáticos.
- El usuario validó positivamente la dirección minimalista y coherente con el lenguaje visual general.

## DEV Panel vigente

### General

- Perfil original bloqueado y tres perfiles temporales persistentes.
- Retícula y simulación manual.
- Inventario editable con campos numéricos de confirmación diferida: escribir libremente y aplicar al salir o pulsar Enter.
- Inventario manual con mínimo `0`, negativos bloqueados y máximo `inventoryEditMax` configurable entre `1` y `1000000`; valor base `100000`.
- Depósitos activos.

### Máquinas

- Producción del extractor.
- Recursos por carbón.
- Capacidad del buffer.
- Auto-carga desde inventario.
- Autoalimentación sobre carbón.
- Costos en hierro, cobre, piedra y carbón.
- Stock de extractores disponibles.
- Colocar/cancelar colocación.
- Retirar todos los extractores.
- Por extractor: estado, ubicación, producción acumulada, trabajo de combustible, activo/inactivo, carbón del buffer y retirada individual.

### Gráficos

- Entorno y efectos de extracción existentes.
- Subapartado `Extractores`: escala visual, velocidad de engranaje, intensidad de glow, grosor del aro de combustible y colores de cuerpo/latón/glow.

## Contratos de estado

- `DEFAULT_CONFIG` es la fuente de verdad del estado/configuración inicial global e incluye mecánica, costos del extractor e `inventoryEditMax`.
- `DEFAULT_GRAPHICS_CONFIG` contiene el preset visual del extractor.
- `resetToDefaults()` define el perfil original bloqueado y debe evolucionar con todos los sistemas futuros.
- `captureStartProfile()` serializa el estado estable requerido para un comienzo experimental.
- `restoreStartProfile()` valida/restaura snapshots y elimina estados transitorios.
- `resetGraphicsToDefaults()` sólo modifica parámetros visuales y preserva inventario, depósitos, extractores y stock.
- Regenerar depósitos invalida sus IDs; las máquinas instaladas se recuperan al stock antes de regenerar.
- Los sliders continúan aplicando valores mediante `input`; los campos numéricos de `numberControl()` aplican mediante `change`/Enter para no perder foco al teclear.

## Arquitectura vigente

- PixiJS 8.19.0 + Vite 8.1.5.
- `src/game/config.js`: recursos, balance, costos y presets gráficos.
- `src/game/state.js`: minería manual, retícula, compra, stock, extractores, combustible, snapshots y resets.
- `src/game/startProfiles.js`: persistencia local versionada de tres perfiles temporales DEV.
- `src/game/renderer.js`: retícula, depósitos, máquinas y FX.
- `src/ui/playerPanel.js`: interfaz de jugador para compra, stock, colocación y ubicaciones.
- `src/ui/devPanel.js`: tabs `General`, `Máquinas`, `Gráficos`, perfiles y controles vivos.
- `src/ui/devProfiles.css`: presentación de slots de perfiles DEV.
- `src/main.js`: composición, HUD y montaje de UI.

## Decisiones activas

| ID | Decisión | Motivo |
|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D y expansión modular |
| `ADR-002` | Tres perfiles DEV temporales en `localStorage`, original fuera de persistencia | Experimentación persistente sin convertir DEV en sistema de saves |
| `DEV-001` | Toda mecánica nueva expone parámetros relevantes en DEV | Permitir evaluación conjunta y tuning antes de fijar balance |
| `UI-002` | Sliders continuos; campos numéricos confirman al terminar | Mantener drag fluido y edición textual sin pérdida de foco |
| `MACHINE-001` | Extractor Mk.I 1×1 ligado a depósito | Mantener legibilidad espacial en la primera automatización |
| `FUEL-001` | Trabajo de combustible expresado en recursos por carbón | Relación fácil de entender y tunear (`1 → 10` inicial) |
| `ECON-001` | Extractor cuesta 20 hierro + 10 cobre + 10 piedra | Crear una fase manual breve antes de automatizar |
| `ECON-002` | Compra crea stock; colocación consume stock; retirada recupera máquina | Separar fabricación/propiedad de ubicación física |
| `UI-003` | Panel jugador de máquinas separado del DEV Panel | Mantener gameplay real distinto de herramientas de tuning |
| `STATE-001` | Reset global evoluciona con todos los sistemas | Garantizar retorno reproducible al estado inicial |

## Riesgos y validación pendiente

| Estado | Riesgo | Acción siguiente |
|---|---|---|
| Abierto | Checkpoint actual todavía no compilado localmente | ejecutar `npm run build` |
| Abierto | `BUG-LOCAL-001` no validado manualmente después de la corrección | probar escritura continua, Enter/blur, negativos y máximo |
| Abierto | Persistencia `localStorage` no recorrida manualmente | guardar los 3 slots, recargar y cargar |
| Abierto | Sobrescritura y aislamiento entre slots no validados | sobrescribir uno y verificar que los otros no cambian |
| Abierto | Compra y estados disabled no recorridos manualmente | probar inventario insuficiente/exacto/excedente |
| Abierto | Flujo de stock/retirada no recorrido manualmente | comprar, colocar, retirar y recolocar |
| Abierto | Panel jugador puede solaparse visualmente en configuraciones extremas | validar 8×8, 30×30 y 60×60 |
| Abierto | Balance 20/10/10 y 1 carbón → 10 recursos es provisional | experimentar desde DEV Panel/perfiles |

## Cómo ejecutar y verificar

```bash
npm install
npm run build
npm run dev
```

Validación manual sugerida:

1. En `General > Inventario`, escribir `250`, `12345` y otro valor de varias cifras sin perder foco entre dígitos.
2. Confirmar una cifra con Enter y otra haciendo click fuera del campo.
3. Intentar introducir `-1` y pegar un valor negativo: el recurso no debe quedar por debajo de `0`.
4. Fijar `Límite máximo editable` en `500`, introducir `800` en un recurso y comprobar que termina en `500`.
5. Guardar ese límite en `Temporal 1`, cambiarlo, cargar el perfil y confirmar restauración; cargar `Original · bloqueado` y confirmar `100000`.
6. Crear estados A/B/C distintos y guardar los tres temporales; recargar navegador y comprobar persistencia.
7. Sobrescribir sólo `Temporal 2`; verificar que 1 y 3 permanecen intactos.
8. Con inventario vacío, confirmar que `COMPRAR EXTRACTOR` está deshabilitado.
9. Reunir exactamente 20 hierro, 10 cobre y 10 piedra; comprar, colocar sobre carbón, validar autoalimentación y retirar/recolocar.
10. Usar reset gráfico y confirmar que no altera economía, perfiles guardados ni estado jugable.

## Historial cronológico

### 2026-08-07 — Edición libre y límite del inventario DEV

- Registrado `BUG-LOCAL-001`: los campos numéricos perdían foco al modificar estado con cada tecla.
- Separada la semántica de controles: sliders continúan en vivo; campos numéricos confirman al terminar (`change`/Enter).
- Añadido bloqueo de negativos para controles con mínimo no negativo.
- Añadido `inventoryEditMax` al preset canónico, valor base `100000` y máximo ajustable en DEV de `1000000`.
- Los campos manuales de recursos usan ese límite como máximo.
- El nuevo parámetro queda incluido automáticamente en perfiles temporales y reset original.
- Revisión estructural remota completada; build y validación manual pendientes.

### 2026-08-07 — Perfiles de arranque DEV

- Añadido perfil original bloqueado respaldado por `DEFAULT_CONFIG` + `resetToDefaults()`.
- Añadidos tres perfiles temporales persistentes y sobrescribibles.
- Los temporales capturan configuración, inventario, depósitos/posiciones, stock y máquinas.
- Persistencia implementada con `localStorage` versionado y aislada del futuro guardado del jugador.
- Registrado `ADR-002`.
- Build y validación manual del checkpoint pendientes.

### 2026-08-07 — Economía inicial y panel jugador de extractores

- Acordado costo base `20 hierro + 10 cobre + 10 piedra`.
- Añadida compra real con descuento de recursos y stock de máquinas.
- La colocación consume stock y la retirada recupera la máquina sin reembolso de materiales.
- Añadido panel `TALLER DE CAMPO` dentro del juego con compra, disponibles, instalados y ubicaciones.
- Añadidos costos y stock al DEV Panel para tuning completo.
- Apariencia minimalista del extractor validada positivamente por el usuario.

### 2026-08-07 — Inicio v0.2: Extractor de combustión Mk.I

- Definido el principio `DEV-001`: control total durante desarrollo.
- Añadida primera máquina automática alimentada por carbón.
- Añadidos colocación, combustible, producción, auto-carga y autoalimentación sobre carbón.
- Añadida pestaña `Máquinas` y controles gráficos del extractor.
- Añadida representación visual steampunk procedural sobre la celda del depósito.

### 2026-08-07 — Integración v0.1

- PR #1 fusionado en `main`, merge `fe55692aa95adea043c19d8f1f8b121003c5c1d9`.
- v0.1 estableció minería manual, DEV Panel, FX, resets y retícula dinámica.
