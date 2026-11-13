# prototype-building

This folder is the prototype build. The milestone report stays in `milestones/m2-ideation-lowfi/`. The page, the local server, and the reply-agent prompt all live here.

The screens are not built yet. `index.html`, `styles.css`, and `app.js` are empty entry points. Later tasks in `tasks.md` fill them in.

## Run the page

From this folder, start the local server:

```
node server.js
```

Then open the address it prints. `server.js` is a stub until the chat task adds the log routes.

## Reply agent

Start one terminal agent in this repo and leave it running on `agent/PROMPT.md`. The page does not start that agent. `PROMPT.md` is a stub until the chat task.

## Master login

The master email lives in `master.local.json` on this machine. Do not commit that file. Signing in with that email opens the seeded workspace. Any other email starts at profile setup. Both of those screens are later tasks.

## Folder map

```
app-building/
  README.md
  AGENTS.md
  tasks.md
  DESIGN.md
  index.html
  styles.css
  app.js
  server.js
  data/lectures.js
  agent/PROMPT.md
  agent/log.md
  master.local.json
```

`data/lectures.js` will hold the two known lectures, their notes, topics, and graph links. `agent/log.md` holds questions and replies. Both the log and `master.local.json` are gitignored.

## Out of scope

No database, no password, no API key, no PDF parsing, and no force-directed graph.
