# DR-ENGINEERING-001 — Main Branch Protection

**Status:** ACTIVE — STAGE 2 ENFORCED  
**Decision owner:** Engineering / integration  
**Repository:** `JorisMB82/japanese-maple-atlas`  
**Protected target:** `main`  
**Decision date:** 2026-07-27  
**Stage 1 implementation date:** 2026-07-27  
**Stage 2 implementation date:** 2026-07-28  
**Final operational validation:** 2026-07-29  
**Current inspected `main`:** `bbb0bcd9811a93eea731cbebbc2298b68db70491`

## 1. Context

`main` is the production source of truth and deploys the public Japanese Maple Atlas. The repository uses short-lived track branches, pull requests, the repository-quality workflow and squash merges.

Branch protection was introduced in two stages so destructive-operation controls could be activated immediately without stranding the active Wave 1 cycle, followed by pull-request and CI enforcement at a stable checkpoint.

## 2. Decision

Use one active GitHub branch ruleset targeting the exact branch name `main`.

The ruleset retains its original name, `Protect main — Stage 1`, for administration continuity, but it now contains the complete Stage 2 rule set.

No independent human approval is required initially because the repository has one Project Owner. Required CI and resolved review conversations provide the normal merge controls. Repository-administrator bypass remains available only for emergency recovery.

## 3. Live Stage 2 configuration

| Setting | Live value |
| --- | --- |
| Ruleset name | `Protect main — Stage 1` |
| Enforcement status | Active |
| Target branch | exact branch `main` |
| Bypass | repository administrators / authorised owner — always allow for emergency recovery |
| Require a pull request before merging | On |
| Required approving reviews | 0 |
| Dismiss stale approvals | Off |
| Require Code Owner review | Off |
| Require approval of most recent push | Off |
| Require status checks before merging | On |
| Require branches to be up to date | Off initially |
| Require conversation resolution | On |
| Restrict deletions | On |
| Block force pushes | On |
| Restrict creations | Off |
| Restrict updates | Off |
| Require linear history | Off |
| Require deployments | Off |
| Require signed commits | Off |
| Merge queue | Off |

### Required checks

The exact required check names were verified from successful GitHub Actions runs before activation:

- `Repository, schemas and tests`
- `Native Node coverage thresholds`
- `Production build and static regression`

These names remain current after the Catalogue MVP. The internal command chain expanded to include Catalogue validation and compilation without changing the required job names.

## 4. Stage 1 implementation evidence

The Project Owner created the active ruleset in GitHub administration and supplied UI evidence showing:

- exact target `main`;
- active enforcement;
- administrator bypass;
- `Restrict deletions` enabled;
- `Block force pushes` enabled;
- PR/status/conversation requirements initially disabled.

After Stage 1 activation:

- ordinary branch creation and updates succeeded;
- PR #14 remained open and mergeable;
- documentation PR #20 passed the normal workflow and squash-merged;
- no GitHub-plan limitation was encountered.

No destructive force-push or deletion attempt was made against production `main`; the active ruleset configuration is the enforcement evidence.

## 5. Stage 2 trigger and activation

The Stage 2 checkpoint was reached after:

- the active Wave 1 editorial, media and engineering PR cycle was merged or deliberately closed;
- the governed photograph pipeline remained stable on `main`;
- the three exact check names were verified from successful workflows;
- no active PR would be stranded;
- no major `integration/rc-006-010` publication merge had begun.

The Project Owner then supplied GitHub UI evidence showing the Stage 2 controls selected:

- pull request required;
- zero approvals;
- conversation resolution required;
- all three exact checks required;
- branch-up-to-date requirement disabled;
- deletion restriction and force-push block retained;
- administrator bypass retained.

## 6. Operational validation

### Normal protected merge path

The Stage 2 path has been exercised repeatedly without administrator bypass:

| PR | Purpose | Required checks | Conversations | Merge method | Result |
| --- | --- | --- | --- | --- | --- |
| #24 | Record Wave 1 G4 owner acceptance | PASS | none unresolved | squash | PASS |
| #25 | Two-speed strategy and contracts | PASS | none unresolved | squash | PASS |
| #26 | Owner ratification and governing roadmap | PASS | none unresolved | squash | PASS |
| #30 | Complete Catalogue MVP | PASS | none unresolved | squash | PASS |
| #28 | Editorial slots 011–025 proposal | PASS | none unresolved | squash | PASS |
| #29 | Visual coverage 001–025 plan | PASS | none unresolved | squash | PASS |

PR #30 provides the strongest validation because its development cycle included failing intermediate workflow runs. It was not advanced to final merge until the unit, coverage and static-regression defects were corrected and the final head passed all three required jobs. The final successful workflow was `30410275313`.

### Branch and workflow behaviour

- normal engineering, editorial and media branches can be created and updated;
- protected checks run on pull requests to `main`;
- a conversation-clean, fully passing PR can be squash-merged;
- the required check names remained stable while their internal command chain evolved;
- no active PR was stranded when Stage 2 was enabled;
- administrator bypass was not used for the validated merges.

### Non-destructive test boundary

A direct push, force push or deletion attempt against production `main` was not intentionally performed. The live ruleset configuration is the evidence for those prohibitions. Avoiding a destructive production test is an explicit safety choice, not a claim that such an operation was attempted.

## 7. Bypass and emergency recovery

Administrator bypass is retained for genuine recovery only. It must not become the normal merge route.

Emergency procedure:

1. identify and record the production incident;
2. preserve the affected SHA and deployment evidence;
3. prefer a corrective PR from the last known-good commit;
4. use administrator bypass only when the protected PR path cannot restore service safely;
5. rerun repository validation and deployment checks immediately after recovery;
6. record the bypass reason, actor, affected commits and follow-up review in this Decision Record or a linked incident record.

## 8. Tightening criteria

Revisit this decision when:

- a second regular maintainer is added and independent approval can be required without deadlock;
- branch-up-to-date enforcement or a merge queue becomes useful;
- signed commits or deployment gates become operational requirements;
- administrator bypass is used;
- required job names change;
- a protection bypass, deletion attempt or force-push incident occurs;
- a malicious or accidental direct-update path is discovered;
- the current zero-approval policy no longer matches repository governance.

Potential future tightening:

- one independent approval;
- Code Owner review for sensitive paths;
- branch-up-to-date enforcement;
- deployment or environment approval;
- signed commits;
- merge queue;
- reduced bypass scope.

## 9. Review history

- 2026-07-27 — Stage 1 ruleset activated: deletion and force-push protection.
- 2026-07-28 — Stage 2 settings configured: PR, checks and conversation resolution required.
- 2026-07-29 — Catalogue MVP and both stream planning packages completed the protected squash-merge path.
- 2026-07-29 — Decision Record updated to reflect the live Stage 2 configuration and operational evidence.

## 10. Assessment

- **Stage 1 destructive-operation protection:** PASS — active configuration blocks deletion and force pushes for non-bypass actors.
- **Stage 2 normal PR/CI/conversation workflow:** PASS — repeatedly validated through passing squash merges without bypass.
- **Administrator emergency recovery:** PASS — retained in the ruleset.
- **Independent human approval:** intentionally 0; reconsider when another regular maintainer exists.
- **Direct destructive test:** NOT PERFORMED for production safety; live ruleset configuration is the enforcement evidence.
- **Overall:** PASS.
