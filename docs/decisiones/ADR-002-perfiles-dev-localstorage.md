# ADR-002 — Perfiles DEV persistentes en localStorage

- **Estado:** Aceptado
- **Fecha:** 2026-08-07
- **Responsables:** GPT / propietario del proyecto
- **Relacionado con:** v0.2 — experimentación de perfiles de arranque

## Contexto

Durante desarrollo necesitamos comparar distintos comienzos del juego —inventarios, dimensiones, depósitos, configuración, stock y máquinas— sin perder la base canónica establecida desde el prototipo inicial.

El usuario requiere un perfil original bloqueado y al menos tres perfiles temporales que sobrevivan recargas del navegador y puedan sobrescribirse.

El juego todavía no tiene un sistema de guardado para el jugador y no queremos acoplar esta herramienta DEV a una futura arquitectura de saves.

## Decisión

1. `DEFAULT_CONFIG` + `resetToDefaults()` siguen definiendo el **perfil original bloqueado**. No se serializa ni puede sobrescribirse desde la interfaz.
2. Se ofrecen exactamente tres slots temporales DEV en esta fase.
3. Los slots se persisten mediante `window.localStorage` con una clave versionada propia de la herramienta DEV.
4. Cada slot guarda un snapshot del estado de arranque: configuración, inventario, depósitos y posiciones, stock de extractores y máquinas instaladas.
5. Al cargar un snapshot se limpian estados transitorios como minería activa, colocación y último evento de extracción.
6. La persistencia DEV queda encapsulada en `src/game/startProfiles.js` y no constituye el sistema de guardado del juego final.

## Consecuencias

### Positivas

- Permite comparar configuraciones de inicio rápidamente.
- Los experimentos sobreviven recargas y reinicios del servidor de desarrollo.
- El perfil canónico permanece protegido y reproducible.
- No requiere backend ni dependencia adicional.

### Negativas o límites

- Los perfiles existen sólo en ese navegador/origen y no se sincronizan entre PCs.
- Borrar datos del sitio elimina los perfiles temporales.
- Cambios futuros incompatibles en el esquema pueden requerir migración o invalidación de slots.

## Mitigaciones

- La clave de almacenamiento y los snapshots llevan versión de esquema.
- La carga valida y normaliza el estado antes de aplicarlo.
- El perfil original no depende de `localStorage`, por lo que siempre permanece recuperable.

## Validación pendiente

- Guardar los tres slots y recargar navegador.
- Confirmar persistencia tras reiniciar `npm run dev`.
- Sobrescribir un slot y verificar que los otros dos no cambian.
- Cargar el perfil original después de varios experimentos y comprobar el retorno completo al preset canónico.

## Revisión futura

Reevaluar esta decisión únicamente al diseñar guardado real del jugador. Ese sistema deberá tener su propio contrato de versión, migraciones y persistencia; no deberá reutilizar `localStorage` DEV por accidente.
