# BITÁCORA GPT — Factorio Steampunk

> Documento operativo de continuidad. El punto de entrada permanente vive en `CONTINUIDAD_GPT.md` dentro de `main`.

## Principio de desarrollo: control total desde DEV

Durante desarrollo buscamos **control total y explícito sobre mecánicas y presentación** antes de consolidar balance definitivo.

- Toda mecánica nueva expone desde su implementación en DEV sus parámetros de balance relevantes, ubicados contextualmente en la pestaña adecuada.
- Toda presentación/FX nueva expone tuning razonable en `Gráficos`.
- Estados de entidades nuevas deben ser inspeccionables y, cuando sea razonable, manipulables desde DEV.
- Presets iniciales son hipótesis de diseño, no balance definitivo.
- Resets parciales/globales evolucionan junto con los sistemas.
- Sólo se ocultan o fijan parámetros por una decisión explícita de diseño.

El DEV Panel es una herramienta de experimentación y diagnóstico; no es la interfaz final del jugador.

## Estado actual

| Campo | Valor |
|---|---|
| Proyecto | `factorio-steampunk` |
| Fase activa | `v0.3 — Yacimientos multicelda y logística básica` |
| Subfase activa | `1 — yacimientos multicelda / múltiples yacimientos por recurso` |
| Rama estable | `main` |
| Rama activa | `agent/yacimientos-v0-3` |
| Base | `main` después de integración v0.2 y documentación de roadmap v0.3` |
| Último checkpoint | `generación multicelda + veinId + controles DEV implementados remotamente` |
| Estado del build | `pendiente en checkout local` |
| Estado de pruebas | `revisión estructural remota; validación visual/manual pendiente` |
| Bugs abiertos heredados | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-07` |

## Próximo paso exacto

Actualizar el checkout local a `agent/yacimientos-v0-3`, ejecutar `npm run build` y abrir con `npm run dev`. Validar primero el preset 30×30: dos yacimientos por recurso, 3–7 celdas contiguas, 100 unidades por celda y formas irregulares sin solapamiento. Después variar desde `DEV > General > Generación de recursos` cantidad, tamaños, reserva, radio e irregularidad y regenerar. Confirmar minería/extractores por celda, resize y perfiles temporales antes de avanzar a almacenamiento local.

## Subfase 1 — Yacimientos multicelda

### Preset inicial acordado

- `2` yacimientos por tipo de recurso;
- `3–7` celdas por yacimiento;
- `100` unidades por celda;
- formas contiguas ortogonalmente;
- irregularidad inicial `0.7`;
- no se permiten dos recursos en la misma celda;
- recursos distintos sí pueden quedar adyacentes;
- riqueza variable centro/borde **no implementada todavía**;
- Extractor Mk.I sigue ocupando `1×1` y trabaja una celda concreta.

### Contrato de estado

Cada celda sigue siendo un depósito real con reserva propia y añade agrupación conceptual mediante `veinId`:

```js
{
  id,
  veinId,
  type,
  x,
  y,
  amount,
}
```

Esto preserva minería manual, extractor, agotamiento y edición por celda, mientras permite identificar varias celdas como parte del mismo yacimiento.

Los perfiles antiguos sin `veinId` siguen siendo restaurables: cada depósito legado recibe un identificador de yacimiento compatible al cargar.

### Generación

`regenerateDeposits()` ahora:

1. devuelve extractores instalados al stock, como antes;
2. crea varios yacimientos por cada tipo de recurso;
3. busca una celda semilla libre dentro del radio de aparición;
4. expande el yacimiento por vecinos cardinales libres hasta su tamaño objetivo o hasta no encontrar espacio;
5. evita cualquier solapamiento de celdas;
6. asigna la misma `veinId` a todas las celdas del grupo;
7. limpia máquinas/colocación/minería vinculadas a los depósitos regenerados.

En retículas muy pequeñas o configuraciones DEV extremas, un yacimiento puede terminar con menos celdas que el objetivo si no queda espacio libre. Esto debe validarse antes de decidir si necesitamos una política de fallback más estricta.

### DEV > General > Generación de recursos

Controles implementados desde el primer checkpoint:

- `Yacimientos por recurso` — 1 a 12;
- `Tamaño mínimo (celdas)` — 1 a 30;
- `Tamaño máximo (celdas)` — 1 a 30;
- `Reserva por celda` — 1 a 10000;
- `Radio aparición` — 1 a 30;
- `Irregularidad` — 0 a 1;
- botón `REGENERAR YACIMIENTOS`.

Los cambios de generación no destruyen el mapa en cada pulsación: se aplican al regenerar explícitamente.

`Yacimientos activos` agrupa las celdas por `veinId`, muestra cuántas celdas tiene cada yacimiento y permite editar individualmente la reserva de cada celda.

### Configuración canónica nueva

