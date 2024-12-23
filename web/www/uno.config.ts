import { defineConfig, presetUno, presetWebFonts } from "unocss";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";

export default defineConfig({
  content: {
    filesystem: ["**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}"],
  },
  theme: {
    colors: {
      primary: "#0045FE",
      secondary: "#001959",
    },
  },
  shortcuts: {
    "bg-gradient-primary": "bg-gradient-to-r from-primary to-secondary",
    btn: "flex items-center justify-center",
    "btn-outline-primary":
      "flex items-center space-x-2 border text-black/75 px-2 py-1 border-black/40 rounded hover:border-black hover:text-black dark:text-white/50 dark:border-dark-50 dark:hover:border-white dark:hover:text-white",
    "btn-primary":
      "bg-gradient-primary text-white px-4 hover:from-primary/75 hover:to-secondary/75 active:from-primary active:to-secondary",
  },
  presets: [
    presetUno({ dark: "media" }),
    presetWebFonts({
      provider: "google",
      timeouts:false,
      fonts: {
        sans: "Inter",
        mono: "Chivo Mono",
      },
      processors: createLocalFontProcessor({
        cacheDir: "node_modules/.cache/unocss/fonts",
        fontAssetsDir: "public/assets/fonts",
        fontServeBaseUrl: "/assets/fonts",
      }),
    }),
  ],
});
