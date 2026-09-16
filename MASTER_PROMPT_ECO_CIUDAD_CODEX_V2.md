# MASTER PROMPT — Eco-Ciudad / SOSTEK Sustainability Game

## Role

You are a senior frontend/product engineer working directly inside this GitHub repository.

Your job is **not to only explain what should be built**. Inspect the existing repository, understand the current architecture and dependencies, and then **implement the complete playable product described below**.

Work iteratively:
1. Inspect the repository and available assets/references.
2. Make a concise implementation plan.
3. Implement the product directly in the codebase.
4. Run the app/build regularly.
5. Fix integration, TypeScript, layout, interaction, and performance issues as they appear.
6. Continue until the complete playable flow is working and demo-ready.

Preserve existing working code when appropriate. Do not rewrite or replace infrastructure unnecessarily.

## 0. Working Strategy — Mandatory

Treat this file as the persistent product specification for the repository.

Before making meaningful changes:

1. Read this entire file.
2. Inspect the repository structure and package configuration.
3. Inspect every file inside `/references` and any existing assets.
4. Read `AGENTS.md` if present and obey repository-specific instructions.
5. Read `progress.md` if present so you do not rediscover solved problems or repeat failed approaches.
6. Inspect the current implementation in the browser before deciding that a screen needs to be rebuilt.
7. Make the smallest architectural decision that can support the complete product.

Do not ask the user to repeat information that already exists in this specification, the repository, `/references`, `AGENTS.md`, or `progress.md`.

Ask a question only when missing information would materially change the implementation and cannot be reasonably inferred.

When ambiguity is minor, choose the simplest solution consistent with:
- the approved references,
- the educational goal,
- mobile + desktop usability,
- maintainability,
- performance.

### Work in checkpoints, not one giant uncontrolled pass

Use the master specification as the full target, but implement it through checkpoints:

**Checkpoint A — Foundation + Landing + City Map**  
Get the visual language, responsive shell, state model and map interaction right before multiplying that design across the app.

**Checkpoint B — Mission + Decision + Consequence loop**  
Complete one mission end-to-end and confirm that the interaction model feels good.

**Checkpoint C — Mini-games + remaining zones**  
Add recycling, water and the remaining missions using the established patterns.

**Checkpoint D — Achievements + final city + persistence**  
Complete the full game loop.

**Checkpoint E — visual QA + responsive QA + performance polish**  
Do not add features here. Only improve quality.

At the end of each checkpoint:
- run the app,
- run relevant build/lint checks,
- inspect the rendered UI,
- test the affected interaction flow,
- update `progress.md`,
- fix meaningful regressions before moving on.

### Maintain `progress.md`

If `progress.md` does not exist, create it.

Keep it concise and useful. Record:
- what has been implemented,
- important architectural decisions,
- known visual/interaction issues,
- tests already performed,
- unresolved TODOs,
- assumptions,
- useful commands,
- asset/reference mappings.

Do not turn it into a diary.

When starting a new Codex session, read it before modifying the app.

### Visual comparison is mandatory

For every major screen:

1. Open the current implementation in a real browser.
2. Inspect the corresponding approved reference image.
3. Compare:
   - hierarchy,
   - density,
   - color balance,
   - character/image prominence,
   - button prominence,
   - whitespace,
   - typography,
   - friendliness,
   - mobile composition.
4. Preserve the **visual intention**, not literal screenshot dimensions.
5. Fix visible mismatches before considering the screen complete.

Do not respond to visual problems by blindly adding more UI.

If the implementation starts to look like a SaaS dashboard, stop and correct the visual direction.

### Feedback interpretation

When the user gives subjective feedback, translate it into concrete interface changes.

Examples:

- “Too dashboard-like” → reduce panels/cards, increase illustrated world presence, make zones feel embedded in the city.
- “Too empty” → improve composition and environmental detail before adding more controls.
- “Too busy” → reduce competing accents, copy and decorative elements.
- “Doesn’t feel like the references” → compare imagery, color, scale, hierarchy and composition directly.
- “Mobile feels awkward” → inspect touch reach, vertical rhythm, viewport height, fixed UI and image crops.
- “Make it smoother” → first inspect unnecessary rerenders, expensive effects, layout shifts and animation properties before adding animation libraries.

Do not interpret “make it better” as permission to add unrelated features.

### Quality over scope

Do not expand scope while core screens are still visually or interactively weak.

