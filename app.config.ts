import { defineConfig } from "@solidjs/start/config";
import { ssr } from "solid-js/web";

export default defineConfig({
  vite: {
    ssr: { external: ["@prisma/client"] }
  }
});
