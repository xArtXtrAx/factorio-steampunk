# BUGS — Factorio Steampunk

> Registro maestro local de defectos, investigaciones y correcciones del proyecto.

## Índice

Actualmente no hay bugs registrados.

| ID local | Título | Severidad | Estado | Área | Descubierto | Candidato universal |
|---|---|---|---|---|---|---|

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
