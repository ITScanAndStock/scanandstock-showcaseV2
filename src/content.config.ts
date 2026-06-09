import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      excerpt: z.string(),
      cover: image(),
      coverAlt: z.string().default(""),
      date: z.string(),
      slug: z.string(),
    }),
});

export const collections = { blog };
