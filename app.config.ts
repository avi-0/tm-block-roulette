import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    ssr: false,
    server: {
        preset: "node-server",
        baseURL: process.env.BASE_PATH,
    },
});
