# AGENTS.md — Eco-Ciudad

## Project source of truth

Before substantial implementation work:

1. Read `MASTER_PROMPT_ECO_CIUDAD_CODEX_V2.md`.
2. Read `progress.md`.
3. Inspect the relevant images in `references/`.
4. Inspect the current implementation in a real browser before deciding to rebuild a screen.

The master prompt defines the product vision, scope, UX, architecture preferences, quality bar, and acceptance criteria.

## Working principles

- Implement directly; do not stop at planning unless explicitly asked.
- Preserve working code and the existing stack when reasonable.
- Prefer simple, maintainable architecture over abstractions that are unnecessary for this prototype.
- Do not add backend, authentication, accounts, multiplayer, leaderboards, CMS, WebSockets, or other unrelated infrastructure.
- Prioritize polish over adding more features.
- Keep missions and game content data-driven where practical.
- Keep the experience lightweight and performant on ordinary phones.

## Visual references

The files under `references/` are approved visual references.

For every major screen:
- inspect the corresponding reference,
- preserve its visual intention,
- adapt it properly to responsive web,
- do not embed the screenshot as the UI,
- keep interactive text and controls as real HTML,
- avoid turning the design into a SaaS/dashboard interface.

## Responsive and input requirements

The app must work with:
- desktop mouse,
- keyboard,
- phone/tablet touch.

Test at minimum:
- 360x800
- 390x844
- 768x1024
- 1366x768
- 1440x900

Avoid horizontal overflow, clipped dialogs, tiny touch targets, and hover-only interactions.

For drag/drop, support Pointer Events and provide a tap/keyboard-accessible fallback.

## Validation

Use the repository's existing scripts. Typical checks are:

```bash
npm run build
npm run lint
```

Run the application and inspect the affected user flow in a real browser after meaningful UI work.

Do not leave:
- TypeScript errors,
- avoidable console errors,
- broken imports,
- known dead ends in the game flow.

## Scope order

Work in these checkpoints unless the user requests another order:

1. Foundation + Landing + City Map
2. Mission + Decision + Consequence
3. Mini-games + remaining zones
4. Achievements + final city + persistence
5. Responsive/visual/performance polish

Do not expand scope while earlier checkpoints remain visibly weak.

## Progress handoff

Read `progress.md` at the beginning of a session and update it before finishing a substantial session.

Keep it concise. Record:
- completed work,
- current checkpoint,
- important implementation decisions,
- known issues,
- next tasks,
- validation performed.

Do not use it as a verbose diary.

## Optional skills/tools

When available and useful:
- use Graphify to orient yourself in a non-trivial codebase,
- use browser/Playwright tooling for real UI verification,
- use a web-game development workflow if the Codex environment provides one.

Skills are helpers. They do not override this file or the master prompt.
