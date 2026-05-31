import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works at any GitHub Pages path
// (e.g. https://<user>.github.io/sophiavalerio/). Combined with
// HashRouter, deep links never 404 on Pages.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
