# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Último checkpoint verificable | `implementación v0.1 publicada remotamente en rama activa` |
| Estado del build | `no ejecutado: entorno local sin resolución DNS hacia github.com` |
| Estado de pruebas | `revisión remota/estructural realizada; build y validación manual pendientes` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Ejecutar `npm install` y `npm run build` en un entorno con acceso de red, abrir el prototipo en navegador y validar visualmente layout, retícula, minería y controles del DEV Panel antes de integrar.

### Criterio para considerar completado el próximo paso

- [x] Layout 2/3 juego y 1/3 DEV Panel implementado.
- [x] Retícula 30×30 con carbón, cobre, hierro y piedra cerca del centro implementada.
- [x] Minería manual por click izquierdo a 1 recurso/segundo por defecto implementada.
- [x] Contadores superiores y parámetros editables en DEV Panel implementados.
- [ ] Build automatizado ejecutado con resultado registrado.
- [ ] Validación manual en navegador completada y registrada.

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

### Lo que todavía falta validar

- Instalación de dependencias y build de producción.
- Comportamiento real de PixiJS 8.19.0 en navegador objetivo.
- Interacción sostenida de minería y controles del DEV Panel.
- Ajuste visual exacto a 1920×1080 en hardware/navegador real.

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
| Abierto | El entorno de ejecución actual no resuelve `github.com`, por lo que no se pudo clonar ni instalar dependencias para build | medio | ejecutar validación en entorno con red |
| Abierto | Validación visual/manual pendiente | medio | abrir en navegador a 1920×1080 y recorrer flujo principal |

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

### 2026-08-07 — Prototipo web v0.1 implementado

**Rama:** `agent/prototipo-v0-1`

**Objetivo**

- Construir el primer loop jugable y el DEV Panel permanente.

**Cambios realizados**

- Añadidos PixiJS 8.19.0 y Vite 8.1.5.
- Implementados estado, minería, renderer, HUD y DEV Panel modular.
- Añadida dirección visual steampunk/neón.

**Pruebas ejecutadas**

- Intento: clonar rama y ejecutar `npm install && npm run build`.
- Resultado: bloqueado antes de clonar porque el entorno no pudo resolver `github.com`.
- Validación manual: pendiente.

**Problemas encontrados**

- Bloqueo de infraestructura de red del entorno de ejecución; no se atribuye al código.

**Estado al cerrar**

- Implementación publicada remotamente y lista para build/validación externa; no declarada validada.

**Siguiente paso**

- Ejecutar build y validación manual; corregir cualquier incidencia antes de integrar.

### 2026-08-07 — Inicialización del repositorio

**Rama:** `main`

- Se establecieron `CONTINUIDAD_GPT.md`, `AGENTS.md`, `BITÁCORA_GPT.md`, `BUGS.md`, ADR y template de PR conforme al repositorio de reglas.
