# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/yacimientos-v0-3` |
| Fase activa | `v0.3 — Yacimientos multicelda y logística básica` |
| Subfase | `1 — yacimientos multicelda / múltiples yacimientos por recurso` |
| Estado | `primer checkpoint implementado remotamente; build y validación local pendientes` |
| Commit remoto de referencia | `64b69ef694a77e48c9c4d9f1eea1789b45a72b06` |
| Merge v0.2 | `5e13885a061a17e616f44496c72f1ce215700ba3` |
| PR activo | `#3 Implementa yacimientos multicelda v0.3 (draft)` |
| Validación | `v0.3 sólo revisión estructural remota; v0.2 conserva deuda de regresión sistemática documentada` |
| Bugs abiertos | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Última actualización | `2026-08-07` |

## Orden obligatorio de lectura

1. Leer este archivo desde `main`.
2. Identificar rama activa, commit de referencia y estado de validación.
3. Leer `AGENTS.md`, `BITÁCORA_GPT.md` y `BUGS.md` desde la rama activa.
4. Revisar ADR y documentación citada.
5. Comparar `main` con la rama activa y revisar PR/commits recientes.
6. Continuar desde **Próximo paso exacto** en `BITÁCORA_GPT.md`.

## Reglas críticas

- El repositorio es la fuente de verdad.
- No confundir implementación, revisión estructural, build y validación manual.
- Toda mecánica nueva debe exponer desde su implementación sus parámetros relevantes en DEV, ubicados contextualmente en la pestaña adecuada.
- Toda presentación/FX nueva debe exponer tuning visual razonable en `Gráficos`.
- Entidades nuevas deben ser inspeccionables/manipulables desde DEV cuando sea razonable.
- Presets iniciales son hipótesis de diseño, no balance definitivo.
- DEV Panel y UI del jugador permanecen conceptualmente separados.
- Inventario del jugador y reservas del mapa son conceptos separados.
- Sliders DEV actualizan en vivo; campos numéricos permiten escritura libre y confirman al terminar. Ver `BUG-LOCAL-001`.
- Perfil original no se serializa ni puede sobrescribirse; existen tres perfiles temporales DEV persistentes mediante `localStorage`.
- Reset gráfico sólo modifica presentación/FX.

## v0.3 — contrato actual de yacimientos

Preset inicial:

- `2` yacimientos por recurso;
- `3–7` celdas por yacimiento;
- `100` recursos por celda;
- irregularidad `0.7`;
- crecimiento por vecinos cardinales;
- no hay solapamiento de celdas;
- cada celda conserva reserva propia y se agrupa mediante `veinId`;
- riqueza variable centro/borde todavía no está implementada.

Controles disponibles en `DEV > General > Generación de recursos`: cantidad de yacimientos, tamaños mínimo/máximo, reserva por celda, radio de aparición, irregularidad y regeneración explícita.

La hoja de ruta conceptual se mantiene:

`yacimientos multicelda → almacenamiento local → transporte físico básico → procesamiento/energía/logística avanzada`

## Próximo punto de reanudación

Actualizar el checkout local a `agent/yacimientos-v0-3`, ejecutar `npm run build` y `npm run dev`. Validar visualmente el preset base y luego variar parámetros desde DEV. Confirmar contigüidad, ausencia de solapamiento, minería/extractores por celda, resize y perfiles temporales. No comenzar Tolva/Cajón Mk.I hasta estabilizar esta subfase.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
