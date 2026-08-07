# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Último checkpoint verificable | `prototipo v0.1 ejecutado localmente en navegador por el usuario` |
| Estado del build | `ejecutado localmente sin errores reportados por el usuario` |
| Estado de pruebas | `build local superado y aplicación abierta en navegador; validación funcional detallada aún pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Validar manualmente el flujo funcional del prototipo: proporción 2/3–1/3, retícula 30×30, cuatro depósitos, minería mantenida, contadores y respuesta de todos los controles del DEV Panel. Registrar cualquier incidencia antes de integrar.

### Criterio para considerar completado el próximo paso

- [x] Layout 2/3 juego y 1/3 DEV Panel implementado.
- [x] Retícula 30×30 con carbón, cobre, hierro y piedra cerca del centro implementada.
- [x] Minería manual por click izquierdo a 1 recurso/segundo por defecto implementada.
- [x] Contadores superiores y parámetros editables en DEV Panel implementados.
- [x] Build local ejecutado sin errores reportados por el usuario.
- [x] Aplicación abierta correctamente en navegador.
- [ ] Validación funcional detallada del loop y DEV Panel completada y registrada.

## Resumen funcional vigente

### Lo que ya está implementado

- Shell web con distribución 2/3 juego y 1/3 DEV Panel.
- Retícula 30×30 renderizada con PixiJS.
- Cuatro depósitos únicos generados aleatoriamente cerca del centro: carbón, cobre, hierro y piedra.
- Extracción continua manteniendo click izquierdo; velocidad configurable y valor inicial de 1 recurso/s.
- Inventario superior en vivo.
- DEV Panel con sliders + inputs numéricos para velocidad de extracción, reserva inicial, radio de aparición, brillo, pulso, inventarios y cantidades de depósitos.
- Regeneración de depósitos desde DEV Panel.
- Estética steampunk con acentos neón.

### Lo ya validado localmente

- Instalación/entorno suficientes para ejecutar el proyecto.
- Build local sin errores reportados.
- Servidor de desarrollo y apertura de la aplicación en navegador.

### Lo que todavía falta validar

- Proporción visual exacta y retícula completa a 1920×1080.
- Existencia y posición de los cuatro depósitos.
- Interacción sostenida de minería y ritmo de 1 recurso/s.
- Actualización de contadores.
- Efecto real de sliders e inputs del DEV Panel.

## Arquitectura vigente

- Plataforma: navegador web de escritorio.
- Lenguaje: JavaScript moderno con módulos ES.
- Renderer: PixiJS 8.19.0.
- Tooling: Vite 8.1.5.
- Persistencia: todavía no existe.
- Entrada inicial: mouse.
- Módulos principales:
  - `src/game/config.js`: configuración y metadatos de recursos.
  - `src/game/state.js`: estado y simulación de minería.
  - `src/game/renderer.js`: render PixiJS e interacción con depósitos.
  - `src/ui/devPanel.js`: controles de desarrollo.
  - `src/main.js`: composición de aplicación y HUD.

## Decisiones activas

| ID | Decisión | Motivo | Referencia |
|---|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D, efectos y expansión modular | `docs/decisiones/ADR-001-arquitectura-web.md` |

## Riesgos, deuda y bloqueos

| Estado | Riesgo o bloqueo | Impacto | Acción siguiente |
|---|---|---|---|
| Abierto | Validación funcional detallada todavía pendiente | medio | recorrer manualmente el loop y controles del DEV Panel |

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

## Cómo verificarlo

```bash
npm run build
```

Después validar manualmente en navegador: layout 2/3–1/3, retícula completa, cuatro depósitos, minería mantenida a 1 recurso/s, contadores y todos los controles del DEV Panel.

## Historial cronológico

### 2026-08-07 — Validación local inicial por el usuario

**Rama:** `agent/prototipo-v0-1`

**Resultado informado**

- Las comprobaciones de entorno se completaron correctamente.
- El build local no reportó errores según el usuario.
- El servidor de desarrollo arrancó y la ventana del juego se abrió correctamente en navegador.

**Estado de validación**

- Arranque local: validado manualmente.
- Funciones individuales del juego: pendientes de recorrido sistemático.

**Siguiente paso**

- Verificar visualmente e interactuar con cada elemento de v0.1; registrar cualquier desviación en `BUGS.md`.

### 2026-08-07 — Prototipo web v0.1 implementado

**Rama:** `agent/prototipo-v0-1`

**Objetivo**

- Construir el primer loop jugable y el DEV Panel permanente.

**Cambios realizados**

- Añadidos PixiJS 8.19.0 y Vite 8.1.5.
- Implementados estado, minería, renderer, HUD y DEV Panel modular.
- Añadida dirección visual steampunk/neón.

**Pruebas ejecutadas inicialmente por GPT**

- Intento de clonar rama y ejecutar `npm install && npm run build` bloqueado porque el entorno de ejecución de GPT no resolvía `github.com`.
- Esa limitación quedó superada posteriormente mediante ejecución local del usuario.

**Estado al cerrar**

- Implementación publicada remotamente y ya ejecutable localmente; pendiente validación funcional detallada.

### 2026-08-07 — Inicialización del repositorio

**Rama:** `main`

- Se establecieron `CONTINUIDAD_GPT.md`, `AGENTS.md`, `BITÁCORA_GPT.md`, `BUGS.md`, ADR y template de PR conforme al repositorio de reglas.
