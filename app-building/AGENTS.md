# prototype-building

Rules for an agent working in this folder. The repo-root `AGENTS.md` still governs git. This file governs only the prototype.

## Rules

- Work only inside `app-building/`. Do not edit milestone reports, the root README, or the root `AGENTS.md`.
- Tasks live in `tasks.md`, under Unclaimed, Claimed, and Done. Claim one task by moving it to Claimed before you edit code. Move it to Done only when it works in the browser. Do not take a task that is already Claimed.
- Follow `DESIGN.md` for color, type, and layout. Copy the `idea-b-workspace9` frames, not the earlier wireframes or the storyboard.
- Do not add a database, Auth0, a password, an API key, or a model call inside `server.js`.
- Do not commit `master.local.json` or `agent/log.md`. The gitignore rules are in `tasks.md`.
- The reply agent and the building agent are different jobs. `agent/PROMPT.md` is only a stub until the chat task. Do not sit and answer student questions while building.
