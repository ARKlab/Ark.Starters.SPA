import { defineConfig } from "@vite-pwa/assets-generator/config";
import { minimal2023Preset as preset } from "@vite-pwa/assets-generator/presets";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset,
  images: ["public/icon.png"],
});
