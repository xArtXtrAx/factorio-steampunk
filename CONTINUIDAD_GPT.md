# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/extractor-v0-2` |
| Fase u objetivo actual | `v0.2 — Extractor Mk.I + economía + perfiles de arranque DEV` |
| Estado | `extractor, economía, panel jugador y perfiles DEV implementados; corregida edición numérica del inventario y añadido límite configurable; validación local pendiente` |
| Commit remoto de referencia | `77210142983c373ac2d1aa4ad2afaf779a78c7e1` |
| Base estable v0.1 | `merge fe55692aa95adea043c19d8f1f8b121003c5c1d9` |
| PR activo | `#2 Implementa extractor de combustión Mk.I (draft)` |
| Validación | `apariencia general/minimalista del extractor validada positivamente por el usuario; BUG-LOCAL-001 corregido estructuralmente y pendiente de validación manual; economía y perfiles persistentes pendientes de recorrido completo` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Orden obligatorio de lectura

1. Leer este archivo desde `main`.
2. Identificar rama activa, commit remoto de referencia y estado de validación.
3. Leer `AGENTS.md`, `BITÁCORA_GPT.md` y `BUGS.md` desde la rama activa; si no existe, desde `main`.
4. Revisar ADR y documentación citada.
5. Comparar `main` con la rama activa y revisar commits o PR recientes.
6. Continuar desde **Próximo paso exacto** en `BITÁCORA_GPT.md`.

## Reglas críticas

- El repositorio es la fuente de verdad.
- No confundir implementación, revisión estructural, build y validación manual.
- Durante desarrollo buscamos control total: toda mecánica nueva debe exponer sus parámetros relevantes en el DEV Panel y toda presentación nueva debe exponer tuning visual razonable en `Gráficos`.
- El DEV Panel es una herramienta de experimentación/diagnóstico, no la UI final del jugador.
- El panel de jugador y el DEV Panel deben permanecer conceptualmente separados: gameplay real frente a herramientas de tuning.
- Los sliders DEV mantienen actualización continua; los campos numéricos deben permitir edición libre y confirmar al terminar para evitar pérdida de foco. Ver `BUG-LOCAL-001`.
- `DEV > General > Inventario` usa mínimo `0` y `inventoryEditMax` como máximo editable; valor canónico `100000`, configurable hasta `1000000`.
- Costo base actual del Extractor Mk.I: `20 hierro + 10 cobre + 10 piedra + 0 carbón`, totalmente configurable desde DEV.
- Comprar crea stock; colocar consume stock; retirar devuelve la máquina al stock sin reembolsar materiales.
- `RESTAURAR VALORES INICIALES` y `CARGAR PERFIL ORIGINAL` deben converger siempre al perfil original bloqueado definido por `DEFAULT_CONFIG` + `resetToDefaults()`.
- El perfil original no se serializa ni puede sobrescribirse.
- Existen tres perfiles temporales DEV persistentes/sobrescribibles mediante `localStorage`; son una herramienta DEV y no el futuro sistema de guardado del jugador. Ver `ADR-002`.
- El reset gráfico sólo modifica presentación/FX y preserva estado jugable.
- La retícula parte de 30×30 y puede variarse entre 8×8 y 60×60; depósitos y máquinas deben adaptarse al relayout.

## Próximo punto de reanudación

Actualizar `agent/extractor-v0-2`, ejecutar `npm run build` y validar primero `BUG-LOCAL-001`: escritura de varias cifras en Inventario, confirmación con Enter/blur, negativos, máximo configurable y persistencia del límite en perfiles. Después validar el loop económico completo y los tres perfiles temporales. Registrar cualquier defecto nuevo en `BUGS.md`.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
