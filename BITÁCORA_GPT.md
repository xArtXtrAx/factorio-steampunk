# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1 — retícula dinámica configurable` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Último checkpoint verificable | `retícula cuadrada 8×8–60×60 configurable en vivo desde DEV Panel` |
| Estado del build | `último build previo ejecutado localmente sin errores reportados; build posterior a últimos cambios pendiente` |
| Estado de pruebas | `arranque base validado por usuario; retícula dinámica revisada estructuralmente y pendiente de build/validación manual` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar la rama local, ejecutar `npm run build`, abrir el prototipo y validar el slider de tamaño de retícula: debe cambiar dinámicamente entre 8×8 y 60×60, mostrar dimensiones y total de cuadros, conservar las cantidades de los depósitos y mantener todos los recursos dentro de la nueva retícula.

### Criterio para considerar completado el próximo paso

- [x] Layout 2/3 juego y 1/3 DEV Panel implementado.
- [x] Retícula 30×30 inicial implementada.
- [x] Tamaño de retícula configurable dinámicamente entre 8×8 y 60×60.
- [x] DEV Panel muestra dimensiones actuales y total de cuadros.
- [x] Recursos se recolocan proporcionalmente al redimensionar y conservan sus cantidades.
- [x] Minería manual por click izquierdo a 1 recurso/segundo por defecto implementada.
- [x] Pulso concéntrico y controles gráficos implementados.
- [x] Pestañas `General` y `Gráficos`, sliders continuos y resets global/gráfico implementados.
- [ ] Build local posterior a los últimos cambios ejecutado y registrado.
- [ ] Validación manual de retícula dinámica completada y registrada.

## Resumen funcional vigente

### Lo que ya está implementado

- Shell web con distribución 2/3 juego y 1/3 DEV Panel.
- Retícula cuadrada con valor inicial 30×30, configurable desde `General > Retícula` entre 8×8 y 60×60.
- El panel muestra `N × N` y el total de cuadros actuales.
- PixiJS recalcula automáticamente el tamaño de celda para hacer caber la retícula disponible.
- Al cambiar N, los depósitos existentes conservan tipo, ID y cantidad y se recolocan proporcionalmente dentro de la nueva cuadrícula; se resuelven colisiones de casilla buscando posiciones cercanas libres.
- El cambio de retícula detiene una extracción activa para evitar referencias de interacción inconsistentes durante el relayout.
- Cuatro depósitos: carbón, cobre, hierro y piedra.
- Extracción continua manteniendo click izquierdo; velocidad configurable y valor inicial de 1 recurso/s.
- Inventario superior en vivo y regeneración de depósitos desde DEV Panel.
- Estética steampunk con acentos neón.
- Pulso circular de extracción parametrizable, con 1–6 anillos y feedback de impacto.
- Navegación del DEV Panel mediante pestañas `General` y `Gráficos`.
- Sliders con actualización continua durante drag.
- Botón global `RESTAURAR VALORES INICIALES` y reset visual independiente.

### Contrato de restauración

- `resetToDefaults()` es el reset maestro del juego y debe evolucionar con el proyecto para devolver todos los sistemas futuros a su estado inicial.
- `DEFAULT_CONFIG` mantiene como valor inicial `gridColumns: 30` y `gridRows: 30`, por lo que el reset global devuelve también la retícula a 30×30.
- `resetGraphicsToDefaults()` restaura exclusivamente el aspecto visual y no modifica tamaño de retícula, simulación, inventario ni depósitos.
- `DEFAULT_GRAPHICS_CONFIG` es la fuente de verdad del preset visual inicial y forma parte de `DEFAULT_CONFIG`.

### Preset gráfico inicial

- Brillo retícula: `0.55`.
- Anillos: `1`.
- Diámetro inicial: `1.20×` celda.
- Diámetro final: `0.08×` celda.
- Opacidad inicial: `0.10`.
- Opacidad de impacto: `0.80`.
- Grosor: `2 px`.
- Glow: `8 px`.
- Intensidad glow: `0.65`.
- Color anillo: `#58FFE3`.
- Color glow: `#00FFD5`.
- Curva: `Ease In`.
- Flash: `0.35`.
- Fade: `120 ms`.
- Multiplicador temporal: `1.00×`.
- Separación con múltiples anillos: `0.18` del ciclo.

### Lo ya validado localmente

- Instalación/entorno suficientes para ejecutar el proyecto antes de los últimos cambios.
- Build anterior sin errores reportados.
- Servidor de desarrollo y apertura de la aplicación en navegador.
- Apariencia general del prototipo valorada positivamente por el usuario.

### Lo que todavía falta validar

- Build después de los cambios recientes.
- Redimensionado sostenido 8×8 → 60×60 → 30×30 sin recursos fuera de rango.
- Legibilidad y rendimiento visual en extremos de tamaño de retícula.
- Interacción de minería después de cada relayout.
- Resets global/gráfico y sliders continuos tras integrar la retícula dinámica.

