# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/prototipo-v0-1` |
| Fase u objetivo actual | `Prototipo jugable v0.1 — validación de DEV Panel, FX y reset global` |
| Estado | `pestañas, FX, sliders continuos y restauración global de valores iniciales implementados remotamente; build y validación visual posteriores a los cambios pendientes` |
| Commit remoto de referencia | `8eccda7b288238a6b58e49c51247843d7e980149` |
| Validación | `build previo y arranque base validados por el usuario; cambios recientes revisados estructuralmente y pendientes de prueba local` |
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

Actualizar la rama local, ejecutar `npm run build` y validar en navegador las pestañas General/Gráficos, el pulso de extracción, el arrastre continuo de sliders y el botón `RESTAURAR VALORES INICIALES`, confirmando que devuelve configuración, inventario y depósitos al estado inicial.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