Prefer:
- 4 excellent missions over 12 mediocre missions,
- one excellent mini-game over several unfinished ones,
- coherent artwork over many mismatched assets,
- subtle motion over animation everywhere,
- real browser verification over assumptions from source code.

---

# 1. Product Vision

Build a polished, lightweight, responsive educational web game for children focused on sustainability.

The game is called:

# **Eco-Ciudad**

Core idea:

> The player helps improve different areas of a city by making sustainable decisions and seeing the consequences of those decisions.

The experience must work well on:

- desktop with mouse,
- tablets,
- mobile phones with touch.

The app should feel:

- smooth,
- fast,
- playful,
- visually cohesive,
- child-friendly,
- easy to understand,
- lightweight.

Do **not** over-engineer the product.

The goal is a focused, polished educational game rather than a large game engine or production-scale platform.

---

# 2. Visual References

If the repository contains a `/references` folder, inspect **every reference image before implementing the corresponding screen**.

The approved reference images are the visual source of truth for:

- overall mood,
- composition,
- color direction,
- button scale,
- child-friendly style,
- environmental theme,
- characters and city atmosphere,
- intended interaction flow.

Do **not** simply embed screenshots from the references as pages.

Rebuild the experience as real, responsive, interactive HTML/CSS/React components.

Use the references as inspiration and product guidance rather than as rigid pixel-perfect screenshots.

The desktop layout should adapt naturally instead of looking like a stretched phone screen.

---

# 3. Educational Goal

The game should teach sustainability primarily through:

- interaction,
- visible consequences,
- short explanations,
- experimentation,
- positive reinforcement.

Avoid long educational paragraphs.

The main educational model is:

```text
decision → consequence → explanation → visible improvement
```

Do not rely primarily on:

```text
quiz → correct / incorrect
```

The game should communicate:

> Small decisions can transform the environment.

Avoid guilt-heavy or moralizing language.

---

# 4. Target Audience

Primary audience:

- elementary-school children.

Language should be:

- simple,
- positive,
- clear,
- short,
- understandable without adult assistance.

Prefer:

> Esta opción genera más residuos.

instead of:

> ¡Incorrecto!

Prefer:

> ¡Buena decisión!

instead of:

> Respuesta correcta.

---

# 5. Main Game Flow

The primary experience should follow this structure:

```text
Landing
   ↓
City Map
   ↓
Select Zone
   ↓
Mission
   ↓
Decision or Mini-game
   ↓
Result + Consequence
   ↓
Visible City Improvement
   ↓
Next Mission
   ↓
Achievements
   ↓
Final Sustainable City
```

The player should always understand:

- where they are,
- what they need to do,
- what happened because of their decision,
- how much progress they have made.

Avoid dead ends.

---

# 6. City Zones

The city contains four primary zones:

## Escuela

Themes:

- waste,
- recycling,
- reusable objects,
- sustainable school habits.

## Casa

Themes:

- water,
- energy,
- daily habits.

## Parque

Themes:

- nature,
- litter,
- biodiversity,
- care for shared natural spaces.

## Comunidad

Themes:

- collective actions,
- mobility,
- transport,
- shared spaces,
- cooperation.

Each zone should have clear interactive states:

```text
locked
available
completed
```

Suggested visual behavior:

### Available
- highlighted,
- subtle pulse or movement,
- clearly tappable.

### Completed
- check icon,
- greener/cleaner visual state,
- visible improvement.

### Locked
- slightly muted,
- still recognizable.

The city map should act as the primary navigation.

---

# 7. Screen 1 — Landing / Start

Purpose:

Introduce the game instantly and make the player want to start.

Visual direction:

- cheerful sustainable city,
- school,
- houses,
- nature,
- bicycles,
- renewable energy details,
- friendly characters,
- bright sky,
- strong central title.

Main content:

```text
Eco-Ciudad
Construye un futuro sostenible
```

Primary CTA:

```text
▶ Jugar
```

Secondary CTA:

```text
¿Cómo se juega?
```

Requirements:

- large touch-friendly controls,
- clear visual hierarchy,
- subtle entrance animation,
- minimal loading,
- immediate understanding.

---

# 8. Screen 2 — City Map

Build a playful illustrated city overview.

The map should display:

- Escuela,
- Casa,
- Parque,
- Comunidad.

Each zone must be directly interactive.

Include lightweight progress information.

Example HUD:

```text
🌍 Planeta
🤝 Comunidad
🌱 Recursos
```

