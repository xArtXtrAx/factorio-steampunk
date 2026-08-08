# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `main` |
| Fase integrada | `v0.2 — Extractor Mk.I + economía + perfiles de arranque DEV` |
| Estado | `PR #2 integrado; listo para discutir y definir la siguiente fase` |
| Merge v0.2 | `5e13885a061a17e616f44496c72f1ce215700ba3` |
| Último commit documental | `b0e97212dc4f62f83f29fa593c6675ea1a0c9920` |
| Base v0.1 | `fe55692aa95adea043c19d8f1f8b121003c5c1d9` |
| PR activo | `ninguno` |
| Validación | `apariencia general/minimalista del extractor validada positivamente; checkpoint final integrado conserva deuda de build/regresión sistemática documentada en BITÁCORA_GPT.md` |
| Bugs abiertos | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Última actualización | `2026-08-07` |

## Orden obligatorio de lectura

1. Leer este archivo desde `main`.
2. Identificar rama activa, commit de referencia y estado de validación.
3. Leer `AGENTS.md`, `BITÁCORA_GPT.md` y `BUGS.md` desde la rama activa.
4. Revisar ADR y documentación citada.
5. Comparar `main` con cualquier rama activa y revisar PR/commits recientes.
6. Continuar desde **Próximo paso exacto** en `BITÁCORA_GPT.md`.

## Reglas críticas

- El repositorio es la fuente de verdad.
- No confundir implementación, revisión estructural, build y validación manual.
- Durante desarrollo buscamos control total: toda mecánica nueva debe exponer parámetros relevantes en DEV y toda presentación nueva tuning visual razonable en `Gráficos`.
- El DEV Panel es una herramienta de experimentación/diagnóstico, no la UI final del jugador.
- Panel de jugador y DEV Panel permanecen conceptualmente separados.
- Sliders DEV actualizan en vivo; campos numéricos permiten escritura libre y confirman al terminar. Ver `BUG-LOCAL-001`.
- `DEV > General > Inventario` representa recursos del jugador; `Depósitos activos` representa reservas del mapa.
- Inventario manual: mínimo `0`, máximo configurable `inventoryEditMax`; preset `100000`, rango DEV hasta `1000000`.
- Extractor Mk.I: `1 recurso/s`, `10 recursos/carbón`, buffer `5`, costo `20 hierro + 10 cobre + 10 piedra`, 1×1 sobre depósito.
- Comprar crea stock; colocar consume stock; retirar devuelve la máquina sin reembolso de materiales.
- `RESTAURAR VALORES INICIALES` y `CARGAR PERFIL ORIGINAL` convergen al arranque canónico definido por `DEFAULT_CONFIG` + `resetToDefaults()`.
- Perfil original no se serializa ni puede sobrescribirse.
- Existen tres perfiles temporales DEV persistentes/sobrescribibles mediante `localStorage`; no son el futuro sistema de guardado del jugador. Ver `ADR-002`.
- Reset gráfico sólo modifica presentación/FX.
- Retícula base 30×30, configurable entre 8×8 y 60×60.

## Próximo punto de reanudación

**Discutir con el propietario del proyecto el objetivo de la siguiente fase.** No crear una rama nueva hasta acordar el alcance. Una vez definido, crear la rama desde `main` y saldar al inicio la deuda corta de validación de v0.2: `npm run build` sobre `main` y smoke test de edición numérica, perfiles y loop económico.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
