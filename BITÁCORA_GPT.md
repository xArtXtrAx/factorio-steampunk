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
| Subfase activa | `2 — almacenamiento local / Tolva Mk.I` |
| Rama estable | `main` |
| Rama activa | `agent/yacimientos-v0-3` |
| PR activo | `#3 — Implementa yacimientos multicelda v0.3 (draft, ampliado a logística local)` |
| Último checkpoint | `Tolva Mk.I, salida local de extractores y DEV Logística implementados remotamente` |
| Estado del build | `pendiente en checkout local` |
| Estado de pruebas | `yacimientos: aprobación visual positiva del usuario; recorrido sistemático pendiente. Tolva: revisión estructural remota, validación manual pendiente` |
| Bugs abiertos heredados | `BUG-LOCAL-001 — corrección implementada, validación manual pendiente` |
| Cambios locales sin publicar | `ninguno conocido` |
| Última actualización | `2026-08-08` |

## Próximo paso exacto

Actualizar el checkout local a `agent/yacimientos-v0-3`, ejecutar `npm run build` y abrir con `npm run dev`. Validar primero una cadena mínima `Extractor → Tolva`: comprar/crear una tolva, colocarla en una celda vacía ortogonalmente adyacente al extractor, confirmar que recibe producción, que acepta un solo tipo, que el extractor pasa a `salida bloqueada` al llenarse y que hacer click sobre la tolva recoge su contenido al inventario. Después variar capacidad, costos, fallback global, bloqueo y parámetros gráficos desde `DEV > Logística` / `Gráficos`.

No avanzar todavía al Carrito logístico Mk.I hasta estabilizar este contrato.

## Subfase 2 — Tolva Mk.I y almacenamiento local

### Preset inicial acordado

- tamaño: `1×1`;
- capacidad: `50` recursos;
- tipos simultáneos: `1`;
- entrada desde extractor: adyacencia ortogonal, distancia cardinal `1`;
- costo: `10 hierro + 5 cobre + 5 piedra + 0 carbón`;
- stock inicial: `0`;
- salida global del extractor cuando no existe tolva adyacente: activa como compatibilidad temporal;
- si existe salida local adyacente pero no puede aceptar el recurso: el extractor se bloquea por defecto;
- el jugador puede recoger manualmente el contenido haciendo click sobre la tolva.

### Contrato de propiedad

- comprar una Tolva Mk.I descuenta materiales y suma `1` a `hopperStock`;
- colocar consume una unidad del stock y requiere una celda vacía, sin depósito ni otra tolva;
- retirar devuelve la tolva al stock y transfiere su contenido al inventario para no destruir recursos;
- retirar todas hace lo mismo para cada tolva;
- el reset global elimina tolvas/stock/contenido y vuelve al preset original;
- regenerar yacimientos devuelve las tolvas instaladas al stock. La conservación explícita de contenido durante regeneración debe comprobarse en la validación manual antes de considerar cerrado el contrato.

### Salida del Extractor Mk.I

La producción automática ya no está obligada a teletransportarse siempre al inventario global.

Prioridad actual:

1. buscar Tolvas Mk.I ortogonalmente adyacentes al depósito trabajado;
2. si existe una tolva vacía o del mismo recurso con capacidad disponible, transferir allí la producción;
3. si existe salida local pero ninguna puede aceptar y `hopperBlocksExtractorWhenFull` está activo, estado `salida bloqueada` y no se extrae/consume trabajo para esa unidad;
4. si no existe tolva adyacente y `extractorGlobalOutputFallback` está activo, conservar el comportamiento legado y enviar al inventario global;
5. ambos comportamientos se pueden experimentar desde DEV.

Una tolva fija su tipo con el primer recurso recibido y no mezcla recursos en esta subfase.

### DEV > Logística

Nueva pestaña contextual `Logística`.

Controles de Tolva Mk.I:

- capacidad;
- costo hierro/cobre/piedra/carbón;
- stock disponible;
- `Salida global si no hay tolva`;
- `Bloquear extractor si salida local no acepta`;
- colocar/cancelar colocación;
- retirar todas.

Inspección/manipulación por tolva:

- coordenadas;
- recurso actual;
- contenido/capacidad;
- cambiar recurso cuando sea compatible;
- fijar contenido;
- llenar a capacidad;
- vaciar;
- recoger al inventario;
- retirar.

### Gráficos > Logística · Tolva Mk.I

Tuning visual añadido desde el primer checkpoint:

- escala visual;
- intensidad del glow de llenado;
- color del cuerpo;
- color de latón;
- color del indicador de llenado.

La representación inicial es procedural y minimalista: contenedor oscuro/latón con indicador vertical de llenado y punto de color del recurso almacenado.

### Perfiles DEV

`captureStartProfile()` incorpora:

- `hoppers` con posición, tipo y cantidad;
- `hopperStock`;
- toda la configuración logística y gráfica nueva entra automáticamente mediante `config`.

Perfiles antiguos sin tolvas siguen cargando con `hoppers=[]` y `hopperStock=0`. El almacenamiento local normaliza `resourceType` de tolvas vacías para evitar incompatibilidades al serializar/restaurar.

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

Cada celda sigue siendo un depósito real con reserva propia y agrupación conceptual mediante `veinId`:

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

Los perfiles antiguos sin `veinId` siguen siendo restaurables mediante identificadores de yacimiento compatibles al cargar.

### DEV > General > Generación de recursos

- yacimientos por recurso;
- tamaño mínimo/máximo;
- reserva por celda;
- radio aparición;
- irregularidad;
- regeneración explícita.

