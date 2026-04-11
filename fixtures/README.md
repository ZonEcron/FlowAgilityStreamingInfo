# Fixtures

## Purpose

This folder is for real captured payloads and logs used for manual regression checks.


## Recommended Structure

- `fixtures/flow/`
  FlowAgility message captures
- `fixtures/zonecron/`
  ZonEcron message captures
- `fixtures/galican/`
  Galican message captures, preferably JSON because Galican payloads are structured objects
- `fixtures/settings/`
  exported settings files used for import/export regression


## Naming

Use names that identify:

- source system
- event or competition
- date
- purpose

Suggested examples:

- `flow-2026-04-11-lugo-jumping.txt`
- `zonecron-2026-04-11-training.txt`
- `galican-2026-04-11-real-event.txt`
- `settings-2026-04-11-default.json`


## Capture Rules

- keep original payload format whenever possible
- do not edit message contents by hand
- if sensitive data must be removed, duplicate the file and sanitize the copy
- prefer one fixture per distinct issue or behavior
- if a fixture exists to reproduce a bug, mention that bug in the filename or adjacent notes


## Minimum Useful Fixture Set

At minimum, try to maintain:

1. One Flow capture with valid `run` updates.
2. One Flow capture with valid `run_ready` updates.
3. One Flow capture where `results_combined` is populated.
4. One ZonEcron capture with live timing and F/R/E changes.
5. One Galican capture from real hardware if available.
6. One exported settings JSON known to restore correctly.


## Usage

Fixtures can be loaded through the in-app replay panel enabled with `?replay=1`.
The replay source type is inferred automatically from the file contents.

Their current purpose is:

- manual verification against real payloads
- future regression tooling
- preserving known-good examples when APIs behave differently from documentation


## Current Seed Fixtures

The repository now includes a combined Flow replay fixture based on the official FlowAgility streaming examples:

- `fixtures/flow/flow-demo.json`
- `fixtures/flow/flow-demo.md`

These are seed fixtures only. Replace or complement them with real captured traffic whenever possible.

The repository also includes a documented real ZonEcron fixture:

- `fixtures/zonecron/zonecron-demo.txt`
- `fixtures/zonecron/zonecron-demo.md`

It also includes a reduced Galican replay fixture keeping only the meaningful state changes:

- `fixtures/galican/Galican-demo.json`
- `fixtures/galican/Galican-demo.md`
