# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1 — resets global y gráfico del DEV Panel` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Último checkpoint verificable | `reset global y reset gráfico independientes publicados en rama activa` |
| Estado del build | `último build previo ejecutado localmente sin errores reportados; build posterior a tabs/FX/sliders/resets pendiente` |
| Estado de pruebas | `arranque base validado por usuario; cambios recientes revisados estructuralmente y pendientes de build/validación visual` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar la rama local, ejecutar `npm run build`, abrir el prototipo y validar ambos resets: el global debe devolver todo el juego a su estado inicial y el gráfico debe restaurar sólo los parámetros visuales sin alterar simulación, inventario ni depósitos.

### Criterio para considerar completado el próximo paso

- [x] Layout 2/3 juego y 1/3 DEV Panel implementado.
- [x] Retícula 30×30 con carbón, cobre, hierro y piedra cerca del centro implementada.
- [x] Minería manual por click izquierdo a 1 recurso/segundo por defecto implementada.
- [x] Contadores superiores y parámetros editables en DEV Panel implementados.
- [x] Pulso concéntrico sincronizado con la extracción implementado.
- [x] Cantidad de anillos configurable de 1 a 6 implementada.
- [x] Pestañas `General` y `Gráficos` implementadas.
- [x] `Gráficos` contiene `Entorno gráfico` y el subapartado `Efectos de extracción`.
- [x] La pestaña activa se conserva durante rerenders del panel.
- [x] Sliders continuos durante drag implementados.
- [x] Reset global del juego implementado mediante `DEFAULT_CONFIG`.
- [x] Reset gráfico independiente implementado mediante `DEFAULT_GRAPHICS_CONFIG`.
- [ ] Build local posterior a los últimos cambios ejecutado y registrado.
- [ ] Validación manual de ambos resets completada y registrada.

## Resumen funcional vigente

### Lo que ya está implementado

- Shell web con distribución 2/3 juego y 1/3 DEV Panel.
- Retícula 30×30 renderizada con PixiJS.
- Cuatro depósitos únicos generados aleatoriamente cerca del centro: carbón, cobre, hierro y piedra.
- Extracción continua manteniendo click izquierdo; velocidad configurable y valor inicial de 1 recurso/s.
- Inventario superior en vivo.
- Regeneración de depósitos desde DEV Panel.
- Estética steampunk con acentos neón.
- Pulso circular de extracción en una capa FX independiente del renderer de recursos.
- Un anillo por defecto; configurable entre 1 y 6 anillos escalonados dentro del mismo ciclo de extracción.
- Navegación del DEV Panel mediante pestañas `General` y `Gráficos`.
- Dentro de `Gráficos`: `Entorno gráfico` y subapartado `Efectos de extracción`.
- Sliders con actualización continua durante drag.
- Botón global `RESTAURAR VALORES INICIALES` disponible desde cualquier pestaña.
- Botón `RESTAURAR VALORES GRÁFICOS` dentro de `Gráficos`.

### Contrato de restauración

- `resetToDefaults()` es el reset maestro del juego. Debe evolucionar con el proyecto para devolver todos los sistemas jugables, configuraciones, inventarios, entidades y estados futuros a su valor inicial.
- `DEFAULT_CONFIG` es la fuente de verdad de la configuración inicial global.
- `resetGraphicsToDefaults()` restaura exclusivamente el aspecto visual y no modifica simulación, inventario ni depósitos.
- `DEFAULT_GRAPHICS_CONFIG` es la fuente de verdad del preset visual inicial y se integra dentro de `DEFAULT_CONFIG`, por lo que el reset global también incluye siempre el reset visual.

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
- Apariencia general del prototipo inicial valorada positivamente por el usuario.

### Lo que todavía falta validar

- Build después de incorporar FX, pestañas, sliders continuos y resets.
- Reset global tras modificar simulación, inventario y gráficos.
- Reset gráfico tras modificar valores visuales, verificando que el estado jugable permanezca intacto.
- Arrastre sostenido de sliders sin saltos.
- Comportamiento con 2–6 anillos y parámetros extremos.

## Arquitectura vigente

- Plataforma: navegador web de escritorio.
- Lenguaje: JavaScript moderno con módulos ES.
- Renderer: PixiJS 8.19.0.
- Tooling: Vite 8.1.5.
- Persistencia: todavía no existe.
- Entrada inicial: mouse.
- Módulos principales:
  - `src/game/config.js`: recursos, `DEFAULT_CONFIG` y `DEFAULT_GRAPHICS_CONFIG`.
  - `src/game/state.js`: estado, simulación, eventos de extracción y métodos de reset.
  - `src/game/renderer.js`: retícula, recursos, interacción y capa gráfica de FX.
  - `src/ui/devPanel.js`: tabs, controles, sliders continuos y acciones de restauración.
  - `src/main.js`: composición de aplicación y HUD.

