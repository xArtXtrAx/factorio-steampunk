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

El DEV Panel es una herramienta de experimentación y diagnóstico, no la interfaz final del jugador.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `v0.2 — Extractor de combustión Mk.I + economía inicial` |
| Rama estable | `main` |
| Rama activa | `agent/extractor-v0-2` |
| Último checkpoint verificable | `compra, stock, colocación y panel jugador de extractores publicados en rama activa` |
| Estado del build | `dependencias locales restauradas por el usuario; build de este checkpoint concreto pendiente de confirmación` |
| Estado de pruebas | `apariencia general del extractor validada positivamente por el usuario; economía/panel jugador y loop completo pendientes` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar el checkout local de `agent/extractor-v0-2`, ejecutar `npm run build`, arrancar con `npm run dev` y validar el nuevo loop económico: reunir materiales, comprar un extractor desde el panel del juego, comprobar stock disponible, colocarlo sobre un depósito, verificar ubicación/estado en el panel y confirmar que retirar la máquina la devuelve al stock sin reembolsar materiales.

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
- [ ] Build local del checkpoint de economía/panel ejecutado y registrado.
- [ ] Validación manual del flujo compra → stock → colocación → retirada.
- [ ] Validación manual completa de combustible, autoalimentación y balance.

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

Se añadió `src/ui/playerPanel.js`, montado dentro de `#game-shell`, separado del DEV Panel.

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

- Retícula, simulación manual, inventario y depósitos.

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

- `DEFAULT_CONFIG` es la fuente de verdad del estado/configuración inicial global e incluye mecánica y costos del extractor.
- `DEFAULT_GRAPHICS_CONFIG` contiene el preset visual del extractor.
- `resetToDefaults()` debe devolver todos los sistemas, incluidos extractores y stock, al estado inicial.
- `resetGraphicsToDefaults()` sólo modifica parámetros visuales y preserva inventario, depósitos, extractores y stock.
- Regenerar depósitos invalida sus IDs; las máquinas instaladas se recuperan al stock antes de regenerar.

## Arquitectura vigente

- PixiJS 8.19.0 + Vite 8.1.5.
- `src/game/config.js`: recursos, balance, costos y presets gráficos.
- `src/game/state.js`: minería manual, retícula, compra, stock, extractores, combustible y resets.
- `src/game/renderer.js`: retícula, depósitos, máquinas y FX.
- `src/ui/playerPanel.js`: interfaz de jugador para compra, stock, colocación y ubicaciones.
- `src/ui/devPanel.js`: tabs `General`, `Máquinas`, `Gráficos` y controles vivos.
- `src/main.js`: composición, HUD y montaje de UI.

## Decisiones activas

| ID | Decisión | Motivo |
|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D y expansión modular |
| `DEV-001` | Toda mecánica nueva expone parámetros relevantes en DEV | Permitir evaluación conjunta y tuning antes de fijar balance |
| `MACHINE-001` | Extractor Mk.I 1×1 ligado a depósito | Mantener legibilidad espacial en la primera automatización |
| `FUEL-001` | Trabajo de combustible expresado en recursos por carbón | Relación fácil de entender y tunear (`1 → 10` inicial) |
| `ECON-001` | Extractor cuesta 20 hierro + 10 cobre + 10 piedra | Crear una fase manual breve antes de automatizar |
| `ECON-002` | Compra crea stock; colocación consume stock; retirada recupera máquina | Separar fabricación/propiedad de ubicación física |
| `UI-003` | Panel jugador de máquinas separado del DEV Panel | Mantener gameplay real distinto de herramientas de tuning |
| `STATE-001` | Reset global evoluciona con todos los sistemas | Garantizar retorno reproducible al estado inicial |

## Riesgos y validación pendiente

| Estado | Riesgo | Acción siguiente |
|---|---|---|
| Abierto | Checkpoint de economía/UI todavía no compilado localmente | ejecutar `npm run build` |
| Abierto | Compra y estados disabled no recorridos manualmente | probar inventario insuficiente/exacto/excedente |
| Abierto | Flujo de stock/retirada no recorrido manualmente | comprar, colocar, retirar y recolocar |
| Abierto | Panel jugador puede solaparse visualmente en configuraciones extremas | validar 8×8, 30×30 y 60×60 |
| Abierto | Balance 20/10/10 y 1 carbón → 10 recursos es provisional | experimentar desde DEV Panel |

## Cómo ejecutar y verificar

```bash
npm install
npm run build
npm run dev
```

Validación manual sugerida:

1. Con inventario vacío, confirmar que `COMPRAR EXTRACTOR` está deshabilitado.
2. Reunir exactamente 20 hierro, 10 cobre y 10 piedra; comprar y verificar descuento a cero y stock `1`.
3. Pulsar colocar y seleccionar carbón: stock debe bajar a `0`, instalados subir a `1` y aparecer la coordenada correcta.
4. Confirmar autoalimentación del extractor de carbón con inventario de carbón vacío.
5. Comprar otro extractor y colocarlo sobre hierro; comprobar alimentación desde carbón del inventario.
6. Retirar una máquina desde DEV: debe volver al stock sin devolver materiales.
7. Modificar costos/stock desde DEV y verificar actualización inmediata del panel jugador.
8. Usar reset gráfico y confirmar que no cambia economía/estado.
9. Usar reset global y confirmar stock `0`, extractores `0`, inventario `0` y costos base restaurados.

## Historial cronológico

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
