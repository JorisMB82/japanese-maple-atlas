# EDITORIAL-001 — Editorial Workflow and Contributor Pipeline

**Version:** 1.0  
**Status:** Sprint 7 implementation  
**Release date:** 2026-07-25

## Purpose

This specification implements the governed editorial lifecycle as repository-native, machine-readable objects. It separates contributor inputs from generated repository outputs and prevents publication from bypassing review.

## Input layer

`editorial-inbox/` contains contributor and submission inputs. These files are source controlled, hash protected and validated before compilation.

Contributor inputs identify the actor or governed project role, its authority scope and status. Submission inputs identify the target, contribution type, evidence attestations, workflow state and review results.

## Generated objects

Sprint 7 adds four first-class object types:

- contributors;
- submissions;
- editorial workflows;
- editorial review passes.

The compiler emits stable IDs, generated-from provenance, input hashes and cross-references for each object.

## Twelve-stage lifecycle

1. Evidence Collection
2. Evidence Evaluation
3. Assertion Extraction
4. Assertion Matrix
5. Approved Assertion Register
6. Unresolved Register
7. Rejected Register
8. Editorial Synthesis
9. Five-Pass Review
10. Corrected Reference Standard
11. Editorial Verification
12. Freeze

A workflow may be draft, active, blocked, approved, frozen, revised, superseded or deprecated. Frozen workflows require every stage to be complete and all five review passes to succeed.

## Five-pass review

1. Botanical accuracy
2. Evidence traceability
3. Terminology and consistency
4. Editorial quality and readability
5. Governance and release readiness

Each pass is an independent repository object with reviewer identity, result, completion date and exit criterion.

## Publication safety

Canonical cultivar outputs remain compiler-derived from frozen Reference Standards. Draft and incomplete editorial objects are inspectable but cannot silently modify canonical botanical content.

## Contributor path

A contributor opens a governed issue, creates or uses a contributor identity, scaffolds a submission, records evidence and uncertainty, validates the input, and submits a pull request. Merge requires compiler, repository and production-build checks.

## Baseline audit trail

The five frozen Reference Standards are represented by five accepted baseline submissions, five frozen workflows and twenty-five passed review objects. These records reconstruct the completed governance history without changing canonical botanical assertions.