`DEFAULT_CONFIG` incorpora:

```js
resourceVeinsPerType: 2,
resourceVeinMinCells: 3,
resourceVeinMaxCells: 7,
resourceVeinIrregularity: 0.7,
```

`initialDepositAmount: 100` pasa a interpretarse como **reserva por celda** para la generación nueva. `spawnRadius` continúa definiendo el área de semillas respecto al centro.

Los parámetros nuevos quedan incluidos automáticamente en perfil original y temporales porque forman parte de `config`.

## Dirección de diseño v0.3

Objetivo general: hacer que **espacio, distancia y distribución de recursos importen**.

Secuencia acordada, afinada por subfases:

1. **Yacimientos multicelda** — activa ahora.
2. **Almacenamiento local** — candidato `Tolva/Cajón Mk.I` 1×1 con capacidad limitada.
3. **Transporte físico básico** — candidato `Carrito logístico Mk.I` con origen/destino, capacidad, velocidad y tiempos de carga/descarga.
4. Evolución posterior: transportadores mecánicos, vagonetas/ferrocarril, fundición, edificios mayores, terreno y vapor/energía.

No implementar la siguiente subfase hasta estabilizar visual y funcionalmente la anterior.

## v0.2 integrada — base heredada

- Extractor Mk.I `1×1`.
- Producción `1 recurso/s`.
- Eficiencia `10 recursos/carbón`.
- Buffer `5`.
- Costo `20 hierro + 10 cobre + 10 piedra`.
- Compra → stock → colocación; retirada devuelve máquina al stock.
- Panel jugador `TALLER DE CAMPO`.
- DEV `General / Máquinas / Gráficos`.
- Inventario del jugador separado de reservas del mapa.
- Perfil original bloqueado + 3 perfiles temporales persistentes mediante `localStorage`.
- ADR-002 mantiene la persistencia DEV separada del futuro sistema de guardado.

Merge v0.2: `5e13885a061a17e616f44496c72f1ce215700ba3`.

## Decisiones activas

| ID | Decisión | Motivo |
|---|---|---|
| `ADR-001` | PixiJS + Vite y separación simulación/render/UI | Base modular 2D |
| `ADR-002` | Tres perfiles DEV en `localStorage`, original fuera de persistencia | Experimentación sin convertir DEV en saves |
| `DEV-001` | Toda mecánica nueva expone parámetros relevantes en DEV desde su implementación | Tuning antes de fijar balance |
| `MACHINE-001` | Extractor Mk.I 1×1 ligado a una celda de depósito | Legibilidad espacial |
| `ROADMAP-003` | v0.3 prioriza yacimientos antes de logística física | Distancia necesita un mundo espacialmente interesante |
| `RESOURCE-003` | Cada celda conserva depósito propio y se agrupa por `veinId` | Compatibilidad con minería/extractores y futura logística |

## Deuda de validación

### v0.3

- [ ] `npm run build` sobre `agent/yacimientos-v0-3`.
- [ ] Validar 8 yacimientos esperados en preset base (2 × 4 recursos).
- [ ] Validar tamaños 3–7 y contigüidad visual.
- [ ] Validar ausencia de solapamiento.
- [ ] Probar valores DEV extremos y regeneración.
- [ ] Probar minería manual en varias celdas del mismo yacimiento.
- [ ] Probar varios extractores en distintas celdas del mismo yacimiento.
- [ ] Probar resize 8×8, 30×30 y 60×60.
- [ ] Guardar/cargar perfil temporal con `veinId` y configuración nueva.

### heredada de v0.2

- [ ] Recorrer `BUG-LOCAL-001` (edición numérica, Enter/blur, negativos y máximo).
- [ ] Recorrer perfiles temporales persistentes/sobrescritura.
- [ ] Validar loop económico completo y autoalimentación del extractor.

## Historial de hitos

### 2026-08-07 — Inicio implementación v0.3

- Creada rama `agent/yacimientos-v0-3` desde `main`.
- Añadidos parámetros de generación de yacimientos a `DEFAULT_CONFIG`.
- Sustituida generación de una celda por recurso por múltiples yacimientos contiguos.
- Añadido `veinId` y compatibilidad con snapshots legados.
- Añadida sección DEV contextual de generación y agrupación de yacimientos activos.
- Build y validación local pendientes.

### 2026-08-07 — Dirección v0.3 acordada

- Acordada hoja de ruta `yacimientos → almacenamiento → carrito logístico → sistemas posteriores`.
- Reforzado `DEV-001` para toda nueva implementación.

### 2026-08-07 — Integración v0.2

- PR #2 fusionado a `main`.
- Apariencia minimalista del extractor validada positivamente.

### 2026-08-07 — Integración v0.1

- PR #1 fusionado a `main`, merge `fe55692aa95adea043c19d8f1f8b121003c5c1d9`.
