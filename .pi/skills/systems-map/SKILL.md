---
name: systems-map
description: Creates and maintains SYSTEMS_MAP.md, a project-level document that lets a reader decide which small part of a codebase is relevant to a task without reading the rest. Use when the user invokes /systems-map, or asks to create or update the systems map.
---

# Systems Map

RFC 2119 applies. MUST/MUST NOT are absolute; SHOULD/SHOULD NOT are strong defaults; MAY is genuinely optional.

## File mechanics

- `SYSTEMS_MAP.md` MUST be a single flat markdown file at the project root.
- The file MUST open with one short paragraph stating the promise (a reader can decide which small part of the project is relevant without opening anything else) and how the areas are divided, followed by an `## Areas` section holding the entries.
- Unlike a Slice Brief, it MUST be committed to the repository — project-level documentation, not per-task working context.
- MUST NOT split the file into multiple files preemptively. MAY propose a split once the file is hard to browse, but MUST NOT split without explicit human approval.

## Modes

Pick the mode from the file's existence, not from how the request was phrased.

**Create** — file does not exist:

- Survey the codebase to propose an initial set of areas before writing anything.
- Group functionality by this test: *do these parts change for the same reason, or different ones?* Parts that change for different reasons MUST be separate areas, even if they share a directory.
- Present the proposed area breakdown to the human for confirmation before writing. The initial structure is more expensive to correct later than individual fields — MUST NOT finalize unilaterally.

**Update** — file exists:

- MUST NOT edit for changes that stay within an area's already-described boundary. Routine work inside an established area MUST NOT trigger an edit.
- MUST propose an edit to the relevant area entry when, and only when, at least one is true:
  - the area's boundary moved
  - a seam was added, closed, or changed
  - something previously safe became fragile, or vice versa
  - the area was removed or merged into another (the entry MUST then be removed or merged — a stale entry describing code that no longer exists is worse than no entry)
- SHOULD use the current Slice Brief's seam assessment, modified surface, and new surface as the primary signal, rather than re-deriving from a fresh scan. If no Slice Brief exists for the current change, MAY use a diff against the merge-base.
- MUST NOT re-survey the entire codebase on every invocation. Only the area(s) implicated MUST be re-examined.
- MUST make the smallest diff that satisfies the triggering condition. MUST NOT rewrite unrelated entries.

## Seam-promotion boundary

A seam found while building one slice belongs to that slice's Brief by default. The skill MUST NOT promote it into SYSTEMS_MAP.md unless it would matter to a second, unrelated future task — structural to the area, not incidental to the task that found it. When it's unclear, MUST ask the human.

## Area entry format

Each area MUST be written as:

```
### [Area name]
For: [one sentence, domain/experience terms]
Lives at: [entry points to start reading from]
Why this shape: [only if non-obvious]
Seams: [structural extension/swap points]
Fragile: [load-bearing things that aren't declared contracts]
```

Field requirements:

- **For** — MUST be present. Single sentence. Domain/experience terms. MUST NOT be implementation-only (naming a class or table instead of what the area is for).
- **Lives at** — MUST be present. Entry points, not exhaustive file inventory. MUST NOT enumerate every file in the area.
- **Why this shape** — MAY be omitted. If present, MUST describe a genuinely non-obvious reason. If the honest answer is "it's a standard form," MUST omit rather than manufacture a rationale.
- **Seams** — MUST be present. If no real extension/swap points exist after actively checking, write that ("none found") rather than omitting — absence reads as "not yet considered."
- **Fragile** — MUST be present, same rule: an honest "none found" after looking, never a silently missing field.

## Validation before writing

- Each entry MUST let a reader decide whether to look further without opening any of its files. If not, the entry is insufficient and MUST be revised before finishing.
- MUST NOT add an entry that duplicates an existing one in substance. If a proposed entry overlaps heavily with an existing area, MUST ask the human whether it's actually the same area.

## Example entry

```
### Identity and access
For: Who a user is and what they're allowed to do, expressed in domain terms (tenant, role, capability).
Lives at: `src/identity/index.ts`, `src/identity/policy.ts`
Seams: Capability checks are funnelled through `policy.evaluate()` — swap auth provider or add a new capability here.
Fragile: Session token TTL is hard-coded in three places; changing it requires updating all three.
```
