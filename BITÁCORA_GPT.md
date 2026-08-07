# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1 integrado en main` |
| Rama estable | `main` |
| Rama activa | `main` |
| Último checkpoint verificable | `PR #1 fusionado en main; merge fe55692aa95adea043c19d8f1f8b121003c5c1d9` |
| Estado del build | `build local previo ejecutado sin errores reportados; build posterior a los últimos cambios todavía pendiente` |
| Estado de pruebas | `arranque base y apariencia general validados por el usuario; FX, sliders continuos, resets y retícula dinámica pendientes de recorrido final sistemático` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar el checkout local a `main`, ejecutar `npm run build` y realizar una pasada de validación manual de la v0.1 integrada: minería, pulso FX, pestañas del DEV Panel, sliders continuos, reset global, reset gráfico y retícula 8×8–60×60.

### Criterio de validación pendiente

- [x] Prototipo v0.1 implementado.
- [x] PR #1 fusionado a `main`.
- [x] Layout 2/3 juego y 1/3 DEV Panel.
- [x] Retícula inicial 30×30 y tamaño dinámico 8×8–60×60.
- [x] Recursos se adaptan al relayout y conservan cantidades.
- [x] Minería manual configurable.
- [x] Pulso concéntrico parametrizable con 1–6 anillos.
- [x] DEV Panel con pestañas `General` y `Gráficos`.
- [x] Sliders con actualización continua durante drag.
- [x] Reset global y reset gráfico independiente.
- [ ] `npm run build` ejecutado sobre `main` después de la integración.
- [ ] Validación manual final de todos los controles y extremos completada.

## Resumen funcional vigente

- PixiJS 8.19.0 + Vite 8.1.5.
- Retícula cuadrada inicial 30×30, configurable entre 8×8 y 60×60 desde `General > Retícula`.
- El DEV Panel muestra dimensiones actuales y total de cuadros.
- Los depósitos de carbón, cobre, hierro y piedra se recolocan proporcionalmente al cambiar el tamaño y permanecen dentro del mapa.
- Minería continua manteniendo click izquierdo, con velocidad configurable.
- HUD de inventario en vivo.
- Pulso circular de extracción con glow neón y parámetros configurables en `Gráficos > Efectos de extracción`.
- Pestañas `General` y `Gráficos`; la pestaña activa se conserva durante actualizaciones.
- Sliders actualizan el juego continuamente mientras se arrastran.
- `RESTAURAR VALORES INICIALES` es el reset maestro permanente del juego y debe evolucionar con todos los sistemas futuros.
- `RESTAURAR VALORES GRÁFICOS` restaura sólo presentación/FX y preserva el estado jugable.

## Contratos de estado

- `DEFAULT_CONFIG` es la fuente de verdad del estado/configuración inicial global.
- `DEFAULT_GRAPHICS_CONFIG` contiene el preset visual inicial y forma parte de `DEFAULT_CONFIG`.
- `resetToDefaults()` debe devolver siempre todos los sistemas del juego a su estado inicial.
- `resetGraphicsToDefaults()` sólo debe modificar parámetros visuales.

## Arquitectura vigente

- Plataforma: navegador web de escritorio.
- Lenguaje: JavaScript moderno con módulos ES.
- Renderer: PixiJS 8.19.0.
- Tooling: Vite 8.1.5.
- Persistencia: todavía no existe.
- Módulos principales:
  - `src/game/config.js`: recursos y presets de configuración.
  - `src/game/state.js`: simulación, minería, retícula dinámica y resets.
  - `src/game/renderer.js`: retícula, recursos, interacción y FX.
  - `src/ui/devPanel.js`: pestañas y controles vivos.
  - `src/main.js`: composición de aplicación y HUD.

## Decisiones activas

| ID | Decisión | Motivo | Referencia |
|---|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D y expansión modular | `docs/decisiones/ADR-001-arquitectura-web.md` |
| `FX-001` | Pulso como capa independiente y parametrizable | Tuning visual desacoplado del balance | esta bitácora |
| `UI-001` | DEV Panel escalable mediante pestañas | Evitar una columna monolítica | esta bitácora |
| `UI-002` | Suspender rerender del panel durante drag | Mantener captura continua del slider | esta bitácora |
| `STATE-001` | Reset global y presets parciales componibles | Restauración coherente conforme crezca el juego | esta bitácora |
| `GRID-001` | Retícula cuadrada variable con adaptación de depósitos | Experimentar con escala sin perder estado | esta bitácora |

## Riesgos y validación pendiente

| Estado | Riesgo | Acción siguiente |
|---|---|---|
| Abierto | Últimos cambios no compilados todavía sobre `main` | ejecutar `npm run build` |
| Abierto | Retícula 60×60 no recorrida sistemáticamente en resolución objetivo | validar extremos 8×8 y 60×60 |
| Abierto | 6 anillos y parámetros FX extremos no validados en rendimiento | probar configuración máxima |

## Cómo ejecutar y verificar

```bash
npm install
npm run build
npm run dev
```

Después validar en navegador el flujo completo de la v0.1.

## Historial cronológico

### 2026-08-07 — Integración de prototipo v0.1 en main

- PR #1 `Implementa prototipo jugable v0.1` marcado listo y fusionado correctamente.
- Merge commit: `fe55692aa95adea043c19d8f1f8b121003c5c1d9`.
- No había bugs registrados al integrar.
- La rama y `main` habían divergido por actualizaciones documentales; GitHub resolvió la fusión correctamente sin reescritura destructiva.
- Se mantiene explícitamente pendiente el build y la validación manual final de los cambios más recientes.

### 2026-08-07 — Retícula dinámica configurable

- Añadido control 8×8–60×60, indicador de tamaño y total de cuadros.
- Los recursos conservan cantidades y se recolocan dentro de la nueva retícula.

### 2026-08-07 — Resets global y gráfico independientes

- Formalizados `DEFAULT_CONFIG`, `DEFAULT_GRAPHICS_CONFIG`, reset maestro y reset visual.

### 2026-08-07 — Arrastre continuo y navegación del DEV Panel

- Añadidas pestañas `General`/`Gráficos` y sliders continuos durante drag.

### 2026-08-07 — Pulso gráfico de extracción

- Añadido pulso concéntrico sincronizado con extracción y soporte para 1–6 anillos.

### 2026-08-07 — Validación local inicial

- Build inicial sin errores reportados por el usuario y aplicación abierta correctamente en navegador.

### 2026-08-07 — Inicialización del repositorio

- Establecidos continuidad, reglas, registro de bugs, ADR y flujo de PR.
