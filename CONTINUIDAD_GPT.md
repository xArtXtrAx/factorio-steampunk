# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/extractor-v0-2` |
| Fase u objetivo actual | `v0.2 — Extractor de combustión Mk.I` |
| Estado | `primera automatización alimentada por carbón implementada remotamente con colocación, combustible, render y control DEV; build/validación local pendientes` |
| Commit remoto de referencia | `87dfeb86dc5fc2e070c6e5205b93711930cb8d98` |
| Base estable v0.1 | `merge fe55692aa95adea043c19d8f1f8b121003c5c1d9` |
| PR activo | `#2 Implementa extractor de combustión Mk.I (draft)` |
| Validación | `v0.1 ejecutada por el usuario; v0.2 revisada estructuralmente y pendiente de build/recorrido manual` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Orden obligatorio de lectura

1. Leer este archivo desde `main`.
2. Identificar rama activa, commit remoto de referencia y estado de validación.
3. Leer `AGENTS.md`, `BITÁCORA_GPT.md` y `BUGS.md` desde la rama activa; si no existe, desde `main`.
4. Revisar ADR y documentación citada.
5. Comparar `main` con la rama activa y revisar PR recientes.
6. Continuar desde **Próximo paso exacto** en `BITÁCORA_GPT.md`.

## Reglas críticas

- El repositorio es la fuente de verdad.
- No confundir implementación, revisión estructural, build y validación manual.
- Durante desarrollo buscamos control total: toda mecánica nueva debe exponer sus parámetros relevantes en el DEV Panel y toda presentación nueva debe exponer tuning visual razonable en `Gráficos`.
- El DEV Panel es una herramienta de experimentación/diagnóstico, no la UI final del jugador.
- `RESTAURAR VALORES INICIALES` es el reset maestro permanente y debe evolucionar con todos los sistemas futuros, incluidos extractores.
- El reset gráfico sólo modifica presentación/FX y preserva estado jugable.
- La retícula parte de 30×30 y puede variarse entre 8×8 y 60×60; depósitos y máquinas deben adaptarse al relayout.

## Próximo punto de reanudación

Actualizar el checkout local a `agent/extractor-v0-2`, ejecutar `npm run build` y validar el Extractor de combustión Mk.I: colocación sobre depósitos, consumo de carbón, producción 1 recurso/s, eficiencia 10 recursos/carbón, auto-carga, autoalimentación en carbón y controles de `Máquinas` / `Gráficos`.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
