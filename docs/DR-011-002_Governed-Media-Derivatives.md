# DR-011-002 — Governed Media Derivatives

**Status:** Accepted
**Date:** 2026-07-26

## Context

Sprint 5 introduced useful identity illustrations, but the pilot model did not fully capture source preservation, rights, privacy, derivative lineage or RC-020 coverage gaps.

## Decision

Adopt `media-v2` sidecars and deterministic derivative profiles. Preserve original sources, publish only approved derivatives, checksum every source and derivative, remove public EXIF/GPS by default, and label all Atlas reconstructions as non-evidentiary.

## Alternatives considered

1. Keep one ungoverned file per cultivar — rejected because rights and replacement history remain opaque.
2. Treat attractive illustrations as identity evidence — rejected because presentation fidelity is not specimen authentication.
3. Store only remote URLs — rejected because source preservation, checksum verification and availability would be weak.

## Consequences

The process adds metadata and validation work, but creates repeatable rights-compliant publication, clear evidence boundaries and replaceable media assets. Future photography can enter the same contract without being equated with illustrations.

## Revisit trigger

Review when the Atlas adopts a public media licence, retains location metadata, processes raster photographs, or introduces authenticated specimen photography.
