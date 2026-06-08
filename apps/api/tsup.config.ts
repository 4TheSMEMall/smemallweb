import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["cjs"],          // CommonJS — what Node expects by default
  target: "node20",
  bundle: true,             // inline workspace packages (e.g. @sme-mall/shared)
  minify: false,            // keep readable for debugging Railway logs
  sourcemap: true,
  clean: true,
  external: [
    // Native bindings — must stay as require() calls, not bundled
    "@prisma/client",
    "bcryptjs",
  ],
});
