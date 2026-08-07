# Instrucciones para GPT y agentes de desarrollo

Estas reglas son obligatorias para cualquier trabajo dentro de este repositorio.

## Lectura inicial

Antes de proponer o modificar código:

1. Leer `CONTINUIDAD_GPT.md` desde `main`.
2. Identificar rama activa, commit remoto de referencia y estado de validación.
3. Leer `BITÁCORA_GPT.md` completa desde la rama activa; si no existe, desde `main`.
4. Leer `BUGS.md` desde la misma rama.
5. Revisar los ADR y archivos citados por la bitácora.
6. Comparar `main` con la rama activa y revisar commits o PR recientes.
7. Continuar desde el próximo paso exacto documentado.

## Forma de trabajo

- Realizar cambios acotados y coherentes con el objetivo vigente.
- No introducir dependencias ni cambios arquitectónicos silenciosos.
- Toda configuración jugable nueva debe evaluarse para exposición en el DEV Panel.
- Mantener simulación, render y UI desacoplados siempre que sea razonable.
- Ejecutar pruebas pertinentes antes de declarar completada una tarea.
- Distinguir entre implementado, revisado estructuralmente, verificado automáticamente y validado manualmente.
- No guardar secretos ni credenciales.
- No usar `force push`, borrados destructivos ni reescritura de historia sin autorización explícita.

## Documentación obligatoria

- Actualizar `BITÁCORA_GPT.md` cuando cambie el estado real del proyecto.
- Actualizar `BUGS.md` cuando se descubra, diagnostique, corrija o valide un defecto.
- Actualizar `CONTINUIDAD_GPT.md` en `main` cuando cambien rama activa, fase, commit de referencia o validación.
- Registrar decisiones arquitectónicas costosas de revertir en `docs/decisiones/` mediante ADR.

## Bugs universales

Antes de implementar sistemas sensibles, revisar `xArtXtrAx/bugs-universales-corregidos` cuando exista un caso relevante. Todo bug se registra primero localmente en `BUGS.md`.

## Criterio de finalización

Una tarea sólo se considera terminada cuando el cambio está implementado, las verificaciones pertinentes fueron ejecutadas, la documentación refleja el estado real y el siguiente paso es comprensible para una conversación nueva.
