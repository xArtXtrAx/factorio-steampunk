# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Fase u objetivo actual | `Prototipo jugable v0.1` |
| Estado | `implementado remotamente; validación pendiente` |
| Commit remoto de referencia | `4903af671c81f901f95b592c10aee67c32c0481c` |
| Validación | `revisión estructural realizada; build bloqueado por falta de resolución DNS en el entorno actual; validación manual pendiente` |
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
- Mantener este documento breve; el detalle técnico vive en `BITÁCORA_GPT.md`.
- Actualizar este archivo cuando cambien rama activa, fase, commit de referencia o estado de validación.

## Próximo punto de reanudación

Validar el prototipo v0.1: ejecutar instalación/build en un entorno con red y comprobar manualmente la interacción en navegador antes de integrar la rama.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
