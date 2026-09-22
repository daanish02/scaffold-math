# Content folder structure

Two levels only, matching `content-schema.ts`: **section** → **concept**. No third level.

```
content/concepts/
  <section>/
    <concept>.mdx
```

- `<section>` — a folder, e.g. `linear-algebra`. Matches the `section` field in frontmatter.
- `<concept>.mdx` — one file per concept, e.g. `eigenvectors.mdx`. The filename (minus extension) is the concept slug.

## Mapping to `id`

A concept's `id` is `kb:section:concept` (e.g. `math:linear-algebra:eigenvectors`). Given this template's `kb` value:

```
id: "math:linear-algebra:eigenvectors"
        ^section        ^concept
     -> content/concepts/linear-algebra/eigenvectors.mdx
```

`kb` doesn't appear in the path — it's fixed per-repo (this whole content collection belongs to one `kb`) and only shows up in frontmatter and cross-repo `id`s.

Naming: lowercase, hyphenated, no abbreviations (`linear-algebra` not `lin-alg`).

See `docs/AUTHORING.md` (from `scaffold-core`) for the full concept-page template and required frontmatter fields.
