## BigBadMeals agent entrypoint

This repo adopts **BigBadCodingStandards** (vendored under `docs/coding-standards/`).

- **Standards (all agents, including Claude):** `docs/coding-standards/AGENTS.md`
- **Lifecycle:** `docs/coding-standards/standards/PLAYBOOK.md`
- **Index:** `docs/coding-standards/standards/INDEX.md`
- **PRs → ship:** `docs/coding-standards/standards/DELIVERY.md`

---

## GitHub PR automation (this repository)

### Mandatory procedure for coding agents (Cursor / Claude)

When you **create or update a PR** for this repo, do all of the following in order—do not stop after only pushing:

1. **Push + open/update the PR** on GitHub (never leave work only local when a PR is the goal).
2. **Wait for the GitHub outcome** (CI + merge): run `npm run pr:publish:wait` from the PR branch after your commits, **or** run `npm run pr:publish` and then poll yourself with `npm run pr:status -- <n>` / `gh pr checks <n>` until the PR is **merged**, **checks fail**, **closed without merge**, or you hit a timeout (then report and ask how to proceed).
3. **Act on the terminal result without waiting for the user to ask:**
   - **`PR_WAIT_RESULT=merged`** (script exit `0`): `git fetch origin main && git checkout main && git pull origin main`, then continue the task on an updated `main` (e.g. new work, delete stale local branch if appropriate).
   - **`checks_failed`** (exit `1`): open the linked Actions job logs from `gh pr checks`, fix, commit, re-run `npm run pr:publish:wait`.
   - **`timeout`** (exit `2`): print last `pr-status` output and state what is still running; ask whether to keep waiting or investigate.
   - **`closed_without_merge`**: report and wait for human direction.

Use a long enough tool wait when running `pr:publish:wait` in automation (this repo’s CI is often a few minutes).

Use this when you push work and need a PR, CI, merge, or status without guessing URLs.

### Prerequisites (human / org settings)

- **Pull requests:** [Allow auto-merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge) enabled on the repo.
- **Actions → General → Workflow permissions:** `GITHUB_TOKEN` has **Read and write** (needed for auto-merge + PR comments).
- **Branch rules / rulesets:** `main` protected as you intend; required check names must match CI job names exactly (`build`, `e2e` from `.github/workflows/ci.yml`).

### Scripts (local)

| Command | Purpose |
| --- | --- |
| `npm run pr:publish` | Push current branch to `origin`, open a PR to `main` if none exists, print URL + copy-paste status commands. |
| `npm run pr:publish:wait` | Same as `pr:publish`, then **poll GitHub** until merged, checks fail, closed without merge, or timeout; prints `PR_WAIT_RESULT=…` and **recommended next git commands** on success. |
| `npm run pr:status -- <n>` | One-shot JSON: `state`, `mergedAt`, `statusCheckRollup`, `autoMergeRequest`, etc. |

Shell equivalents: `bash scripts/pr-publish.sh`, `bash scripts/pr-publish.sh --wait`, `bash scripts/pr-status.sh <n>`.

Optional env for `pr-publish`: `PR_BASE` (default `main`), `PR_REMOTE` (default `origin`), `PR_TITLE` / `PR_BODY` if `gh pr create --fill` is not suitable. **`PR_WAIT_TIMEOUT_SEC`** (default `900`) caps `--wait` duration.

`pr-publish.sh --wait` exit codes: **`0`** merged, **`1`** failed checks or closed without merge, **`2`** timeout.

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

### Cursor IDE: fewer approval prompts (this workspace)

Broad autonomy is controlled by **Cursor**, not by this repo alone.

1. **Cursor Settings → Agents → Auto-Run → Auto-run mode:** set **Run Everything** so tools (terminal, edits, MCP per your other toggles) run without per-step approval. **Run in Sandbox** still auto-runs many commands but may escalate for “full system” operations—approvals then mean **full permissions outside the sandbox** ([Terminal / Sandbox docs](https://cursor.com/docs/agent/tools/terminal)).
2. **Same page → Auto-run network access:** choose **Allow All** if you want outbound network in the sandbox without tuning domain lists (matches the intent of this repo’s `.cursor/sandbox.json`).
3. **Protection settings** on that screen: relaxing **Dotfile Protection** / **External-File Protection** / **File-Deletion Protection** reduces prompts for `.env*`, files outside the workspace, or deletes—**only do this if you accept the risk** on this machine.
4. **This repo:** `.cursor/sandbox.json` sets **`networkPolicy.default: "allow"`** and **`enableSharedBuildCache: true`** so sandboxed installs/builds hit registries freely and share caches. To remove the sandbox entirely (maximum risk), Cursor supports `"type": "insecure_none"` in `sandbox.json`—see [sandbox.json reference](https://cursor.com/docs/reference/sandbox); enterprise policies may still override.

Commit `.cursor/sandbox.json` when you are happy with it, or delete it and rely on UI-only settings.