Do not build a complex game economy.

Use simple integer values, ideally in the range:

```text
0–100
```

The HUD should remain visually light and never dominate the game.

---

# 9. Mission Screen

A mission should show one concrete environmental problem.

Example:

```text
MISIÓN

La escuela genera demasiada basura.

¿Qué podemos hacer?
```

Show the problem visually.

Examples:

- overflowing trash,
- disposable bottles,
- leaking faucet,
- litter in a park,
- traffic or transport issue.

Avoid screens that are only text.

Each mission should contain one simple objective.

Example:

```text
Reduce los residuos de la escuela
```

---

# 10. Decision Mechanic

Decision-based missions should normally provide three clear options.

Example:

```text
¿Qué opción ayuda más a la escuela?
```

Possible options:

```text
Instalar bebederos
y usar botellas reutilizables
```

```text
Comprar más vasos desechables
```

```text
Crear una campaña ecológica
```

Represent options as large cards containing:

- icon or illustration,
- short title,
- short explanation.

Do not use tiny radio buttons.

Cards must support:

- click,
- touch/tap,
- keyboard navigation.

---

# 11. Consequence Feedback

After a decision, show the consequence rather than only saying whether the answer was right.

Positive example:

```text
¡Buena decisión!

Usar botellas reutilizables reduce
la cantidad de residuos diarios.
```

Then show metric changes:

```text
🌍 Planeta +3
🤝 Comunidad +1
```

Partially useful example:

```text
Esta solución ayuda un poco,
pero todavía genera residuos.
```

Negative example:

```text
Esta opción parece cómoda,
pero genera más basura.
```

The player should learn **why** the result happened.

---

# 12. Visible City Transformation

This is one of the most important mechanics.

After completing a mission, the relevant area should visibly improve.

Examples:

### Before
- trash on floor,
- overflowing bins,
- water leak,
- grey or neglected area.

### After
- recycling stations,
- clean environment,
- reusable bottles,
- plants,
- repaired faucet,
- clean water,
- happier characters.

The player should feel:

> “I changed this place.”

Use state-based visual changes and lightweight transitions.

Avoid heavy animation systems.

---

# 13. Recycling Mini-game

Implement one functional recycling mini-game.

Instruction:

```text
Arrastra cada objeto
al bote correcto
```

Suggested categories:

```text
Orgánico
Papel
Plástico
Metal
```

Suggested objects:

- banana peel,
- sheet of paper,
- cardboard,
- plastic bottle,
- aluminum can,
- food waste.

The mechanic must work with:

- mouse drag,
- finger drag,
- tap-based fallback.

Prefer Pointer Events.

Do not maintain separate desktop and mobile implementations.

Suggested interaction:

```text
pointerdown
pointermove
pointerup
```

Provide a fallback:

```text
tap object
→
tap destination bin
```

Drop targets must be generous.

Minimum touch target:

```text
44px
```

Prefer larger.

Provide visual states for:

- hover,
- selected,
- dragging,
- valid destination,
- successful placement.

---

# 14. Water Mission

Create a mission involving water waste.

Possible setting:

- school,
- home,
- shared community area.

Example problem:

```text
Se está desperdiciando mucha agua.

¿Qué hacemos?
```

Possible actions:

```text
Reparar fuga
Cerrar llave
Reusar agua
```

Multiple decisions may be environmentally helpful but have different effects.

Example:

```text
Reparar fuga
Recursos +4
```

```text
Cerrar llave
Recursos +2
```

```text
Reusar agua
Recursos +3
Planeta +1
```

Avoid forcing every mission into one obvious binary answer.

---

# 15. Achievements

Implement a lightweight badge system.

Example badges:

```text
💧 Guardián del Agua
♻️ Héroe del Reciclaje
🌳 Amigo de la Naturaleza
```

Badges unlock after relevant missions.

Use positive reinforcement.

Achievement example:

```text
¡Excelente trabajo!

Tus buenas decisiones
están ayudando al planeta.
```

Keep celebrations brief and pleasant.

Do not interrupt the flow with excessive modal dialogs.

---

# 16. Final Screen

After all primary missions are completed, show:

# **Tu ciudad sostenible**

Example:

```text
Tu ciudad es
85% sostenible
```

Do **not** hardcode 85%.

Calculate the final score from the player's decisions.

Suggested formula:

```ts
score =
  planetScore * 0.4 +
  resourcesScore * 0.3 +
  communityScore * 0.3;
```

