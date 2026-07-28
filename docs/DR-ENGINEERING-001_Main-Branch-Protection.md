# DR-ENGINEERING-001 — Main Branch Protection

**Status:** CONDITIONAL — configuration specified; Stage 1 enforcement pending an administration-capable GitHub mutation surface  
**Decision owner:** Engineering / integration  
**Repository:** `JorisMB82/japanese-maple-atlas`  
**Protected target:** `main`  
**Decision date:** 2026-07-27  
**Inspected main:** `56169aa9fe3e21231f1a680bb6f97d4230192780`

## 1. Context

`main` is the production source of truth and deploys the public Japanese Maple Atlas. The repository uses short-lived track branches, pull requests, the repository-quality workflow and squash merges. Accidental force pushes or deletion of `main` would bypass the governed history and could disrupt production.

Protection must be staged so that the current Sprint 12 / Wave 1 editorial and media cycle is not stranded while stronger merge requirements are introduced.

## 2. Decision

Use a branch protection rule targeting the exact branch name `main`.

Stage 1 establishes only destructive-operation protection. Stage 2 adds the normal PR and CI merge controls after the active Wave 1 PR cycle reaches a stable checkpoint and before the first major `integration/rc-006-010` publication merge.

The repository remains configured to permit squash merges. No independent human approval is required initially because the repository has a single project owner; review conversations and required CI provide the initial merge controls.

## 3. Stage 1 — minimum safe protection

### Intended exact configuration

| Setting | Stage 1 value |
| --- | --- |
| Branch name pattern | `main` |
| Require a pull request before merging | Off |
| Require status checks before merging | Off |
| Require conversation resolution | Off |
| Allow force pushes | Off |
| Allow deletions | Off |
| Lock branch | Off |
| Restrict who can push | Off |
| Do not allow bypassing | Off |
| Administrator / authorised-owner recovery | Available through the default administrator bypass |

This configuration blocks force pushes and branch deletion without changing the current PR, CI or squash-merge path.

### Stage 1 implementation record

- **Repository access verified:** the connected GitHub identity has repository administrator permission.
- **Repository visibility:** public.
- **Plan availability:** GitHub supports protected branches and repository rulesets for public repositories on GitHub Free; no plan limitation has been identified for this rule.
- **Active PR inspected:** PR `#14`, `media/rc-006-010` into `main`, remains an open draft.
- **Tooling limitation:** the connected GitHub tool exposes repository, branch, PR and content operations but does not expose branch-protection or repository-ruleset create/update endpoints. The local environment has no authenticated GitHub CLI or token. Therefore enforcement cannot be truthfully recorded as active from this execution surface.
- **Stage 1 assessment:** `BLOCKED` until the rule is created through GitHub repository administration or an administration-capable API connection.

Do not mark Stage 1 complete until the live rule is inspected and both `allow_force_pushes` and `allow_deletions` are confirmed false.

## 4. Stage 2 trigger

Stage 2 may be enabled when all of the following are true:

1. the current Wave 1 editorial, media and engineering PR cycle is merged or deliberately closed;
2. the governed photograph pipeline remains stable on `main`;
3. the latest repository-quality workflow on the relevant PR and `main` is successful;
4. no active PR would be stranded by newly required checks;
5. the exact successful check names have been observed from GitHub Actions;
6. no major `integration/rc-006-010` publication merge has begun.

## 5. Stage 2 — protected merge path

Before activation, inspect current `main`, all open PRs and active track branches. Verify the exact check names from successful workflow runs.

Expected configuration, subject to that verification:

| Setting | Stage 2 value |
| --- | --- |
| Require a pull request before merging | On |
| Required approving reviews | 0 initially |
| Dismiss stale approvals | Off initially |
| Require review from Code Owners | Off initially |
| Require status checks before merging | On |
| Require branches to be up to date | Off initially unless validation proves it will not strand active PRs |
| Require conversation resolution | On |
| Allow force pushes | Off |
| Allow deletions | Off |
| Administrator / authorised-owner bypass | Available for emergency recovery |
| Merge method | Squash merge remains permitted |
| Merge queue, signed commits, linear history and deployment requirements | Off unless separately approved |

Expected required checks must not be configured until their exact current names are verified. The present candidates are:

- `Repository, schemas and tests`
- `Native Node coverage thresholds`
- `Production build and static regression`

## 6. Stage 2 validation

Use a harmless branch based on current `main` and remove it after testing. Record evidence that:

1. direct unreviewed changes to `main` are blocked;
2. a PR with incomplete or failing required checks cannot merge;
3. a PR with all required checks passing and conversations resolved can be squash-merged through the authorised workflow;
4. force pushes and deletion of `main` are blocked;
5. emergency administrator recovery remains available;
6. no temporary branch or workflow remains.

Do not use an active editorial or media branch as the destructive test subject.

## 7. Bypass and emergency recovery

Administrator bypass is retained initially for genuine recovery only. It must not become the normal merge route.

Emergency procedure:

1. identify and record the production incident;
2. preserve the affected SHA and deployment evidence;
3. prefer a corrective PR from the last known-good commit;
4. use administrator bypass only when the protected PR path cannot restore service safely;
5. rerun repository validation and deployment checks immediately after recovery;
6. document the bypass reason, actor, commits and follow-up review in this Decision Record or a linked incident record.

## 8. Review and tightening criteria

Revisit this decision when:

- a second regular maintainer is added;
- independent approval can be required without deadlock;
- merge queue adoption becomes useful;
- signed commits or deployment gates become operational requirements;
- administrator bypass is used;
- required check names or workflow structure change;
- a branch-protection bypass, deletion attempt or force-push incident occurs.

## 9. Current assessment

**Stage 1:** `BLOCKED` — configuration is fully specified, but live enforcement could not be applied through the available connector.  
**Stage 2:** `PLANNED / CONDITION-WATCHED` — activate only at the defined stable checkpoint.  
**Overall:** `CONDITIONAL`.
