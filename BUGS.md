# BUGS — Factorio Steampunk

> Registro maestro local de defectos, investigaciones y correcciones del proyecto.

## Índice

| ID local | Título | Severidad | Estado | Área | Descubierto | Candidato universal |
|---|---|---|---|---|---|---|
| `BUG-LOCAL-001` | Campo numérico DEV pierde foco al escribir | media | Validación manual pendiente | DEV Panel / controles numéricos | 2026-08-07 | por evaluar |

## BUG-LOCAL-001 — Campo numérico DEV pierde foco al escribir

| Campo | Valor |
|---|---|
| Estado | `Validación manual pendiente` |
| Severidad | `media` |
| Área | `DEV Panel / controles numéricos` |
| Descubrimiento | `2026-08-07` |
| Rama | `agent/extractor-v0-2` |
| Commit inicial | `ea4e52fc10d0d03762ea2c13e5da7ae7efe7df97` |
| Candidato universal | `por evaluar` |

### Resumen

Al editar manualmente un valor numérico del inventario, cada tecla disparaba inmediatamente una modificación de estado; el evento de cambio global reconstruía el DEV Panel y el campo perdía el foco, impidiendo escribir cifras de varias posiciones con normalidad.

### Comportamiento esperado

El usuario debe poder escribir libremente una cifra completa en un campo numérico y confirmar el valor al terminar, sin que el control desaparezca o pierda el foco en cada pulsación.

### Comportamiento observado

El `input` numérico ejecutaba el callback en cada evento `input`; ese callback llamaba a `state.touch()`, `game-state-change` solicitaba un rerender y `host.replaceChildren()` sustituía el campo activo.

### Reproducción y evidencia

1. Abrir `DEV > General > Inventario`.
2. Seleccionar el campo numérico de cualquier recurso.
3. Intentar escribir un valor de varias cifras, por ejemplo `250`.
4. Antes de la corrección, el primer dígito era aplicado y el campo perdía el foco inmediatamente.

Reportado y reproducido por el usuario durante la sesión de desarrollo del 2026-08-07.

### Causa raíz

Confirmada: `numberControl()` escuchaba `input` tanto en slider como en campo numérico. Para el campo de texto numérico esto provocaba mutación de estado y reconstrucción completa del panel en cada tecla.

### Corrección

- El slider conserva actualización continua mediante `input`.
- El campo numérico ahora confirma mediante `change`; Enter fuerza `blur` y confirma el valor.
- Los controles con mínimo no negativo bloquean la tecla `-`; valores negativos pegados/escritos por otros medios se normalizan al mínimo al confirmar.
- `DEV > General > Inventario` incorpora `inventoryEditMax`, configurable entre `1` y `1,000,000`, con valor original `100,000`.
- Los campos manuales de recursos usan `0` como mínimo y `inventoryEditMax` como máximo.
- `inventoryEditMax` forma parte de `DEFAULT_CONFIG`, por lo que entra automáticamente en perfiles temporales y vuelve a `100,000` al cargar el perfil original.

Commits de corrección: `c2588e7862c2ae3bb7ad12e6344d2770e711e018`, `e14e3525f660dd6c715f83d73c4c028f53606335`.

### Verificación

- Revisión estructural remota: completada.
- Build local posterior a la corrección: pendiente.
- Validación manual de escritura continua, Enter, blur, máximo y negativos: pendiente.

### Pruebas de regresión

- Escribir `250`, `12345` y el máximo permitido sin perder foco entre dígitos.
- Confirmar con Enter y con click fuera del campo.
- Intentar `-1` y pegar un valor negativo; el estado no debe quedar por debajo de `0`.
- Escribir un valor por encima del máximo; debe normalizarse al máximo configurado.
- Cambiar `Límite máximo editable`, guardar un perfil temporal, recargarlo y confirmar que el límite persiste.
- Cargar `Original · bloqueado` y confirmar que el máximo vuelve a `100000`.

### Evaluación universal

Pendiente tras validación manual. La separación entre controles continuos (`range/input`) y edición textual confirmada (`number/change`) puede ser reutilizable en futuros paneles DEV.

## Estados permitidos

- Reportado
- Reproducible
- En diagnóstico
- Causa confirmada
- Corrección implementada
- Verificación automática completada
- Validación manual pendiente
- Validado manualmente
- Validado físicamente
- Cerrado
- No se corregirá

## Plantilla de entrada

### BUG-LOCAL-XXX — Título

| Campo | Valor |
|---|---|
| Estado | `estado exacto` |
| Severidad | `crítica/alta/media/baja` |
| Área | `módulo o sistema` |
| Descubrimiento | `AAAA-MM-DD` |
| Rama | `rama` |
| Commit inicial | `SHA o no aplica` |
| Candidato universal | `sí/no/por evaluar` |

#### Resumen

Describir qué falla y por qué importa.

#### Comportamiento esperado

Describir el comportamiento correcto.

#### Comportamiento observado

Describir el fallo observado.

#### Reproducción y evidencia

Documentar pasos, entorno, frecuencia y evidencia.

#### Causa raíz

`Pendiente de confirmar` hasta contar con evidencia suficiente.

#### Corrección

Documentar el cambio aplicado o propuesto.

#### Verificación

Registrar comandos y resultados reales. Separar verificación automática de validación manual.

#### Pruebas de regresión

Registrar casos que impidan que el fallo reaparezca.

#### Evaluación universal

Indicar si la lección merece promoverse a `xArtXtrAx/bugs-universales-corregidos`.

## Reglas de mantenimiento

1. Todo bug que requiera seguimiento recibe un ID local estable y secuencial.
2. No borrar bugs cerrados.
3. Separar síntomas, hipótesis, causa confirmada, corrección y validación.
4. No cerrar un bug sin registrar evidencia y pruebas.
5. Los candidatos universales se registran primero aquí.
