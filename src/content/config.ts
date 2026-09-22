import { defineCollection } from "astro:content";
import { conceptSchema } from "@daanish02/scaffold-core/astro/content-schema.ts";

// One collection per KB: "concepts". Every concept page's frontmatter is
// validated against scaffold-core's conceptSchema at build time.
const concepts = defineCollection({
  type: "content",
  schema: conceptSchema,
});

export const collections = { concepts };
