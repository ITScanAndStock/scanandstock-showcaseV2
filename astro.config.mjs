// @ts-check
import { defineConfig } from 'astro/config';
import rehypeUnwrapImages from 'rehype-unwrap-images';

// https://astro.build/config
export default defineConfig({
  site: "https://www.scanandstock.fr",
  markdown: {
    // Retire le <p> qui enveloppe les images seules dans le Markdown des articles
    rehypePlugins: [rehypeUnwrapImages],
  },
});