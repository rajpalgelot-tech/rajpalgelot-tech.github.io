import { defineConfig } from 'vitest/config';

// base './' keeps every asset path relative, so the build works on the
// user site root (https://rajpalgelot-tech.github.io/) and on any subpath.
export default defineConfig({
  base: './',
  test: {
    environment: 'node'
  }
});
