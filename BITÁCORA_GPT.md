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
| Objetivo actual | `v0.2 — Extractor de combustión Mk.I` |
| Rama estable | `main` |
| Rama activa | `agent/extractor-v0-2` |
| Último checkpoint verificable | `simulación, colocación, render y controles DEV del extractor publicados en rama activa` |
| Estado del build | `build de esta rama pendiente` |
| Estado de pruebas | `revisión estructural remota en curso; validación local/manual pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar el checkout local a `agent/extractor-v0-2`, ejecutar `npm run build` y validar en navegador el loop completo: colocar extractor sobre cada recurso, alimentar carbón, comprobar producción automática, autoalimentación en carbón, estados sin combustible/agotado y controles de las pestañas `Máquinas` y `Gráficos`.

### Criterio de la fase v0.2

- [x] Rama `agent/extractor-v0-2` creada desde `main`.
- [x] Extractor 1×1 ligado a un depósito.
- [x] Producción inicial de 1 recurso/s.
- [x] Eficiencia inicial de 10 recursos por carbón.
- [x] Buffer de carbón configurable, valor inicial 5.
- [x] Carga automática desde inventario configurable.
- [x] Autoalimentación sobre depósito de carbón configurable.
- [x] Modo de colocación desde DEV Panel.
- [x] Pestaña `Máquinas` con parámetros de balance y estados por extractor.
- [x] `Gráficos > Extractores` con escala, engranaje, glow, aro y colores.
- [x] Silueta steampunk 1×1 sobre el recurso, engranaje animado y aro de combustible.
- [x] Pulso de extracción reutilizado para extracción automática.
- [x] Reset global elimina máquinas y devuelve parámetros al preset inicial.
- [ ] Build local de v0.2 ejecutado y registrado.
- [ ] Validación manual del balance/UX visual completada.

## Diseño funcional vigente del Extractor Mk.I

Preset inicial:

- producción: `1 recurso/s`;
- eficiencia: `10 recursos / carbón`;
- consumo equivalente: `0.10 carbón/s` a producción continua;
- buffer de combustible: `5 carbón`;
- tamaño: `1×1`;
- requiere depósito: sí;
- un depósito admite un extractor;
- auto-carga de carbón: desde inventario global hasta llenar el buffer;
- autoalimentación en carbón: si no hay combustible disponible, un extractor sobre carbón puede consumir directamente una unidad del propio depósito para iniciar un ciclo de combustible.

Los extractores tienen estado inspeccionable: activo/detenido, trabajando, sin combustible, autoalimentando o depósito agotado; además registran combustible, trabajo restante y producción acumulada.

## Diseño visual vigente

- El recurso permanece visible debajo de la máquina.
- Cuerpo cuadrado oscuro con borde de latón, ocupando ~84% de la celda.
- Engranaje/rotor central gira sólo mientras la máquina trabaja.
- Glow cian durante funcionamiento.
- Aro exterior representa el trabajo restante del carbón actualmente encendido.
- Indicador ámbar cuando la máquina no está trabajando por combustible/estado; gris al agotarse el depósito.
- El pulso concéntrico existente converge también sobre extractores automáticos para conservar el lenguaje visual de extracción.

## DEV Panel vigente

### General

- Retícula, simulación manual, inventario y depósitos.

### Máquinas

- Producción del extractor.
- Recursos por carbón.
- Capacidad del buffer.
- Auto-carga desde inventario.
- Autoalimentación sobre carbón.
- Colocar/cancelar colocación.
- Retirar todos los extractores.
- Por extractor: estado, producción acumulada, trabajo de combustible, activo/inactivo, carbón del buffer y retirada individual.

### Gráficos

- Entorno y efectos de extracción existentes.
- Subapartado `Extractores`: escala visual, velocidad de engranaje, intensidad de glow, grosor del aro de combustible y colores de cuerpo/latón/glow.

## Contratos de estado

- `DEFAULT_CONFIG` sigue siendo la fuente de verdad del estado/configuración inicial global e incluye ahora los parámetros mecánicos del extractor.
- `DEFAULT_GRAPHICS_CONFIG` incluye también el preset visual del extractor.
- `resetToDefaults()` debe devolver todos los sistemas, incluidos extractores, al estado inicial.
- `resetGraphicsToDefaults()` sólo modifica parámetros visuales y preserva inventario, depósitos, extractores y simulación.
- Regenerar depósitos elimina extractores porque los IDs de depósito se reemplazan.

## Arquitectura vigente

- PixiJS 8.19.0 + Vite 8.1.5.
- `src/game/config.js`: recursos, balance y presets gráficos.
- `src/game/state.js`: minería manual, retícula, extractores, combustible y resets.
- `src/game/renderer.js`: retícula, depósitos, máquinas y FX.
- `src/ui/devPanel.js`: tabs `General`, `Máquinas`, `Gráficos` y controles vivos.
- `src/main.js`: composición y HUD.

## Decisiones activas

| ID | Decisión | Motivo |
|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D y expansión modular |
| `DEV-001` | Toda mecánica nueva expone parámetros relevantes en DEV | Permitir evaluación conjunta y tuning antes de fijar balance |
| `MACHINE-001` | Extractor Mk.I 1×1 ligado a depósito | Mantener legibilidad espacial en la primera automatización |
| `FUEL-001` | Trabajo de combustible expresado en recursos por carbón | Relación fácil de entender y tunear (`1 → 10` inicial) |
| `STATE-001` | Reset global evoluciona con todos los sistemas | Garantizar retorno reproducible al estado inicial |

## Riesgos y validación pendiente

| Estado | Riesgo | Acción siguiente |
|---|---|---|
| Abierto | Código de extractor aún no compilado en entorno local | ejecutar `npm run build` |
| Abierto | Flujo de auto-carga/autoalimentación no recorrido manualmente | probar carbón y recursos no combustibles |
| Abierto | Representación del extractor no validada en retículas extremas | probar 8×8, 30×30 y 60×60 |
| Abierto | Balance 1 carbón → 10 recursos es provisional | experimentar desde DEV Panel |

## Cómo ejecutar y verificar

```bash
npm install
npm run build
npm run dev
```

Validación manual sugerida:

1. En `Máquinas`, activar `COLOCAR EXTRACTOR Mk.I` y seleccionar hierro sin carbón en inventario: debe quedar `sin combustible`.
2. Añadir carbón desde `General > Inventario`: el extractor debe cargar su buffer y empezar a producir.
3. Colocar un extractor sobre carbón con inventario vacío: debe poder autoalimentarse desde su propio depósito si la opción está activa.
4. Cambiar `Producción / s`, `Recursos por carbón` y buffer y observar el efecto.
5. Ajustar `Gráficos > Extractores` y comprobar cambios en vivo.
6. Usar reset gráfico y comprobar que no cambia el estado jugable.
7. Usar reset global y confirmar que se eliminan extractores y vuelve todo al preset inicial.

## Historial cronológico

### 2026-08-07 — Inicio v0.2: Extractor de combustión Mk.I

- Definido el principio `DEV-001`: control total durante desarrollo.
- Añadida primera máquina automática alimentada por carbón.
- Añadidos colocación, combustible, producción, auto-carga y autoalimentación sobre carbón.
- Añadida pestaña `Máquinas` y controles gráficos del extractor.
- Añadida representación visual steampunk procedural sobre la celda del depósito.
- Revisión estructural remota realizada; build y validación manual pendientes.

### 2026-08-07 — Integración v0.1

- PR #1 fusionado en `main`, merge `fe55692aa95adea043c19d8f1f8b121003c5c1d9`.
- v0.1 estableció minería manual, DEV Panel, FX, resets y retícula dinámica.
