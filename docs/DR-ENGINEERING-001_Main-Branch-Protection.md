# DR-ENGINEERING-001 — Main Branch Protection

**Status:** ACTIVE — Stage 1 enforced; Stage 2 planned for the next stable checkpoint  
**Decision owner:** Engineering / integration  
**Repository:** `JorisMB82/japanese-maple-atlas`  
**Protected target:** `main`  
**Decision date:** 2026-07-27  
**Stage 1 implementation date:** 2026-07-27  
**Inspected main:** `1af3d20c574e851ce55d01f9639caa8fda3a8e54`

## 1. Context

`main` is the production source of truth and deploys the public Japanese Maple Atlas. The repository uses short-lived track branches, pull requests, the repository-quality workflow and squash merges. Accidental force pushes or deletion of `main` would bypass the governed history and could disrupt production.

Protection is staged so that the current Sprint 12 / Wave 1 editorial and media cycle is not stranded while stronger merge requirements are introduced.

## 2. Decision

Use a GitHub branch ruleset targeting the exact branch name `main`.

Stage 1 establishes only destructive-operation protection. Stage 2 adds the normal PR and CI merge controls after the active Wave 1 PR cycle reaches a stable checkpoint and before the first major `integration/rc-006-010` publication merge.

The repository remains configured to permit squash merges. No independent human approval is required initially because the repository has a single project owner; resolved review conversations and required CI will provide the initial Stage 2 merge controls.

## 3. Stage 1 — minimum safe protection

### Live configuration

| Setting | Stage 1 value |
| --- | --- |
| Ruleset name | `Protect main — Stage 1` |
| Enforcement status | `Active` |
| Target branch | exact branch `main` |
| Bypass | repository administrators / authorised owner, retained for emergency recovery |
| Require a pull request before merging | Off |
| Require status checks before merging | Off |
| Require conversation resolution | Off |
| Restrict creations | Off |
| Restrict updates | Off |
| Restrict deletions | On |
| Block force pushes | On |
| Require linear history | Off |
| Require deployments | Off |
| Require signed commits | Off |
| Code-scanning, code-quality and coverage rules | Off |

This configuration blocks force pushes and branch deletion for non-bypass actors without changing the current branch, PR, CI or squash-merge path. Repository administrators retain an emergency bypass; the bypass is not the normal development route.

### Stage 1 implementation and validation record

- **Repository access verified:** the connected GitHub identity has repository administrator permission.
- **Repository visibility:** public.
- **Plan availability:** no GitHub-plan limitation was encountered for the active ruleset.
- **Administration evidence:** the Project Owner created the ruleset in GitHub repository administration and supplied UI evidence showing `Protect main — Stage 1`, enforcement status `Active`, and confirmation `Ruleset created`.
- **Rule-selection evidence:** the supplied configuration showed `Restrict deletions` and `Block force pushes` enabled, with PR, status-check and conversation requirements left disabled.
- **Target and bypass:** the Project Owner configured the exact target `main` and retained repository-administrator bypass for emergency recovery.
- **Current main:** `1af3d20c574e851ce55d01f9639caa8fda3a8e54` at the implementation checkpoint.
- **Active PR inspected:** PR `#14`, `media/rc-006-010` into `main`, remained open, draft and mergeable after activation.
- **Normal branch creation:** `engineering/main-protection-stage1-record` was created from current `main` after activation, confirming ordinary non-target branch creation remains available.
- **Normal branch update:** this Decision Record was committed to that branch after activation, confirming ordinary branch updates remain available.
- **Direct destructive tests:** no force-push or deletion attempt was made against production `main`; the active ruleset configuration is the enforcement evidence.
- **Stage 1 assessment:** `PASS`.

## 4. Stage 2 trigger

Stage 2 may be enabled when all of the following are true:

1. the current Wave 1 editorial, media and engineering PR cycle is merged or deliberately closed;
2. the governed photograph pipeline remains stable on `main`;
3. the latest repository-quality workflow on the relevant PR and `main` is successful;
4. no active PR would be stranded by newly required checks;
5. the exact successful check names have been observed from GitHub Actions;
6. no major `integration/rc-006-010` publication merge has begun.

At the Stage 1 implementation checkpoint, PR `#14` remained active. Stage 2 therefore remains deferred and must not yet be enabled.

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
| Restrict deletions | On |
| Block force pushes | On |
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
4. force pushes and deletion of `main` remain blocked;
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

- the Stage 2 trigger conditions are satisfied;
- a second regular maintainer is added;
- independent approval can be required without deadlock;
- merge queue adoption becomes useful;
- signed commits or deployment gates become operational requirements;
- administrator bypass is used;
- required check names or workflow structure change;
- a branch-protection bypass, deletion attempt or force-push incident occurs.

## 9. Current assessment

**Stage 1:** `PASS` — active ruleset blocks force pushes and deletion while preserving administrator emergency recovery and the current branch/PR workflow.  
**Stage 2:** `PLANNED / DEFERRED` — activate only at the defined stable checkpoint; PR `#14` remains active at this record update.  
**Overall:** `PASS FOR STAGE 1`.
