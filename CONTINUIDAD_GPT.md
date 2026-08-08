# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `agent/yacimientos-v0-3` |
| Fase activa | `v0.3 — Yacimientos multicelda y logística básica` |
| Subfase | `2 — almacenamiento local / Tolva Mk.I` |
| Estado | `Tolva Mk.I y salida local implementadas remotamente; build y validación local pendientes` |
| Commit remoto de referencia | `96a1da96c636b3911829e0d6c686551cc1af13fe` |
| Merge v0.2 | `5e13885a061a17e616f44496c72f1ce215700ba3` |
| PR activo | `#3 Implementa yacimientos multicelda y Tolva Mk.I v0.3 (draft)` |
| Validación | `yacimientos con aprobación visual positiva del usuario; Tolva sólo revisión estructural remota; deuda sistemática de v0.2/v0.3 sigue documentada` |
| Bugs abiertos | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Última actualización | `2026-08-08` |

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
- Inventario del jugador, reservas del mapa y almacenamiento local son conceptos separados.
- Sliders DEV actualizan en vivo; campos numéricos permiten escritura libre y confirman al terminar. Ver `BUG-LOCAL-001`.
- Perfil original no se serializa ni puede sobrescribirse; existen tres perfiles temporales DEV persistentes mediante `localStorage`.
- Reset gráfico sólo modifica presentación/FX.

## v0.3 — contratos activos

### Yacimientos

- `2` yacimientos por recurso;
- `3–7` celdas por yacimiento;
- `100` recursos por celda;
- irregularidad `0.7`;
- crecimiento cardinal;
- sin solapamiento;
- reserva independiente por celda y agrupación mediante `veinId`;
- riqueza variable centro/borde todavía no implementada.

### Tolva Mk.I

- `1×1` sobre celda vacía;
- capacidad base `50`;
- un solo tipo de recurso;
- costo `10 hierro + 5 cobre + 5 piedra`;
- recibe salida de extractores ortogonalmente adyacentes;
- salida bloqueada cuando existe almacenamiento local pero no acepta y el bloqueo está activo;
- fallback al inventario global si no hay tolva, configurable desde DEV;
- click sobre tolva con contenido recoge al inventario;
- compra/stock/colocación/retirada y perfiles temporales incorporan la entidad.

DEV contextual:

- `General > Generación de recursos` para yacimientos;
- `Máquinas` para Extractor Mk.I;
- `Logística` para Tolva Mk.I, almacenamiento y política de salida;
- `Gráficos > Logística · Tolva Mk.I` para tuning visual.

La hoja de ruta sigue:

`yacimientos multicelda → almacenamiento local → transporte físico básico → procesamiento/energía/logística avanzada`

## Próximo punto de reanudación

Actualizar el checkout local a `agent/yacimientos-v0-3`, ejecutar `npm run build` y `npm run dev`. Validar cadena `Extractor → Tolva`, colocación sólo en vacío, llenado hasta capacidad, estado `salida bloqueada`, recolección por click, fallback global, perfiles temporales, resize y tuning completo desde DEV. No comenzar Carrito logístico Mk.I hasta estabilizar la Tolva.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
