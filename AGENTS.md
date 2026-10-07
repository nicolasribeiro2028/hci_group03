# AGENTS.md

Instructions for Claude (and any other AI agent) contributing to this repo. The repo is shared by a team of five, so the goal is to keep `main` clean and avoid stepping on each other's work.

## 1. Before you start

1. Run `git pull` (or `git fetch` and check `git log origin/main`) to get the latest version.
2. Review what already exists and what changed recently: `git log --stat -10`, `git status`, and the relevant folder (e.g. `milestones/m1-need-finding/`).
3. Read the milestone's `README.md` to see the deliverables and who owns each section.
4. Read [FORMATTING_GUIDELINE.md](FORMATTING_GUIDELINE.md) before writing or editing any Markdown.
5. Do not duplicate material. If a file, template or section already exists, extend it instead of creating a parallel one.

## 2. Where things go

| Folder | Contents |
|---|---|
| `milestones/m1-need-finding/` ... `m4-hifi-prototype/` | Reports, templates and deliverables per milestone |
| `milestones/m1-need-finding/interviews/` | Interview scripts, summaries and notes |
| `meeting-notes/` | Dated team meeting notes |
| `notes/` | General research and idea notes |
| `assets/` | Shared images, exported figures, prototype media |

- Follow the milestone's existing file names and structure. Do not create new top-level folders without asking.
- Exported PDFs are prefixed `g3-`.
- Use participant codes or roles in documents, never full names.

## 3. Scope of changes

- Only edit the files for the section you were asked to work on. Other people own other sections.
- Do not rename, move or delete other people's files unless explicitly asked.
- Do not rewrite or "clean up" content you were not asked to change.
- Never fabricate data, quotes or interviews. Everything must trace back to the interview material in the repo.

## 4. Finishing work: branch and pull request

Never commit directly to `main`. Once the material is finished:

1. Make sure you are up to date: `git fetch origin` and rebase or merge `origin/main` into your branch if needed.
2. Create a branch named `<area>/<short-description>`, e.g. `m1/personas`, `m1/interview-02-notes`, `docs/formatting-guideline`.
3. Stage only the files that belong to this change (no `git add -A` if unrelated files are modified).
4. Commit with a short, descriptive message.
5. Push the branch: `git push -u origin <branch>`.
6. Open a pull request into `main` with `gh pr create`. The description should say:
   - what was added or changed and in which files,
   - which milestone section it covers,
   - anything that needs a teammate's review or decision.
7. Keep PRs small and focused: one section or one topic per PR, so changes stay easy to review and the repo does not get cluttered.
8. Do not merge your own PR unless the user asks. Report the PR link when done.

Commit messages and PR descriptions follow the attribution lines given in the session.

## 5. Check before you ask for review

- [ ] Latest `main` pulled and existing content reviewed
- [ ] Formatting guideline followed, PDF page limits checked
- [ ] Only the intended files changed (`git status` and `git diff --stat`)
- [ ] No participant names, secrets or large binaries committed by accident
- [ ] Branch pushed and PR opened, not a direct push to `main`

## 6. When unsure

Ask the user rather than guessing, especially about ownership of a section, file placement, or anything that would overwrite a teammate's work.
