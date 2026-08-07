# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1 — navegación escalable del DEV Panel` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Último checkpoint verificable | `DEV Panel con pestañas General/Gráficos y subapartado Efectos de extracción publicado en rama activa` |
| Estado del build | `último build previo ejecutado localmente sin errores reportados; build posterior a pestañas/FX pendiente` |
| Estado de pruebas | `arranque base validado por usuario; FX y navegación por pestañas revisados estructuralmente y pendientes de build/validación visual` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar la rama local, ejecutar `npm run build`, abrir el prototipo y validar la navegación del DEV Panel: General debe conservar Simulación, Inventario y Depósitos; Gráficos debe contener Entorno gráfico y el subapartado Efectos de extracción.

### Criterio para considerar completado el próximo paso

- [x] Layout 2/3 juego y 1/3 DEV Panel implementado.
- [x] Retícula 30×30 con carbón, cobre, hierro y piedra cerca del centro implementada.
- [x] Minería manual por click izquierdo a 1 recurso/segundo por defecto implementada.
- [x] Contadores superiores y parámetros editables en DEV Panel implementados.
- [x] Pulso concéntrico sincronizado con la extracción implementado.
- [x] Cantidad de anillos configurable de 1 a 6 implementada.
- [x] Pestañas `General` y `Gráficos` implementadas.
- [x] `Gráficos` contiene `Entorno gráfico` y el subapartado `Efectos de extracción`.
- [x] La pestaña activa se conserva durante los rerenders del panel.
- [ ] Build local posterior a pestañas/FX ejecutado y registrado.
- [ ] Validación visual de navegación y FX completada y registrada.

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
- El último impacto visual del ciclo está asociado al evento real de extracción registrado por el estado.
- Halo neón construido con trazos superpuestos para evitar filtros costosos en esta fase.
- Navegación del DEV Panel mediante dos pestañas iniciales:
  - `General`: Simulación, Inventario y Depósitos activos, sin más niveles de anidación por ahora.
  - `Gráficos`: parámetros visuales separados de la simulación.
- Dentro de `Gráficos` existe `Entorno gráfico`, con brillo de retícula, y el subapartado `Efectos de extracción` con controles vivos para:
  - activar/desactivar;
  - cantidad y separación de anillos;
  - desfase de tamaño;
  - diámetro inicial/final;
  - opacidad inicial/de impacto;
  - grosor;
  - tamaño e intensidad de glow;
  - color del anillo y del glow;
  - curva de contracción;
  - flash y fade de impacto;
  - multiplicador temporal.
- La selección de pestaña se conserva cuando un cambio de estado obliga a volver a renderizar el DEV Panel.

### Preset gráfico inicial

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
- Separación al usar múltiples anillos: `0.18` del ciclo.

### Lo ya validado localmente

- Instalación/entorno suficientes para ejecutar el proyecto antes del nuevo FX.
- Build anterior sin errores reportados.
- Servidor de desarrollo y apertura de la aplicación en navegador.
- Apariencia general del prototipo inicial valorada positivamente por el usuario.

### Lo que todavía falta validar

- Build después de incorporar el pulso gráfico y la navegación por pestañas.
- Cambio entre `General` y `Gráficos` sin pérdida de controles ni estado.
- Persistencia de la pestaña activa durante cambios de valores.
- Contracción y sincronización visual a 1 recurso/s.
- Respuesta del pulso al cambiar `Extracción / s`.
- Comportamiento con 2–6 anillos y separaciones altas.
- Colores, opacidades, glow, easing, flash y fade modificados en vivo.
- Rendimiento visual con la configuración extrema permitida por el DEV Panel.

## Arquitectura vigente

- Plataforma: navegador web de escritorio.
- Lenguaje: JavaScript moderno con módulos ES.
- Renderer: PixiJS 8.19.0.
- Tooling: Vite 8.1.5.
- Persistencia: todavía no existe.
- Entrada inicial: mouse.
- Módulos principales:
  - `src/game/config.js`: configuración, recursos y preset de FX.
  - `src/game/state.js`: estado, simulación de minería y eventos de extracción.
  - `src/game/renderer.js`: retícula, recursos, interacción y capa gráfica de FX.
  - `src/ui/devPanel.js`: navegación por pestañas y controles de simulación/gráficos.
  - `src/main.js`: composición de aplicación y HUD.

