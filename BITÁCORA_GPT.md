# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Objetivo actual | `Prototipo jugable v0.1` |
| Rama estable | `main` |
| Rama activa | `pendiente de crear` |
| Último checkpoint verificable | `documentación base en main` |
| Estado del build | `no ejecutado` |
| Estado de pruebas | `pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Bugs abiertos relevantes | `ninguno registrado` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Crear una rama `agent/prototipo-v0-1`, implementar la primera pantalla jugable y abrir un PR draft hacia `main`.

### Criterio para considerar completado el próximo paso

- [ ] Layout 2/3 juego y 1/3 DEV Panel en referencia 1920×1080.
- [ ] Retícula 30×30 con carbón, cobre, hierro y piedra cerca del centro.
- [ ] Minería manual por click izquierdo a 1 recurso/segundo por defecto.
- [ ] Contadores superiores y parámetros editables en DEV Panel.
- [ ] Build automatizado ejecutado con resultado registrado.
- [ ] Validación manual marcada explícitamente como pendiente o completada.

## Arquitectura vigente

- Plataforma: navegador web de escritorio.
- Lenguaje: JavaScript moderno con módulos ES.
- Renderer propuesto: PixiJS 8.
- Tooling propuesto: Vite.
- Persistencia: todavía no existe.
- Entrada inicial: mouse.

## Decisiones activas

| ID | Decisión | Motivo | Referencia |
|---|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Rendimiento 2D, efectos y expansión modular | `docs/decisiones/ADR-001-arquitectura-web.md` |

## Riesgos, deuda y bloqueos

| Estado | Riesgo o bloqueo | Impacto | Acción siguiente |
|---|---|---|---|
| Abierto | No hay validación visual/manual todavía | medio | Ejecutar build y validar en navegador tras implementar v0.1 |

## Cómo ejecutar el proyecto

Pendiente hasta publicar el prototipo.

## Cómo verificarlo

Pendiente hasta publicar el prototipo.

## Historial cronológico

### 2026-08-07 — Inicialización del repositorio

**Rama:** `main`

**Objetivo**

- Establecer continuidad y reglas operativas antes del primer cambio jugable.

**Cambios realizados**

- Añadido punto de entrada de continuidad, README y documentación operativa base.

**Pruebas ejecutadas**

- Ninguna; todavía no existe código ejecutable publicado.

**Estado al cerrar**

- Repositorio preparado para crear la primera rama de implementación.

**Siguiente paso**

- Crear `agent/prototipo-v0-1` e implementar el prototipo inicial.
