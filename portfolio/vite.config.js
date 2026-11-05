import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The build goes to `build/` (the folder Create React App used), so the Vercel
// project keeps working without changing its output directory.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: "build", emptyOutDir: true },
});
