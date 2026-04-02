import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://land.modulmetall.ru",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