Clamp to:

```text
0–100
```

Display final tips such as:

```text
💧 Ahorra agua
🚫 Usa menos plástico
♻️ Recicla y reutiliza
```

The final city must visually contain the improvements achieved during the game.

Provide:

```text
Volver a jugar
```

Optionally:

```text
Explorar ciudad
```

to return to the completed city map.

---

# 17. Initial Content Scope

Keep the first version small but complete.

Build approximately:

```text
4 primary missions
```

Suggested:

### Escuela
Waste and reusable bottles.

### Casa
Water consumption.

### Parque
Nature, litter, or biodiversity.

### Comunidad
Transport or collective environmental action.

Include:

```text
1 recycling mini-game
```

Quality is more important than quantity.

Do not create dozens of missions before the core experience is polished.

---

# 18. Visual Style

The product should feel:

- colorful,
- optimistic,
- playful,
- environmental,
- clean,
- friendly,
- educational.

Avoid:

- enterprise dashboard aesthetics,
- dark UI,
- excessive glassmorphism,
- hyper-realistic imagery,
- preschool-level baby styling,
- cluttered interfaces.

Visual target:

```text
educational mobile game
+
interactive illustrated story
+
polished lightweight web app
```

Use:

- rounded cards,
- organic shapes,
- leaves,
- clouds,
- soft shadows,
- subtle outlines,
- large friendly controls.

---

# 19. Suggested Color Palette

Use CSS variables.

Suggested starting palette:

```css
--color-primary: #34A853;
--color-green-bright: #6CCF57;
--color-sky: #4DA8DA;
--color-blue: #2878B5;
--color-yellow: #F8C842;
--color-orange: #F39A3D;
--color-red: #E95A47;
--color-cream: #FFF8E7;
--color-text: #29413A;
```

Adjust as needed to better match the approved visual references.

Do not scatter hardcoded colors throughout the application.

---

# 20. Typography

Use a friendly, highly readable font.

Recommended options:

- Nunito,
- Fredoka.

Use at most two fonts.

Prioritize readability over decorative typography.

---

# 21. Responsive Design

Build mobile-first.

Target:

```text
320px+   mobile
768px+   tablet
1024px+  desktop
```

Mobile:

- single-column when appropriate,
- large buttons,
- large touch areas,
- portrait-friendly,
- full-width cards.

Desktop:

- centered game experience,
- wider city map,
- responsive horizontal arrangements where useful,
- do not simply stretch the mobile UI.

Suggested max content width:

```text
1100–1200px
```

Avoid excessive width on large monitors.

---

# 22. Game Shell

The application should feel like a game/app, not a conventional content website.

Use a main wrapper such as:

```tsx
<GameShell>
```

Desktop:
- center the experience,
- preserve comfortable framing.

Mobile:
- use the viewport naturally.

Prefer:

```css
min-height: 100dvh;
```

rather than relying only on `100vh`.

---

# 23. Touch + Mouse Support

All interactions must work without hover.

Prefer Pointer Events.

Use:

```text
pointerdown
pointermove
pointerup
```

rather than separate mouse/touch implementations where possible.

Buttons and interactive elements should support:

```text
:hover
:active
:focus-visible
```

Touch interactions must remain understandable without hover states.

---

# 24. Motion and Smoothness

The product should feel smooth without becoming animation-heavy.

Prefer animations based on:

```text
transform
opacity
```

Typical duration:

```text
150–350ms
```

Examples:

### Button press
```css
transform: scale(0.97);
```

### Card entrance
```text
opacity + translateY
```

### Achievement
```text
scale + opacity
```

### City improvement
- crossfade,
- small reveal,
- object appearance.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 25. Performance

The game should perform smoothly on normal mobile phones.

Avoid unnecessary dependencies.

Do not introduce:

- 3D engines,
- canvas game engines,
- large animation libraries,
- Redux unless absolutely necessary,
- complex backend infrastructure.

Prefer browser-native capabilities.

Aim for excellent perceived performance and, where reasonably possible:

```text
Lighthouse Performance > 90
```

Do not sacrifice usability merely to chase a synthetic score.

---

# 26. Recommended Technical Stack

Prefer:

```text
React
TypeScript
Vite
```

If the repository already uses a reasonable equivalent stack, preserve it instead of rebuilding unnecessarily.

Styling:

Prefer:

```text
CSS Modules
```

or clean scoped CSS.

