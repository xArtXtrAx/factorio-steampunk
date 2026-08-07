# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Fase u objetivo actual | `Prototipo jugable v0.1 — validación de retícula dinámica y DEV Panel` |
| Estado | `retícula 8×8–60×60 configurable en vivo, FX, pestañas, sliders continuos y resets implementados remotamente; build y validación manual posteriores a los últimos cambios pendientes` |
| Commit remoto de referencia | `1403222103d3878fad21cd57131f772d02a597e0` |
| Validación | `build previo y arranque base validados por el usuario; retícula dinámica y cambios recientes revisados estructuralmente y pendientes de prueba local` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Orden obligatorio de lectura

1. Leer este archivo desde `main`.
2. Identificar la rama activa y el commit remoto de referencia.
3. Leer `AGENTS.md`, `BITÁCORA_GPT.md` y `BUGS.md` desde la rama activa; si no existe, desde `main`.
4. Revisar ADR y documentación citada.
5. Comparar `main` con la rama activa y revisar PR recientes.
6. Continuar desde **Próximo paso exacto** en `BITÁCORA_GPT.md`.

## Reglas críticas

- El repositorio es la fuente de verdad.
- No confundir revisión estructural con compilación o validación manual.
- El botón global `RESTAURAR VALORES INICIALES` debe evolucionar junto con el juego y devolver siempre todos los sistemas al estado inicial.
- El reset gráfico sólo debe modificar parámetros visuales y preservar el estado jugable.
- La retícula parte de 30×30 y puede variarse dinámicamente; los recursos deben permanecer dentro del mapa y adaptarse al relayout.
- Mantener este documento breve; el detalle técnico vive en `BITÁCORA_GPT.md`.
- Actualizar este archivo cuando cambien rama activa, fase, commit de referencia o estado de validación.

## Próximo punto de reanudación

Actualizar la rama local, ejecutar `npm run build` y validar en navegador el slider `Tamaño de retícula (N × N)` entre 8×8 y 60×60, confirmando que los recursos se adaptan y que el reset global devuelve la retícula a 30×30.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
