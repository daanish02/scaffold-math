# Scaffold — Project Brief

A family of static, GitHub Pages–hosted knowledge bases that serve as both **reference material** (for people who already know the field and want a precise refresher) and **learning material** (for people encountering a topic for the first time). Interactive components carry explanatory weight that prose alone can't — visuals lead where a visual explains better than a paragraph would.

License: **CC BY-NC-SA 4.0** on every repo (attribution required, no commercial use, derivatives must carry the same terms).

---

## 1. Repos

| Repo                    | Purpose                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scaffold-core`         | Shared components, design system, content schema, KB registry, reusable CI workflow. Published to npm as `@yourusername/scaffold-core`, shipped as **source** (no build step) so each KB's own Vite/Astro build compiles it in context.                                                                                                                                             |
| `scaffold-template`     | "Use this template" starter for spinning up a new KB — Astro config wired to core, content folder structure, CI already in place.                                                                                                                                                                                                                                                   |
| `scaffold-math`         | Math (build first)                                                                                                                                                                                                                                                                                                                                                                  |
| `scaffold-cs`           | Computer science, **including a Software Engineering Practices section**: version control (Git internals — commit DAG, branching, merge vs. rebase), CI/CD (pipeline concept, stage gates), containerization (namespaces/cgroups/layered filesystems before tool specifics), infrastructure as code (declarative vs. imperative, state, drift), observability (logs/metrics/traces) |
| `scaffold-hardware`     | Computer architecture: digital logic, CPU pipelining, memory hierarchy/caching, GPUs and parallel architectures (ties into DL), storage, networking basics                                                                                                                                                                                                                          |
| `scaffold-ml`           | Classical ML and fundamentals                                                                                                                                                                                                                                                                                                                                                       |
| `scaffold-dl`           | DL foundations: architectures, training, backprop, optimization                                                                                                                                                                                                                                                                                                                     |
| `scaffold-applied-dl`   | Built on `scaffold-dl`: LLMs/NLP, Vision/VLMs, Audio, RL                                                                                                                                                                                                                                                                                                                            |
| `scaffold-econ-finance` | One repo, two top-level sections: Economics and Finance                                                                                                                                                                                                                                                                                                                             |

No separate hub/landing site. Each KB's homepage lists the others (via the shared registry) and cross-links happen inline wherever a concept is relevant across KBs.

**Naming conventions:** lowercase, hyphenated, no abbreviation inconsistency (`cs` not `computer-science`). Every repo's README opens with the same tagline pattern: `Scaffold · <Subject> — interactive reference and learning material for <subject>`. Site `<title>` follows `Scaffold: <Subject>`. GitHub topics: `scaffold` + the subject.

---

## 2. Math topic scope (build order reference)

1. **Foundations** — logic and proofs, sets, algebra, functions, exponentials and logarithms, trigonometry, complex numbers, combinatorics, sequences and series [proof techniques: induction, contradiction — opt]
2. **Geometry** — Euclidean geometry, coordinate/analytic geometry, conic sections, transformations [polar/spherical coordinates — opt] [differential geometry — later] [topology basics — later]
3. **Linear algebra** _(build this section first — best interactive potential, stress-tests the component library)_ — vectors, matrices as transformations, systems of equations, determinants, eigenvalues/eigenvectors, orthogonality, projections, SVD, PCA, decompositions [tensors — opt] [abstract vector spaces — later]
4. **Calculus** — limits, derivatives, integrals, Taylor series, multivariable calculus, gradients, Jacobians, Hessians, chain rule [vector calculus — opt] [differential equations — later] [real analysis — later]
5. **Probability** — random variables, distributions, expectation/variance, Bayes' rule, joint/conditional distributions, LLN, CLT, Markov chains [stochastic processes — opt] [measure theory — later] [stochastic calculus — later]
6. **Statistics** — estimation (MLE, MAP), hypothesis testing, confidence intervals, Bayesian inference, regression, bootstrap, sampling [time series — opt] [causal inference — later]
7. **Optimization** — convexity, gradient descent and variants, constrained optimization, Lagrange multipliers, duality, linear programming [numerical methods — opt] [integer/non-convex optimization — later]
8. **Discrete math** — graph theory, number theory, modular arithmetic, recurrences [cryptography math — opt] [abstract algebra — later]
9. **Information theory** — entropy, KL divergence, cross-entropy, mutual information [coding theory — later]
10. **Signals & Fourier analysis** [opt] — Fourier series/transform, convolution, sampling

**Notation sheet** — a cross-cutting reference, not tied to one topic: symbol, name, pronunciation, plain-English meaning, tiny example, context variants (same symbol meaning different things across fields), Greek alphabet, naming conventions (bold = vector, capital = matrix, hat = estimate, bar = mean). Every rendered equation site-wide should have hover/tap tooltips on symbols linking back to this sheet.

---

## 3. Content schema (`content-schema.ts`)

```typescript
import { z } from "astro/zod";