Tailwind is acceptable if the existing repository already uses it.

Do not add Tailwind solely for this prototype if plain CSS is simpler.

State management:

```text
React Context + useReducer
```

or a very small custom state solution.

Do not introduce Redux for this scope.

Heavy routing is unnecessary.

A state-driven flow is acceptable.

Example:

```ts
type GameScreen =
  | "start"
  | "map"
  | "mission"
  | "decision"
  | "result"
  | "minigame"
  | "achievements"
  | "final";
```

---

# 27. Suggested Project Structure

Keep the project easy to understand.

```text
src/
  app/
    App.tsx
    GameProvider.tsx

  components/
    GameShell/
    PrimaryButton/
    ProgressBar/
    MetricChip/
    MissionCard/
    DecisionCard/
    Badge/
    Modal/

  screens/
    StartScreen/
    CityMapScreen/
    MissionScreen/
    DecisionScreen/
    ResultScreen/
    RecyclingGameScreen/
    AchievementsScreen/
    FinalScreen/

  game/
    missions.ts
    achievements.ts
    scoring.ts
    types.ts

  assets/
    backgrounds/
    characters/
    city/
    icons/
    items/

  styles/
    variables.css
    globals.css
```

Avoid excessive folder depth or abstraction.

---

# 28. Data-Driven Missions

Do not hardcode full mission logic directly into screen JSX.

Use a small data-driven structure.

Example:

```ts
interface Mission {
  id: string;
  zone: "school" | "home" | "park" | "community";

  title: string;
  description: string;

  type:
    | "decision"
    | "recycling"
    | "water";

  options?: DecisionOption[];

  rewardBadge?: string;
}
```

Decision options:

```ts
interface DecisionOption {
  id: string;

  title: string;
  description: string;

  effects: {
    planet?: number;
    resources?: number;
    community?: number;
  };

  feedback: string;
}
```

Keep content easy to edit later.

---

# 29. State and Persistence

Store lightweight progress using:

```text
localStorage
```

Persist:

- completed missions,
- current scores,
- unlocked badges,
- basic progress state.

Do not build authentication.

Do not build a backend.

If storage data is corrupted or invalid, recover gracefully.

Provide:

```text
Reiniciar partida
```

---

# 30. Accessibility

Implement:

- semantic buttons,
- keyboard support,
- visible focus states,
- sufficient contrast,
- generous target sizes,
- alt text for meaningful images,
- ARIA labels only where needed.

Drag-and-drop must never be the only way to complete a task.

Provide a keyboard/tap alternative.

---

# 31. Sound

Sound is optional.

If added, keep it minimal:

- success sound,
- click feedback,
- achievement sound.

Include a sound toggle.

Do not autoplay music.

The game must remain fully understandable without audio.

If sound assets are unavailable, skip audio rather than blocking the implementation.

---

# 32. Asset Strategy

Use custom supplied illustrations where available.

If production artwork is missing, use temporary lightweight alternatives:

- SVG illustrations,
- simple icons,
- gradients,
- CSS shapes,
- occasional emoji where stylistically appropriate.

Do not block implementation because an illustration is missing.

Make asset replacement easy.

Do not embed reference screenshots as the UI itself.

---

# 33. Icons

If an icon library is needed, use one lightweight library only.

Recommended:

```text
Lucide React
```

Avoid mixing icon families.

---

# 34. Interaction Feedback

All interactive controls should feel responsive.

Examples:

### Buttons
```text
hover → subtle lift
press → slight scale
```

### Decision cards
```text
hover → highlight
selected → strong outline
```

### City zone
```text
available → subtle pulse
completed → check + visual improvement
```

### Recycling object
```text
dragging → slight scale
```

### Drop target
```text
valid target → clear highlight
```

Feedback should be immediate.

---

# 35. Loading

Avoid unnecessary loading screens.

Preload only important assets.

Lazy-load secondary visual assets where helpful.

The experience should open quickly.

---

# 36. Error Handling

The app should not fail silently.

Handle:

- invalid localStorage,
- missing images,
- unexpected game state.

Use graceful fallbacks.

Normal gameplay should produce:

- no console errors,
- no uncaught exceptions,
- no broken routes/imports.

---

# 37. Mobile Validation

Explicitly test:

```text
360x800
390x844
768x1024
```

Verify:

- no horizontal scrolling,
- no clipped content,
- no tiny targets,
- drag/drop works,
- tap fallback works,
- map remains usable,
- typography remains readable.

