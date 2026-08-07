# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `main` |
| Fase u objetivo actual | `Prototipo jugable v0.1 integrado — validación final y siguiente iteración` |
| Estado | `PR #1 fusionado en main; v0.1 integrada con minería, DEV Panel, FX, sliders continuos, resets y retícula dinámica` |
| Commit remoto de referencia | `86dab76a896059d17ce74509ce26b174a0de587f` |
| Merge de v0.1 | `fe55692aa95adea043c19d8f1f8b121003c5c1d9` |
| Validación | `build inicial y arranque base validados por el usuario; build y recorrido manual final posteriores a los últimos cambios todavía pendientes` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Orden obligatorio de lectura

1. Leer este archivo desde `main`.
2. Identificar rama activa, commit remoto de referencia y estado de validación.
3. Leer `AGENTS.md`, `BITÁCORA_GPT.md` y `BUGS.md` desde la rama activa; si no existe, desde `main`.
4. Revisar ADR y documentación citada.
5. Revisar PR/commits recientes cuando corresponda.
6. Continuar desde **Próximo paso exacto** en `BITÁCORA_GPT.md`.

## Reglas críticas

- El repositorio es la fuente de verdad.
- No confundir implementación, revisión estructural, build y validación manual.
- `RESTAURAR VALORES INICIALES` es el reset maestro permanente y debe evolucionar con todos los sistemas futuros.
- El reset gráfico sólo modifica presentación/FX y preserva estado jugable.
- La retícula parte de 30×30 y puede variarse entre 8×8 y 60×60; los recursos deben adaptarse y permanecer dentro del mapa.
- Mantener este documento breve; el detalle técnico vive en `BITÁCORA_GPT.md`.

## Próximo punto de reanudación

En `main`, ejecutar `npm run build` y recorrer manualmente la v0.1 integrada: minería, pulso FX, pestañas del DEV Panel, sliders continuos, reset global, reset gráfico y extremos de retícula 8×8/60×60. Registrar cualquier incidencia en `BUGS.md` antes de iniciar la siguiente iteración.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
