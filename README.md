Scaffold · [Subject] — interactive reference and learning material for [subject]

Starter template for a new [Scaffold](https://github.com/daanish02) knowledge base: a static, GitHub Pages–hosted site built on [Astro](https://astro.build) and [`scaffold-core`](https://github.com/daanish02/scaffold-core) (shared components, design tokens, content schema, and CI).

## Using this template

1. Click **Use this template** on GitHub and create your new KB repo (e.g. `scaffold-math`).
2. Rename the base config:
   - Set `SCAFFOLD_SITE` and `SCAFFOLD_BASE` (or edit the constants directly in [`astro.config.ts`](astro.config.ts)) to your new KB's site URL and base path.
   - Update the tagline at the top of this README and in `package.json`'s `name` field.
3. Replace the sample content:
   - Delete [`src/content/concepts/sample-section/`](src/content/concepts/sample-section/) and add your own sections/concepts — see [`docs/content-structure.md`](docs/content-structure.md) for how folder layout maps to concept `id`s.
   - Follow the authoring pattern in `scaffold-core`'s [`AUTHORING.md`](https://github.com/daanish02/scaffold-core/blob/main/docs/AUTHORING.md) for every new concept page: intuition → visual/interactive → formal definition → common pitfalls → connects-to → self-check.
4. Push to `main`. The included [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) calls `scaffold-core`'s reusable workflow to build, index, and deploy to GitHub Pages automatically.

## Reference

- [Scaffold project brief](docs/scaffold-brief.md) — overall vision, repo family, content schema, design tokens
- [`scaffold-core` AUTHORING.md](https://github.com/daanish02/scaffold-core/blob/main/docs/AUTHORING.md) — the concept-page template every KB follows
- [`docs/content-structure.md`](docs/content-structure.md) — how this repo's content folders map to concept `id`s

## License

CC BY-NC-SA 4.0 — attribution required, no commercial use, derivatives must carry the same terms.