---

# 38. Desktop Validation

Explicitly test:

```text
1366x768
1440x900
1920x1080
```

The experience should not look like a stretched mobile screen.

Adapt the composition intelligently while preserving the same visual identity.

---

# 39. Design Tokens

Centralize styling primitives.

Example:

```css
--color-primary;
--color-secondary;
--color-success;
--color-warning;
--color-danger;

--radius-sm;
--radius-md;
--radius-lg;
--radius-pill;

--shadow-sm;
--shadow-md;

--spacing-xs;
--spacing-sm;
--spacing-md;
--spacing-lg;
--spacing-xl;
```

Avoid inconsistent ad-hoc spacing and visual values.

---

# 40. Do Not Over-Engineer

Do not build:

- authentication,
- accounts,
- multiplayer,
- leaderboards,
- cloud database,
- admin dashboard,
- CMS,
- WebSockets,
- microservices,
- procedural city generation,
- a physics engine,
- complex analytics,
- unnecessary server infrastructure.

This is an educational interactive prototype.

Prioritize:

```text
beautiful
functional
smooth
clear
responsive
demo-ready
```

---

# 41. Codex Skills and Tooling Strategy

Use skills intentionally. Do not activate every available skill merely because it exists.

At the beginning of a substantial session, inspect the available Codex skills. Use the **minimum set that materially improves the task**.

## Recommended Skill 1 — Graphify

Use `$graphify` when:
- the repository has grown beyond a trivial starter,
- architecture or dependencies are unclear,
- you need to understand how screens, state, assets and game logic connect,
- you are entering the repository in a fresh Codex session,
- a refactor spans several files.

For a brand-new or still tiny repository, do not waste time graphing it before basic implementation exists.

When Graphify is installed and useful:

```text
$graphify .
```

Then use its graph/report to orient yourself before broad repository exploration.

After meaningful structural changes, refresh it if needed rather than assuming an old graph is current.

Graphify is an aid to understanding the codebase, not a substitute for reading the relevant source files.

## Recommended Skill 2 — develop-web-game

If available, use `$develop-web-game` for the core implementation/iteration loop.

This project is a browser-based educational game, so the skill is directly relevant for:
- iterative implementation,
- browser-driven validation,
- gameplay state inspection,
- screenshot-based review,
- keeping a persistent `progress.md`.

Adapt the skill to this DOM/React-based game rather than forcing canvas architecture where it is unnecessary.

The product specification in this file remains authoritative.

## Recommended Skill 3 — playwright

Use `$playwright` for real-browser QA when available.

Use it especially for:
- complete user journeys,
- button/tap behavior,
- viewport testing,
- console errors,
- screenshots,
- drag/drop behavior,
- persistence after reload,
- regression checks.

Do not rely only on unit tests for interactive UI.

## Optional Skill — playwright-interactive

Use `$playwright-interactive` when installed and configured and when fast repeated visual debugging would materially improve the session.

Do not add environment complexity solely to use it if ordinary Playwright is enough.

## Optional Skill — security-best-practices

Use only for a deliberate security review or secure-by-default pass.

This prototype has no authentication or backend, so security work should remain proportionate to the scope.

## Skill priority for this project

A sensible order when multiple skills apply is:

```text
Graphify (only if codebase understanding is needed)
        ↓
develop-web-game
        ↓
Playwright / browser QA
        ↓
targeted optional review skills
```

Do not let a skill override the product requirements or introduce unnecessary complexity.

---

# 47. Human Setup Notes — One-Time Codex Configuration

**These are setup instructions for the developer. Do not automatically modify global user configuration unless explicitly asked.**

## Install Graphify globally for Codex

Graphify's package is currently named `graphifyy`, while its CLI command remains `graphify`.

Recommended installation with `uv`:

```bash
uv tool install graphifyy
graphify install --platform codex
```

Alternative with `pipx`:

```bash
pipx install graphifyy
graphify install --platform codex
```

The install is user-scoped by default. Do **not** add `--project` if the goal is to make Graphify available across Codex repositories/sessions.

Codex invokes the skill as:

```text
$graphify .
```

Graphify can also be installed using the generic cross-agent skill location:

```bash
graphify install --platform agents
```

Use the Codex-specific install when Codex is the primary target.

For project-only installation:

```bash
graphify install --platform codex --project
```

Only use that form when the skill should be committed or isolated to one repository.

