import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    ssr: true,
    server: {
        preset: "github-pages",
        baseURL: process.env.BASE_PATH,
    },
});
