# CONTINUIDAD GPT — Factorio Steampunk

Este archivo es el punto de entrada permanente para reanudar el proyecto sin depender de la memoria de una conversación.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Rama estable | `main` |
| Rama activa | `main` |
| Fase integrada | `v0.2 — Extractor Mk.I + economía + perfiles de arranque DEV` |
| Dirección siguiente | `v0.3 — yacimientos multicelda y logística básica, por subfases` |
| Estado | `dirección v0.3 acordada; primera subfase todavía en diseño, sin rama nueva` |
| Merge v0.2 | `5e13885a061a17e616f44496c72f1ce215700ba3` |
| Bitácora v0.3 | `79088e92c27f1c465d4f1289481509608e5e9c84` |
| PR activo | `ninguno` |
| Validación | `v0.2 integrada con deuda de build/regresión sistemática aún documentada` |
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
- Toda mecánica nueva debe exponer desde su implementación sus parámetros relevantes en DEV, ubicados contextualmente en la pestaña adecuada.
- Toda presentación/FX nueva debe exponer tuning visual razonable en `Gráficos`.
- Entidades nuevas deben ser inspeccionables/manipulables desde DEV cuando sea razonable.
- Presets iniciales son hipótesis de diseño, no balance definitivo.
- DEV Panel y UI del jugador permanecen conceptualmente separados.
- `DEV > General > Inventario` representa recursos del jugador; `Depósitos activos` representa reservas del mapa.
- Sliders DEV actualizan en vivo; campos numéricos permiten escritura libre y confirman al terminar. Ver `BUG-LOCAL-001`.
- Extractor Mk.I vigente: `1 recurso/s`, `10 recursos/carbón`, buffer `5`, costo `20 hierro + 10 cobre + 10 piedra`, 1×1 sobre depósito.
- Perfil original no se serializa ni puede sobrescribirse; existen tres perfiles temporales DEV persistentes mediante `localStorage`.
- Reset gráfico sólo modifica presentación/FX.

## Dirección v0.3 acordada

La meta es hacer que espacio y distancia importen. La hoja de ruta conceptual es:

`yacimientos multicelda → almacenamiento local → transporte físico básico → procesamiento/energía/logística avanzada`

El primer paso no es implementar tolvas o carritos. Primero debe cambiar el modelo del mapa para soportar:

- varias celdas por yacimiento;
- varios yacimientos del mismo recurso;
- reserva independiente por celda;
- varios extractores sobre diferentes celdas de un mismo yacimiento;
- parámetros de generación expuestos en DEV.

Detalles completos en `BITÁCORA_GPT.md`.

## Próximo punto de reanudación

**Discutir y cerrar el contrato de la subfase 1 de v0.3: yacimientos multicelda.** Definir tamaños, cantidad de yacimientos, riqueza por celda, forma/dispersión, reglas de aparición y comportamiento con extractores/perfiles/resize. Sólo después crear una rama nueva desde `main` e implementar.

Antes o al comenzar esa rama, ejecutar `npm run build` sobre `main` y hacer una regresión corta de v0.2.

## Prompt mínimo para un chat nuevo

```text
Continúa trabajando en:
https://github.com/xArtXtrAx/factorio-steampunk

Lee primero CONTINUIDAD_GPT.md desde main y sigue el orden de lectura documentado. No asumas pruebas pendientes como superadas.
```