### Graphify parallel extraction

If the installed Graphify version requests Codex multi-agent support, ensure the Codex user config contains:

```toml
[features]
multi_agent = true
```

in:

```text
~/.codex/config.toml
```

Do not overwrite existing configuration. Merge the setting carefully.

## Install useful curated Codex skills

Codex includes a skill installer.

Useful skills for this repository include:

```text
$skill-installer develop-web-game
$skill-installer playwright
```

Optionally:

```text
$skill-installer playwright-interactive
$skill-installer security-best-practices
```

After installing a new skill, restart/reload Codex if needed so the available-skill list refreshes.

## Global skills vs repository instructions

Use the right mechanism for the right kind of information:

### Global Codex skill
Use for reusable workflows that should follow the developer across repositories.

Examples:
- Graphify,
- browser testing,
- reusable review workflows.

### Repository `AGENTS.md`
Use for durable rules specific to Eco-Ciudad.

Examples:
- approved commands,
- architecture rules,
- product-specific constraints,
- verification expectations,
- asset locations,
- “do not add backend/authentication”,
- requirement to preserve mobile/touch support.

### `MASTER_PROMPT_ECO_CIUDAD_CODEX.md`
Use as the detailed product specification and quality bar.

### `progress.md`
Use for evolving implementation status and session handoff.

Do not overload `AGENTS.md` with the entire master prompt. Keep it concise and point Codex to this file.

A good repository-level `AGENTS.md` should tell Codex to:
- read this master prompt before major implementation work,
- inspect `/references`,
- read/update `progress.md`,
- run the established validation commands,
- preserve simple architecture,
- verify desktop and mobile behavior.

---

# 48. Recommended Repository Context Structure

Prefer a repository layout that makes context obvious:

```text
/
├─ AGENTS.md
├─ MASTER_PROMPT_ECO_CIUDAD_CODEX.md
├─ progress.md
├─ references/
│  ├─ 01-home.png
│  ├─ 02-city-map.png
│  ├─ 03-school-mission.png
│  ├─ 04-decision.png
│  ├─ 05-result.png
│  ├─ 06-recycling.png
│  ├─ 07-water.png
│  ├─ 08-achievements.png
│  └─ 09-final-city.png
└─ src/
```

Use descriptive filenames if the actual screens differ.

Each reference should have a clear relationship to an implementation screen.

Do not keep the only visual guidance buried inside a `.docx` once approved reference images can be exported separately.

---

# 49. Asset and Reference Intake Protocol

When new visual references are added:

1. Inspect them before coding.
2. Map each reference to a screen/component.
3. Identify which elements are:
   - actual assets,
   - composition guidance,
   - style guidance,
   - interaction guidance.
4. Reuse actual approved assets when they are suitable for production.
5. Do not reproduce text embedded inside an image when it should be accessible live HTML.
6. Avoid baking buttons or interactive labels into background images.
7. Keep character/background art separate from functional controls when possible.
8. Optimize large raster assets before shipping.

If an image does not fit desktop composition, adapt the layout while preserving its visual story.

---

# 50. Prompting and Iteration Protocol for Future Codex Sessions

When starting a fresh session, the developer should be able to use a short instruction such as:

```text
Read AGENTS.md, MASTER_PROMPT_ECO_CIUDAD_CODEX.md and progress.md.
Inspect the current implementation and relevant files in /references.
Continue from the next unresolved checkpoint.
Implement directly, run the app, test the affected flow in a browser, and update progress.md before stopping.
Do not add unrelated features.
```

For a visual polish session:

```text
Do not add new features.
Read the master prompt and inspect all approved visual references.
Run the app and perform a visual QA pass at 360x800, 390x844, 768x1024, 1366x768 and 1440x900.
Compare each major screen against its reference.
Fix spacing, typography, hierarchy, image crops, touch targets, responsiveness, motion, overflow and inconsistent styling.
Re-test the complete game flow before stopping.
```

For one specific screen:

```text
Read the product specification and compare the current <SCREEN> directly against <REFERENCE FILE>.
Preserve the reference's visual intention while adapting it properly for responsive web.
Fix the implementation rather than merely describing changes.
Verify mobile and desktop in a real browser before stopping.
```

For bug fixing:

```text
Reproduce the issue first.
Identify the actual cause.
Implement the smallest robust fix.
Test the original failure and adjacent interaction flow.
Do not refactor unrelated code.
```