## Decisiones activas

| ID | Decisión | Motivo | Referencia |
|---|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D, efectos y expansión modular | `docs/decisiones/ADR-001-arquitectura-web.md` |
| `FX-001` | Pulso como capa independiente y parametrizable | Permite tuning visual sin acoplar balance y renderer de recursos | esta bitácora |
| `UI-001` | Crecimiento del DEV Panel mediante pestañas | Evita una columna monolítica a medida que aumenten parámetros | esta bitácora |

## Riesgos, deuda y bloqueos

| Estado | Riesgo o bloqueo | Impacto | Acción siguiente |
|---|---|---|---|
| Abierto | Navegación por pestañas y nuevo FX no compilados todavía tras los últimos cambios | medio | ejecutar `npm run build` localmente |
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

Después validar manualmente: alternar General/Gráficos, cambiar parámetros de ambas vistas, confirmar que la pestaña activa no salta al actualizar el estado y probar el pulso con 1–3 anillos.

## Historial cronológico

### 2026-08-07 — Primera navegación por pestañas del DEV Panel

**Rama:** `agent/prototipo-v0-1`

**Objetivo**

- Preparar el DEV Panel para crecer sin convertirlo en una lista vertical monolítica.

**Cambios realizados**

- Añadidas pestañas `General` y `Gráficos`.
- Conservados Simulación, Inventario y Depósitos activos en `General`, sin anidarlos adicionalmente.
- Movido el entorno visual a `Gráficos`.
- Creado el subapartado `Efectos de extracción` dentro de `Gráficos`.
- Añadidos estilos steampunk/neón para tabs, estado activo y subapartados.
- Conservada la pestaña activa durante rerenders provocados por cambios de estado.

**Pruebas ejecutadas**

- Revisión estructural remota: realizada.
- Build posterior al cambio: pendiente.
- Validación manual de navegación: pendiente.

**Estado al cerrar**

- Navegación publicada en rama activa; no declarada validada hasta build y prueba local.

**Siguiente paso**

- Actualizar rama local, compilar y probar navegación junto con el FX de extracción.

### 2026-08-07 — Pulso gráfico de extracción parametrizable

**Rama:** `agent/prototipo-v0-1`

- Añadida capa FX independiente.
- Añadido pulso concéntrico que converge al recurso activo.
- Añadido evento de extracción en `GameState` para sincronizar el destello final con el incremento real de inventario.
- Añadido soporte para 1–6 anillos escalonados dentro de un mismo ciclo.
- Añadidos doble trazo de glow, colores configurables, easing y flash de impacto.
- Añadida sección gráfica completa al DEV Panel.
- Build posterior al cambio y validación manual del efecto: pendientes.

### 2026-08-07 — Validación local inicial por el usuario

**Rama:** `agent/prototipo-v0-1`

- Las comprobaciones de entorno se completaron correctamente.
- El build local previo no reportó errores según el usuario.
- El servidor de desarrollo arrancó y la ventana del juego se abrió correctamente en navegador.
- Arranque local validado manualmente; funciones individuales seguían pendientes de recorrido sistemático.

### 2026-08-07 — Prototipo web v0.1 implementado

**Rama:** `agent/prototipo-v0-1`

- Añadidos PixiJS 8.19.0 y Vite 8.1.5.
- Implementados estado, minería, renderer, HUD y DEV Panel modular.
- Añadida dirección visual steampunk/neón.

### 2026-08-07 — Inicialización del repositorio

**Rama:** `main`

- Se establecieron `CONTINUIDAD_GPT.md`, `AGENTS.md`, `BITÁCORA_GPT.md`, `BUGS.md`, ADR y template de PR conforme al repositorio de reglas.
