# ADR-001 — Arquitectura web inicial

- **Estado:** Aceptado
- **Fecha:** 2026-08-07
- **Responsables:** GPT / propietario del proyecto
- **Relacionado con:** Prototipo jugable v0.1

## Contexto

El juego requiere una simulación 2D expansible, gran cantidad potencial de entidades, efectos gráficos, una interfaz web sencilla y un DEV Panel que pueda modificar parámetros en tiempo real sin acoplarse al renderer.

## Decisión

Usar **PixiJS 8** para renderizado 2D acelerado y **Vite** para desarrollo/build. Mantener separados cuatro conceptos desde el inicio:

1. estado/configuración de la simulación;
2. lógica de juego y extracción;
3. render del mundo;
4. interfaz HUD/DEV Panel.

Los parámetros jugables deberán vivir en un estado/configuración central y el DEV Panel los modificará sin duplicar valores internos.

## Alternativas consideradas

### Canvas 2D sin framework

- Ventajas: dependencia mínima y control directo.
- Desventajas: más trabajo propio al crecer partículas, filtros, batching y escenas complejas.
- Motivo para descartarla: el proyecto prioriza expansión gráfica y rendimiento a largo plazo.

### Phaser

- Ventajas: framework de juego más completo y ecosistema amplio.
- Desventajas: añade sistemas que no necesitamos todavía y puede imponer una estructura mayor de la deseada.
- Motivo para posponerla: buscamos una capa de render potente con simulación propia y UI web ligera.

## Consecuencias

### Positivas

- Render 2D acelerado apto para efectos y muchas entidades.
- Arquitectura modular y testeable fuera del renderer.
- DEV Panel desacoplado y extensible.

### Negativas o costos

- Dependencia externa importante en PixiJS.
- Habrá que vigilar cambios de API entre versiones mayores.

### Riesgos

- Acoplar la simulación a objetos gráficos de PixiJS. Mitigación: mantener el estado de juego en módulos sin dependencia del renderer.

## Validación

- El prototipo v0.1 debe compilar con Vite y demostrar retícula 30×30, depósitos, minería manual, HUD y edición de parámetros desde DEV Panel.
- La validación visual/manual en navegador debe registrarse separadamente.

## Revisión futura

Reconsiderar si el renderer limita una escala objetivo demostrable, si se requieren sistemas 3D o si el tamaño/overhead del framework se vuelve un problema medido.
