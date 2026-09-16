# Eco-Ciudad

Juego educativo de sostenibilidad para niñas y niños, con cuatro zonas, decisiones con consecuencias y cuatro retos de reciclaje cada vez más rápidos. React, TypeScript y Vite; sin servidor ni cuentas.

## Instalación y desarrollo

Con Node.js 22.12 o posterior:

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

## Build y comprobaciones

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:game
node scripts/qa-production.mjs
```

La prueba de juego necesita el servidor de desarrollo en http://127.0.0.1:5173. Se puede cambiar con ECO_CITY_URL y limitar un viewport con ECO_QA_WIDTH. Capturas e informe global: test-results/full-game/. El script histórico qa-checkpoint1.mjs corresponde a la navegación antigua; la validación vigente es qa-game.mjs.

qa-production.mjs sirve dist temporalmente en localhost y comprueba carga, errores y recursos visuales ausentes. Sus mediciones son de Chromium local sin limitación de red/CPU, no un resultado Lighthouse ni una prueba de dispositivos físicos.

## Flujo

Portada → mapa → misión → decisión → consecuencia → reciclaje de la zona → siguiente zona → logros → ciudad final.

| Zona | Nivel | Tiempo de caída |
| --- | --- | --- |
| Escuela | 1 | 18 segundos |
| Casa | 2 | 14 segundos |
| Parque | 3 | 10 segundos |
| Comunidad | 4 | 7 segundos |

Cada reto contiene 8 objetos y cuatro materiales. Seleccionar detiene la caída; se puede arrastrar, tocar objeto/bote o usar Tab y Enter. Escape suelta el objeto. Los errores permiten reintentar sin perder objetos. Pausa, cambio de pestaña y ajustes detienen la caída. Movimiento reducido mantiene los objetos quietos.

Para abrir la siguiente zona se necesita una decisión y completar sus 8 objetos. El final requiere las cuatro zonas. Es posible revisar decisiones sin acumular recompensas repetidas.

## Estructura

- src/App.tsx: pantallas, navegación, diálogos, logros y persistencia.
- src/game.ts: misiones, opciones, materiales, velocidades, validación del guardado y puntuación.
- src/data.ts: orden de las zonas.
- src/Recycling.tsx: interacción de arrastre/toque/teclado y caída.
- src/Art.tsx: escenas y alternativas SVG si una imagen no carga.
- src/styles.css y src/game.css: presentación y adaptaciones existentes.
- public/art/: WebP de producción y procedencia.
- references/: imágenes aprobadas, usadas como orientación.
- scripts/qa-game.mjs: prueba integral y casos límite.
- graphify-out/: grafo local generado, excluido de Git.

## Contenido y puntuación

missions es un Record<ZoneId, Mission>. Cada misión tiene título, pregunta, objetivo, insignia y options. Cada opción tiene id, título, explicación, icono, efectos sobre planeta/comunidad/recursos, feedback, cambio visible y helpful.

Para modificar una misión, edita sus datos en src/game.ts. Para añadir una zona, actualiza ZoneId y zones en src/data.ts, su misión y recyclingLevels en src/game.ts, el guardado inicial, la escena en src/Art.tsx y las pruebas. Actualiza los contadores de cuatro zonas en la interfaz si amplías el alcance.

Cada métrica empieza en 10, suma las decisiones y un máximo de 10 por los 32 objetos clasificados. Se limita a 100. La puntuación final pondera Planeta 40%, Recursos 30% y Comunidad 30%.

## Guardado

localStorage usa la clave eco-ciudad-v1 y un documento con version: 2. Guarda decisiones, objetos por zona, errores y preferencias; métricas e insignias se derivan. La migración conserva decisiones y reciclaje escolar de version: 1; los otros retos empiezan vacíos. No inventa progreso completado. Los datos inválidos se filtran y el almacenamiento bloqueado permite seguir jugando con un aviso.

## Recursos visuales

Sustituye city-map.webp, explorers.webp y locations.webp en public/art/. Conserva las dimensiones y el atlas documentados en public/art/README.md. El texto y los controles son HTML; las referencias no se insertan como pantallas. scripts/optimize-art.mjs genera WebP desde originales locales.

## Alcance siguiente

La optimización específica para celulares queda para una fase futura por indicación del usuario. La compatibilidad existente con toque, teclado, movimiento reducido y los tamaños actuales se conserva y se comprueba como regresión.