`Yacimientos activos` agrupa por `veinId` y permite editar cada celda.

El usuario reportó el 2026-08-08 que la generación multicelda **“se ve genial”** durante prueba manual. Esto se registra como aprobación visual positiva, no como sustituto del build ni del recorrido sistemático de contigüidad, extremos, resize y perfiles.

## Dirección de diseño v0.3

Objetivo general: hacer que **espacio, distancia y distribución de recursos importen**.

Secuencia acordada:

1. **Yacimientos multicelda** — implementados, validación sistemática pendiente.
2. **Almacenamiento local / Tolva Mk.I** — implementado en checkpoint actual, validación pendiente.
3. **Transporte físico básico / Carrito logístico Mk.I** — siguiente candidato, aún no implementar.
4. Evolución posterior: almacenes mayores, transportadores mecánicos, vagonetas/ferrocarril, fundición, edificios mayores, terreno y vapor/energía.

## v0.2 integrada — base heredada

- Extractor Mk.I `1×1`.
- Producción `1 recurso/s`.
- Eficiencia `10 recursos/carbón`.
- Buffer `5`.
- Costo `20 hierro + 10 cobre + 10 piedra`.
- Compra → stock → colocación; retirada devuelve máquina al stock.
- Panel jugador `TALLER DE CAMPO`.
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
| `ROADMAP-003` | v0.3 prioriza territorio → almacenamiento → transporte | La logística necesita distancia y buffers reales |
| `RESOURCE-003` | Cada celda conserva depósito propio y se agrupa por `veinId` | Compatibilidad con minería/extractores y futura logística |
| `LOGISTICS-003` | Tolva Mk.I es buffer local 1×1 de un solo recurso y prioridad de salida del extractor | Introducir saturación y ubicación antes del transporte móvil |
| `UI-004` | Logística obtiene pestaña DEV propia | El dominio ya tiene balance, estados, manipulación y futuros vehículos suficientes para justificar contexto independiente |

## Deuda de validación

### v0.3 · Tolva

- [ ] `npm run build` sobre el checkpoint actual.
- [ ] Comprar Tolva Mk.I con inventario insuficiente/exacto/excedente.
- [ ] Colocar sólo sobre celda vacía; rechazar depósito y otra tolva.
- [ ] Confirmar `Extractor → Tolva` ortogonal; diagonal no debe contar.
- [ ] Confirmar un solo tipo por tolva.
- [ ] Llenar a `50` y comprobar estado `salida bloqueada`.
- [ ] Recoger por click y confirmar reanudación del extractor.
- [ ] Desactivar fallback global y comprobar bloqueo sin tolva.
- [ ] Desactivar bloqueo local y confirmar fallback según contrato actual.
- [ ] Probar capacidad/costos/stock/manipulación desde `DEV > Logística`.
- [ ] Probar tuning en `Gráficos > Logística · Tolva Mk.I`.
- [ ] Guardar/cargar perfil temporal con tolvas vacías y llenas.
- [ ] Probar resize con tolvas instaladas.
- [ ] Probar regeneración de yacimientos con tolvas instaladas y verificar tratamiento de contenido/stock.

### v0.3 · Yacimientos

- [ ] Validar 8 yacimientos esperados en preset base.
- [ ] Validar tamaños 3–7 y contigüidad.
- [ ] Validar ausencia de solapamiento.
- [ ] Probar valores DEV extremos y regeneración.
- [ ] Probar minería y varios extractores sobre un mismo yacimiento.
- [ ] Probar resize 8×8, 30×30 y 60×60.
- [ ] Guardar/cargar perfiles con `veinId`.

### heredada de v0.2

- [ ] Recorrer `BUG-LOCAL-001`.
- [ ] Recorrer perfiles temporales persistentes/sobrescritura.
- [ ] Validar loop económico completo y autoalimentación del extractor.

## Historial de hitos

### 2026-08-08 — Subfase 2: Tolva Mk.I

- Usuario aprobó avanzar con almacenamiento local tras probar visualmente los yacimientos.
- Añadidos balance, costo, stock, compra/colocación/retirada y estado persistente de Tolva Mk.I.
- Añadida prioridad de salida local para extractores y estado `salida bloqueada`.
- Añadida recolección manual de tolva al inventario mediante click.
- Añadida pestaña `DEV > Logística` con control completo y manipulación por entidad.
- Añadido tuning visual en `Gráficos`.
- Perfiles temporales ampliados con tolvas y stock.
- Revisión estructural remota realizada; build y validación manual pendientes.

### 2026-08-08 — Prueba visual de yacimientos

- El usuario indicó durante prueba manual que los yacimientos multicelda “se ven genial”.
- Se conserva pendiente la validación sistemática funcional y de extremos.

### 2026-08-07 — Inicio implementación v0.3

- Creada rama `agent/yacimientos-v0-3` desde `main`.
- Añadidos yacimientos multicelda, `veinId` y controles DEV de generación.

### 2026-08-07 — Dirección v0.3 acordada

- Acordada hoja de ruta `yacimientos → almacenamiento → carrito logístico → sistemas posteriores`.
- Reforzado `DEV-001` para toda nueva implementación.

### 2026-08-07 — Integración v0.2

- PR #2 fusionado a `main`.
- Apariencia minimalista del extractor validada positivamente.

### 2026-08-07 — Integración v0.1

- PR #1 fusionado a `main`, merge `fe55692aa95adea043c19d8f1f8b121003c5c1d9`.