## Decisiones activas

| ID | Decisión | Motivo | Referencia |
|---|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D, efectos y expansión modular | `docs/decisiones/ADR-001-arquitectura-web.md` |
| `FX-001` | Pulso como capa independiente y parametrizable | Permite tuning visual sin acoplar balance y renderer de recursos | esta bitácora |
| `UI-001` | Crecimiento del DEV Panel mediante pestañas | Evita una columna monolítica a medida que aumenten parámetros | esta bitácora |
| `UI-002` | Suspender rerender del panel durante drag de ranges | Evita reemplazar el elemento nativo mientras el usuario lo arrastra | esta bitácora |
| `STATE-001` | Reset global y presets parciales componibles | Permite restaurar todo el juego o sólo un dominio sin duplicar valores iniciales | esta bitácora |

## Riesgos, deuda y bloqueos

| Estado | Riesgo o bloqueo | Impacto | Acción siguiente |
|---|---|---|---|
| Abierto | Últimos cambios no compilados todavía tras FX/tabs/sliders/resets | medio | ejecutar `npm run build` localmente |
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

Después validar manualmente: modificar simulación, inventario y gráficos; usar el reset gráfico y confirmar que sólo cambia lo visual; luego usar el reset global y confirmar que todo vuelve al estado inicial.

## Historial cronológico

### 2026-08-07 — Resets global y gráfico independientes

**Rama:** `agent/prototipo-v0-1`

**Objetivo**

- Formalizar un reset maestro permanente para todo el juego y un reset visual independiente para experimentación gráfica.

**Cambios realizados**

- Creado `DEFAULT_GRAPHICS_CONFIG` como preset visual inicial.
- `DEFAULT_CONFIG` incorpora el preset gráfico para que el reset global siempre incluya los valores visuales.
- Añadido `resetGraphicsToDefaults()` sin alterar inventario, depósitos o simulación.
- Conservado `resetToDefaults()` como contrato de reset completo del juego.
- Añadido botón `RESTAURAR VALORES GRÁFICOS` dentro de la pestaña `Gráficos`.
- Actualizada la descripción del botón global para explicitar su alcance futuro.

**Pruebas ejecutadas**

- Revisión estructural remota: realizada.
- Build posterior al cambio: pendiente.
- Validación manual de resets: pendiente.

**Estado al cerrar**

- Implementación publicada en rama activa; pendiente de validación local.

### 2026-08-07 — Reset global del DEV Panel

**Rama:** `agent/prototipo-v0-1`

- Añadido botón global `RESTAURAR VALORES INICIALES`.
- El reset devuelve configuración a `DEFAULT_CONFIG`, inventario a cero y regenera depósitos con cantidades iniciales.

### 2026-08-07 — Arrastre continuo de sliders

**Rama:** `agent/prototipo-v0-1`

- Se mantiene el evento nativo `input` durante drag.
- Se suspende temporalmente el rerender completo del DEV Panel mientras se arrastra un range.

### 2026-08-07 — Primera navegación por pestañas del DEV Panel

**Rama:** `agent/prototipo-v0-1`

- Añadidas pestañas `General` y `Gráficos`.
- Conservados Simulación, Inventario y Depósitos activos en `General`.
- Creado `Entorno gráfico` y el subapartado `Efectos de extracción`.

### 2026-08-07 — Pulso gráfico de extracción parametrizable

**Rama:** `agent/prototipo-v0-1`

- Añadida capa FX independiente.
- Añadido pulso concéntrico sincronizado con cada unidad extraída.
- Añadido soporte para 1–6 anillos y parámetros gráficos vivos.

### 2026-08-07 — Validación local inicial por el usuario

**Rama:** `agent/prototipo-v0-1`

- Build local previo sin errores reportados.
- Servidor de desarrollo y aplicación abiertos correctamente en navegador.

### 2026-08-07 — Prototipo web v0.1 implementado

**Rama:** `agent/prototipo-v0-1`

- Implementados estado, minería, renderer, HUD y DEV Panel modular.
- Añadida dirección visual steampunk/neón.

### 2026-08-07 — Inicialización del repositorio

**Rama:** `main`

- Se establecieron `CONTINUIDAD_GPT.md`, `AGENTS.md`, `BITÁCORA_GPT.md`, `BUGS.md`, ADR y template de PR conforme al repositorio de reglas.
