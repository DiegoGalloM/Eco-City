# progress.md — Eco-Ciudad

Original prompt: Read the project instructions, master prompt, progress handoff, and every approved reference; use Graphify and the web-game workflow; implement and visually verify Checkpoint 1 only (Foundation + Landing + City Map); update this handoff before finishing.

## Current checkpoint

A–D y cierre de calidad de E completados para el alcance actual, con cuatro retos progresivos. Master Prompt restaurado y leído. Optimización dedicada para celular aplazada por el usuario.

## Implementado

- Portada, mapa, misiones/decisiones/consecuencias en Escuela, Casa, Parque y Comunidad.
- Escenas con cambios según decisiones, logros, final calculado y reinicio.
- Reciclaje independiente en las cuatro zonas; 8 objetos por zona.
- Caída progresiva: 18/14/10/7 segundos en el orden Escuela/Casa/Parque/Comunidad.
- Desbloqueo por decisión + reto completo; selección pausa, reintentos sin penalización irreversible.
- Mouse, Pointer Events táctiles, toque y teclado; pausa por ajustes o pérdida de foco.
- Corrección del clic residual que consumía Enter después de arrastrar.
- Guardado version 2 en la clave existente, migración de decisiones y reciclaje escolar version 1.
- README con ejecución, contenido, estructura, recursos y guardados.

## Arquitectura

- App.tsx mantiene pantallas y guardado. game.ts deriva estados, métricas y puntuación a partir de decisiones/objetos.
- Recycling.tsx recibe fallDuration y avance de la zona; se remonta al cambiar de zona.
- Puntuación: 40% Planeta, 30% Recursos, 30% Comunidad. Bonificación de reciclaje distribuida entre los 32 objetos.
- WebP originales en public/art/; controles HTML y alternativas SVG. No se usan capturas como UI.
- render_game_to_text expone avance por zona y duración; advanceTime avanza la caída de forma determinista.
- Grafo y pruebas generadas permanecen ignorados.

## Validación de esta entrega

- Build y lint: pasan.
- QA integral: pasa en 320×740, 360×800, 390×844, 768×1024, 1366×768, 1440×900 y 1920×1080.
- Cuatro velocidades comprobadas, desbloqueos, arrastre/touch/tap/teclado, caídas recuperables, pausa, recarga, logros y reinicio.
- Casos límite: cancelación, cambio de tamaño, borde del bote, doble activación, blur y continuidad del foco pasan.
- Migración version 1, progreso independiente, recarga parcial, guardados corruptos/inválidos/bloqueados y movimiento reducido pasan.
- Dos partidas completas verificadas: 100% con mejores decisiones y 80% con decisiones alternativas.
- Capturas principales revisadas contra las ocho referencias. Corregidos controles de cabecera recortados a 320 px y tamaño de SVG anidados en escenas.
- Build de producción probado en Chromium local: primer contenido visible 156/188 ms (390/1440 px), intervalo de frames mediano 16.7 ms, 843275 bytes transferidos al inicio sin compresión HTTP; cero errores de consola. Es una medición local sin limitación de CPU/red, no un resultado Lighthouse ni una prueba de teléfono físico.
- Alternativas SVG ante imágenes inválidas y escenas de las cuatro zonas verificadas en producción.
- Evidencia: test-results/full-game/summary.json (incluye estado global y errores); test-results/production/summary.json; capturas en ambas carpetas.
- El cliente de develop-web-game se usa para smoke de mapa y sincronización con render_game_to_text.
- Sin defectos funcionales conocidos pendientes en el alcance verificado.

## Referencias

1 portada; 2 mapa; 3 misión escolar; 4 decisiones; 5 consecuencias; 6 reciclaje; 8 agua; 9 logros. Se conserva su dirección visual adaptada a HTML/CSS.

## Próximo alcance

Optimización específica para celular, expresamente aplazada por el usuario. Mantener la compatibilidad existente en esta fase.