export const conceptSchema = z.object({
  // Identity
  id: z.string(), // "kb:section:concept" — e.g. "math:linear-algebra:eigenvectors"
  kb: z.enum([
    "math",
    "cs",
    "hardware",
    "ml",
    "dl",
    "applied-dl",
    "econ-finance",
  ]),
  title: z.string(),
  section: z.string(), // level 1 — e.g. "linear-algebra"

  // Relationships — drive the prereq graph, sidebar, and ConceptLink resolver
  prerequisites: z.array(z.string()).default([]), // ids, can cross KBs
  related: z.array(z.string()).default([]), // "see also," no ordering implication
  unlocks: z.array(z.string()).optional(), // rarely needed; usually inferred by scanning others' prerequisites

  // Pedagogy metadata — used for real filtering (e.g. a "core path only" mode), not inert
  difficulty: z.enum(["intro", "core", "advanced"]).default("core"),
  status: z.enum(["stub", "draft", "published"]).default("draft"),
  estimatedMinutes: z.number().optional(),

  // Content flags
  hasInteractive: z.boolean().default(false),
  tags: z.array(z.string()).default([]), // carries [opt]/[later] markers from topic lists

  description: z.string().optional(),
});

export type Concept = z.infer<typeof conceptSchema>;
```

- Two content levels: **section** (large area, e.g. "Linear Algebra") → **concept** (topic within it, e.g. "eigenvectors"). No third level.
- `id` is namespaced (`kb:section:concept`), not a URL or slug — this is what makes cross-repo links stable. If a KB restructures its folder layout, only the registry mapping needs updating, not every inbound link elsewhere.

---

## 4. Concept page template (the authoring pattern — put in `AUTHORING.md`)

This is how Scaffold solves being useful to both a first-time learner and an expert on the same page: **layered sections**, each with its own natural length, so a beginner reads top-to-bottom while an expert jumps straight to section 3 or the demo.

1. **Intuition** — 2–4 sentences, plain language, no notation
2. **Visual / interactive** — leads if a demo explains better than prose would (matrices-as-transformations, gradient descent, eigenvectors, CLT should all lead with the visual)
3. **Formal definition** — dense, precise, notation-heavy; what an expert scans on a refresher
4. **Common pitfalls** — short, bulleted
5. **Connects to** — prerequisite/related chips, doubling as navigation and "here's where this matters later"
6. **Self-check** — 2–3 questions, answers revealed inline via a "Show answer" toggle (not a separate answer key, not scored — a mirror, not a test). Each revealed answer includes a one-sentence _why_.

Authoring checklist before writing prose for any concept: **does an interactive/diagram explain this better than a paragraph would?** If yes, build the demo first and let prose cover only what the demo can't (the _why_, edge cases, connections).

---

## 5. `scaffold-core` package structure

```
scaffold-core/
├── package.json
├── astro/
│   ├── integration.ts        # the `scaffold()` Astro integration
│   ├── config-defaults.ts    # base path, MDX, KaTeX, Pagefind wiring
│   └── content-schema.ts     # zod schema above
│
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Sidebar.astro          # per-KB nav tree, collapses to drawer on mobile
│   │   └── KBFamilyNav.astro      # "other Scaffold KBs" section, reads registry
│   │
│   ├── notation/
│   │   ├── SymbolTooltip.tsx      # hover/tap on any symbol in rendered math
│   │   └── NotationSheet.astro    # the full symbols reference page
│   │
│   ├── interactive/
│   │   ├── ParamSlider.tsx
│   │   ├── TransformViz.tsx       # matrix → grid warp, 2D/3D (prototype exists)
│   │   ├── DraggableGeometry.tsx  # Mafs/JSXGraph wrapper
│   │   ├── StepThrough.tsx        # next/back walkthroughs
│   │   ├── GradientDescentPlayground.tsx
│   │   ├── DistributionExplorer.tsx
│   │   ├── PyodideCell.tsx        # lazy-loaded Python-in-browser
│   │   ├── CodeCell.astro         # code block with copy button
│   │   └── SelfCheck.tsx          # revealable Q&A, no scoring
│   │
│   ├── graph/
│   │   └── PrereqGraph.tsx        # directed graph (DAG), not Obsidian-style undirected —
│   │                              # global view + per-page local view; cross-KB edges visually
│   │                              # distinct; can topologically sort to suggest a reading order
│   │
│   └── content/
│       ├── ConceptLink.astro      # cross-repo resolver: id → live URL via registry
│       └── Callout.astro          # pitfall/warning boxes
│
├── styles/
│   ├── tokens.css             # design tokens — see section 6
│   └── base.css
│
├── registry/
│   └── kbs.json                # {name, url, tagline, status} per KB — single source of truth
│
├── scripts/
│   ├── validate-graph.ts       # CI: no dangling prerequisites, no cycles
│   └── check-links.ts          # CI: cross-repo ConceptLink resolution check
│
├── workflows/
│   └── deploy-pages.yml        # reusable GH Actions workflow — each KB's own workflow calls this in ~5 lines
│
└── docs/
    └── AUTHORING.md            # concept template from section 4
