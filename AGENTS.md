## BigBadMeals agent entrypoint

This repo adopts **BigBadCodingStandards** (vendored under `docs/coding-standards/`).

- **Standards (all agents, including Claude):** `docs/coding-standards/AGENTS.md`
- **Lifecycle:** `docs/coding-standards/standards/PLAYBOOK.md`
- **Index:** `docs/coding-standards/standards/INDEX.md`
- **PRs → ship:** `docs/coding-standards/standards/DELIVERY.md`

---

## GitHub PR automation (this repository)

Use this when you push work and need a PR, CI, merge, or status without guessing URLs.

### Prerequisites (human / org settings)

- **Pull requests:** [Allow auto-merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge) enabled on the repo.
- **Actions → General → Workflow permissions:** `GITHUB_TOKEN` has **Read and write** (needed for auto-merge + PR comments).
- **Branch rules / rulesets:** `main` protected as you intend; required check names must match CI job names exactly (`build`, `e2e` from `.github/workflows/ci.yml`).

### Scripts (local)

| Command | Purpose |
| --- | --- |
| `npm run pr:publish` | Push current branch to `origin`, open a PR to `main` if none exists, print URL + copy-paste status commands. |
| `npm run pr:status -- <n>` | One-shot JSON: `state`, `mergedAt`, `statusCheckRollup`, `autoMergeRequest`, etc. |

Shell equivalents: `bash scripts/pr-publish.sh`, `bash scripts/pr-status.sh <n>`.

Optional env for `pr-publish`: `PR_BASE` (default `main`), `PR_REMOTE` (default `origin`), `PR_TITLE` / `PR_BODY` if `gh pr create --fill` is not suitable.

### Workflows on GitHub

| Workflow | Role |
| --- | --- |
| **CI** | `build` then `e2e` (Playwright smoke); gates merge. |
| **Enable PR auto-merge** | For PRs into `main` whose **author** is `bigbadmn-sys`, enables **squash** auto-merge and deletes the head branch after merge. Filter uses `github.event.pull_request.user.login`, not `github.actor`. |
| **PR CI notify** | After **CI** completes for a PR, posts a **PR comment** with conclusion, Actions run link, and the same `pr-status.sh` / `gh` commands—useful as a durable “CI finished” signal. |

### How an agent gets “notified” (no webhook into the IDE)

Git and GitHub do not push into Cursor or Claude. The contract is:

1. **Immediate:** output of `pr:publish` (URL + suggested `gh` / `pr-status.sh` lines).
2. **After CI:** optional **PR comment** from **PR CI notify** (when it runs; see caveat below).
3. **Any time:** poll `npm run pr:status -- <n>` or `gh pr view <n> --json state,mergedAt,statusCheckRollup,autoMergeRequest,url`.

### Caveat: fast auto-merge vs PR comment

If **CI** finishes and **squash auto-merge** completes in the same window, **PR CI notify** may skip posting because it originally targeted **open** PRs only (merge can win the race). Treat **`pr:status`** / **`gh pr view`** as the source of truth; the comment is a convenience when it appears.

### Extending the allowlist

To auto-enable merge for more PR authors, edit the JSON array in `.github/workflows/enable-automerge.yml` (`contains(fromJson('[...]'), github.event.pull_request.user.login)`).
