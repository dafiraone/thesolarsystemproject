import { defineConfig } from "vite"

export default defineConfig({
    // root: "./",
    // publicDir: "./public",
    // base: "./src"
    optimizeDeps: {
        include: ['three']
    },
    base: "/thesolarsystemproject"
})