Avoid vague follow-up instructions such as “make everything prettier” when specific visual feedback can be given.

---

# 51. Implementation Order

Before coding:

1. Inspect repository structure.
2. Inspect package configuration and dependencies.
3. Inspect all visual references/assets.
4. Identify what already works and preserve it.
5. Write a concise implementation plan.

Then implement approximately in this order:

## Phase 1 — Foundation
- global styles,
- design tokens,
- responsive `GameShell`,
- game state,
- navigation/state flow.

## Phase 2 — Landing + City Map

## Phase 3 — Mission + Decision Screens

## Phase 4 — Consequence Feedback + Scoring

## Phase 5 — Recycling Mini-game

## Phase 6 — Water Mission

## Phase 7 — Achievements

## Phase 8 — Final City + Dynamic Final Score

## Phase 9 — Responsive Polish

## Phase 10 — Testing, Performance, Cleanup

Do not stop after scaffolding.

Implement the complete playable flow.

---

# 47. Continuous Verification

After meaningful implementation steps, run the appropriate existing project commands.

If available:

```bash
npm run build
```

and:

```bash
npm run lint
```

Fix:

- TypeScript errors,
- import errors,
- lint failures,
- runtime errors,
- broken layouts.

Do not leave known build errors behind.

---

# 48. Complete Gameplay Test

Manually verify this full path:

```text
Open game
↓
Start game
↓
Open city map
↓
Select school
↓
Read mission
↓
Choose decision
↓
See consequence
↓
Return to city
↓
See visual improvement
↓
Play recycling mini-game
↓
Complete water mission
↓
Unlock badge
↓
Complete remaining zones
↓
See final score
↓
Explore completed city or restart
```

Every step must work.

---

# 49. Acceptance Criteria

The project is complete when the following are true.

## Functionality

- landing screen works,
- city map works,
- zones are interactive,
- mission flow works,
- decisions change game state,
- consequences are displayed,
- visible improvements appear in the city,
- recycling mini-game works,
- mouse works,
- touch works,
- tap fallback works,
- water mission works,
- achievements unlock,
- final score is calculated dynamically,
- progress persists,
- restart works.

## UX

- no confusing dead ends,
- clear next action on each screen,
- smooth transitions,
- visible progress,
- child-friendly language,
- consistent visual identity.

## Responsive

- mobile is fully usable,
- tablet is fully usable,
- desktop looks intentionally designed.

## Performance

- fast initial render,
- no unnecessarily heavy dependencies,
- no noticeably laggy interactions.

## Code

- TypeScript is clean,
- components are reasonably reusable,
- mission content is data-driven,
- architecture is simple,
- duplicated logic is minimized,
- no unnecessary abstractions.

---

# 50. Final Polish Pass

Once the product works, perform a dedicated polish pass.

Inspect every major screen at:

```text
360px
390px
768px
1024px
1440px
```

Fix:

- spacing,
- clipping,
- text wrapping,
- image scaling,
- target sizes,
- card consistency,
- visual hierarchy,
- desktop composition,
- mobile ergonomics.

Then perform a performance/cleanup pass.

Remove:

- unused dependencies,
- dead code,
- unused assets,
- console logs,
- temporary debugging UI.

---

# 51. README

Update the repository README with:

# Eco-Ciudad

Include concise sections for:

- project description,
- setup,
- development,
- build,
- project structure,
- game flow,
- mission data structure,
- how to add a mission,
- where to replace visual assets.

Keep documentation concise and practical.

---

# 52. Quality Bar

Do not simply imitate prototype screenshots pixel-for-pixel.

Transform the prototype into a coherent real web product.

Prioritize:

```text
clarity
playfulness
responsiveness
performance
consistency
learning through interaction
```

When choosing between:

```text
more features
```

and:

```text
better polish
```

choose **better polish**.

When choosing between:

```text
complex architecture
```

and:

```text
simple maintainable code
```

choose **simple maintainable code**.

The final result should feel like a small but complete educational game that could genuinely be used by a child on a phone, tablet, or computer.

---

# 53. Final Working Instruction

Do not finish with only a plan, TODO list, or partial scaffold.

Work directly on the repository and continue iterating until the primary experience is playable end-to-end.

If something is ambiguous:

1. infer the simplest solution consistent with the approved references and product goals,
2. document the assumption briefly,
3. implement it,
4. keep moving.

Do not overbuild speculative features.

Focus on the approved game experience and make it feel excellent.
