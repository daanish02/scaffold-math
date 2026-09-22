import { defineConfig } from "astro/config";
import { scaffold } from "@daanish02/scaffold-core/astro/integration";

// Every KB spun from this template needs its own site/base — edit these two
// constants (or set the env vars) when starting a new KB.
const SITE = process.env.SCAFFOLD_SITE ?? "https://daanish02.github.io";
const BASE = process.env.SCAFFOLD_BASE ?? "/scaffold-template/";

export default defineConfig({
  integrations: [scaffold({ site: SITE, base: BASE })],
});