```

Distribution: **npm-published**, shipped as source (`.astro`/`.ts`/`.tsx`/`.css`, no compiled `dist/`) so each KB's own Astro/Vite build compiles it in context. Use `bun link` or a local file path during early development before the API stabilizes enough to version and publish.

---

## 6. Design tokens

Palette avoids the common AI-generated defaults (cream+terracotta, near-black+neon, SaaS card kit, ALL-CAPS eyebrow labels). Direction: a cool, blueprint/drafting-table feel — appropriate for a "scaffolding of knowledge" concept — built for comfortable long-form reading and mobile-first.

**Light (default)**

```
--bg: #F1F3F1;          --bg-panel: #FAFBFA;      --bg-raised: #FFFFFF;
--ink: #1C2531;         --ink-soft: #4B5563;      --ink-faint: #8A93A0;
--rule: #D7DCD9;        --rule-strong: #B7BFBB;
--accent: #2E7A78;      --accent-soft: #E4F0EF;   --accent-ink: #1B4C4B;
--warn: #B36A2E;        --warn-soft: #F5E9DC;
--chip-bg: #EAEEEA;
```

**Dark**

```
--bg: #141A21;          --bg-panel: #1A222B;      --bg-raised: #202A35;
--ink: #E9E7DD;         --ink-soft: #B7BCC4;      --ink-faint: #737C88;
--rule: #2B3540;        --rule-strong: #3B4753;
--accent: #5FB6B0;      --accent-soft: #1E3735;   --accent-ink: #8FD1CC;
--warn: #D69A5E;        --warn-soft: #332619;
--chip-bg: #232D38;
```

Default to system preference (`prefers-color-scheme`), with a manual light/dark/system toggle that overrides and persists.

**Type**

- Body/headings: **Source Serif 4** — comfortable for long reading, pairs naturally with math notation
- UI chrome/nav/labels: **IBM Plex Sans**
- Code/notation labels: **IBM Plex Mono**
- Line length: cap prose at ~68ch. Avoid ALL-CAPS labels, single-word accent styling in headlines, and numbered markers unless content is a genuine sequence.

**Layout**

- Single-column content, collapsible sidebar (drawer on mobile, safe-area aware)
- Prerequisite chips as real navigation, not decoration
- One deliberate interactive moment per concept, not scattered hover effects everywhere

A working prototype (concept page + live transform visualizer demo) was built and approved — reference it directly: [prototype artifact]. Carry its exact look, feel, and interaction patterns forward; don't reinterpret from tokens alone.

**Confirmed additions from review:** code blocks must have a copy button (`CodeCell.astro`).

---

## 7. Cross-KB linking

- **`registry/kbs.json`** in `scaffold-core` — single list of every KB (name, URL, tagline, status: live/planned). `KBFamilyNav.astro` renders this on every KB homepage. Update once in core, bump version, every KB's family list updates on next build.
- **In-content links**: author writes `<ConceptLink id="math:linear-algebra:eigenvectors" />`; a build-time step resolves it to the live URL via the registry. A CI script (`check-links.ts`) validates resolution and catches dangling references.
- **Prerequisite graph** (`PrereqGraph.tsx`): directed, not Obsidian's undirected backlink-style graph. Two modes — global map (full DAG across KBs, cross-KB edges visually distinct) and local/contextual (per-concept: what feeds into this, what depends on it). The DAG structure allows topological sort from any target concept, generating a suggested reading order — a feature Obsidian's untyped graph doesn't support.

---

## 8. Search

Per-KB **Pagefind** search now (each site indexes its own content). Pagefind supports merging multiple sites' indices at query time for a cross-KB unified search — this is a documented later addition, not a rework: a new small page pointing at all KBs' existing indices, no changes needed to what ships now.

---

## 9. Ops

- **CI/CD**: one reusable GitHub Actions workflow (`scaffold-core/workflows/deploy-pages.yml`) — install → build → Pagefind index → deploy to Pages. Each KB's own workflow file calls it in ~5 lines.
- **`scaffold-core` CI**: typecheck/lint on PR; tag-triggered npm publish via changesets (deliberate version bumps, not manual).
- **Environments**: production only per repo — no staging needed for GitHub Pages. PR builds can build-check without deploying to catch breakage pre-merge.
- **Content validation in CI**: `validate-graph.ts` (no dangling prerequisites, no cycles in the DAG) and `check-links.ts` (cross-repo `ConceptLink` resolution).
- **Performance budget**: enforce via Lighthouse CI — no single page loads more than roughly 5 MB of WASM/model weights (Pyodide, ONNX Runtime Web, transformers.js are all heavy; use lazily, per-page, never bundled globally, and always with a static fallback).
- **No monitoring/analytics** — not needed for a static reference site (explicitly decided against by choice, not by default).

## 9a. Hardware constraints for interactive content

Everything runs on the _reader's_ device, not a server:

- **Pyodide** (~10–25 MB, memory-hungry): lazy-load per page, always with a static-output fallback for low-end devices.
- **WebGL** (Three.js, D3 3D): safe everywhere except very old devices; keep polygon counts modest — these are explanatory visuals, not games.
- **WebGPU**: partial browser support — treat as progressive enhancement only.
- **ONNX Runtime Web / transformers.js** (for live tiny-model demos): reserve for a few showpiece pages, not routine use, given weight and CPU cost on phones.

---

## 10. Build order

1. `scaffold-core` (components, schema, tokens, registry, CI workflow)
2. `scaffold-template`
3. `scaffold-math` — starting with the **Linear Algebra** section (best interactive payoff, stress-tests the component library end to end)
4. `scaffold-cs`
5. `scaffold-hardware`
6. `scaffold-ml`
7. `scaffold-dl`
8. `scaffold-applied-dl`
9. `scaffold-econ-finance`

---

## Open items intentionally deferred (not blockers)

- Unified cross-KB search (documented path exists, section 8)
- `scaffold-dl` → `scaffold-applied-dl` internal sub-splits (e.g. a future standalone LLM repo) if any single area outgrows its section
- Analytics — explicitly opted out for now