## Arquitectura vigente

- Plataforma: navegador web de escritorio.
- Lenguaje: JavaScript moderno con módulos ES.
- Renderer: PixiJS 8.19.0.
- Tooling: Vite 8.1.5.
- Persistencia: todavía no existe.
- Entrada inicial: mouse.
- Módulos principales:
  - `src/game/config.js`: recursos, `DEFAULT_CONFIG` y `DEFAULT_GRAPHICS_CONFIG`.
  - `src/game/state.js`: estado, simulación, redimensionado de retícula, eventos de extracción y resets.
  - `src/game/renderer.js`: layout dinámico, retícula, recursos, interacción y capa FX.
  - `src/ui/devPanel.js`: tabs, controles, slider de retícula, sliders continuos y acciones de restauración.
  - `src/main.js`: composición de aplicación y HUD.

## Decisiones activas

| ID | Decisión | Motivo | Referencia |
|---|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D, efectos y expansión modular | `docs/decisiones/ADR-001-arquitectura-web.md` |
| `FX-001` | Pulso como capa independiente y parametrizable | Permite tuning visual sin acoplar balance y renderer de recursos | esta bitácora |
| `UI-001` | Crecimiento del DEV Panel mediante pestañas | Evita una columna monolítica a medida que aumenten parámetros | esta bitácora |
| `UI-002` | Suspender rerender del panel durante drag de ranges | Evita reemplazar el elemento nativo mientras el usuario lo arrastra | esta bitácora |
| `STATE-001` | Reset global y presets parciales componibles | Permite restaurar todo el juego o sólo un dominio sin duplicar valores iniciales | esta bitácora |
| `GRID-001` | Retícula cuadrada variable con adaptación proporcional de depósitos | Permite experimentar con escala de mapa sin destruir el estado de recursos | esta bitácora |

## Riesgos, deuda y bloqueos

| Estado | Riesgo o bloqueo | Impacto | Acción siguiente |
|---|---|---|---|
| Abierto | Últimos cambios no compilados todavía | medio | ejecutar `npm run build` localmente |
| Abierto | Retícula 60×60 no validada visualmente en resolución objetivo | bajo | probar extremo máximo en navegador |
| Abierto | Parámetros extremos de 6 anillos no validados en rendimiento | bajo | probar presets extremos en navegador |

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

## Cómo verificarlo

```bash
npm run build
```

Después validar manualmente: mover `Tamaño de retícula (N × N)` entre 8 y 60, confirmar el contador de cuadros, revisar que todos los depósitos permanezcan visibles y después restaurar valores iniciales para confirmar retorno a 30×30.

## Historial cronológico

### 2026-08-07 — Retícula dinámica configurable

**Rama:** `agent/prototipo-v0-1`

- Añadido bloque `Retícula` en la pestaña `General`.
- Añadido slider/entrada numérica `Tamaño de retícula (N × N)` de 8 a 60.
- Añadido indicador de dimensiones actuales y número total de cuadros.
- Añadido `setGridSize()` en `GameState` para modificar filas y columnas conjuntamente.
- Los depósitos conservan cantidades y se recolocan proporcionalmente; las colisiones se resuelven buscando una casilla libre cercana.
- El renderer existente ya calcula el layout desde `gridColumns/gridRows`, por lo que celdas, recursos y FX se adaptan sin una ruta de render separada.
- Revisión estructural remota realizada; build y validación manual pendientes.

### 2026-08-07 — Resets global y gráfico independientes

- Creado `DEFAULT_GRAPHICS_CONFIG`.
- Añadido `resetGraphicsToDefaults()` y botón gráfico independiente.
- Conservado `resetToDefaults()` como contrato de reset completo del juego.

### 2026-08-07 — Reset global del DEV Panel

- Añadido botón global `RESTAURAR VALORES INICIALES`.

### 2026-08-07 — Arrastre continuo de sliders

- Se mantiene el evento nativo `input` durante drag y se suspende temporalmente el rerender del panel.

### 2026-08-07 — Primera navegación por pestañas del DEV Panel

- Añadidas pestañas `General` y `Gráficos` y subapartado `Efectos de extracción`.

### 2026-08-07 — Pulso gráfico de extracción parametrizable

- Añadido pulso concéntrico sincronizado con cada unidad extraída y soporte para 1–6 anillos.

### 2026-08-07 — Validación local inicial por el usuario

- Build local previo sin errores reportados.
- Servidor de desarrollo y aplicación abiertos correctamente en navegador.

### 2026-08-07 — Prototipo web v0.1 implementado

- Implementados estado, minería, renderer, HUD y DEV Panel modular.
- Añadida dirección visual steampunk/neón.

### 2026-08-07 — Inicialización del repositorio

- Se establecieron `CONTINUIDAD_GPT.md`, `AGENTS.md`, `BITÁCORA_GPT.md`, `BUGS.md`, ADR y template de PR conforme al repositorio de reglas.
