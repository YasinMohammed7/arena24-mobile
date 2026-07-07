// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat";

export default defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "node_modules/*",
      "ios/*",
      "android/*",
      "bin/*",
      "build/*",
      "expo-env.d.ts",
      "nativewind-env.d.ts",
      "package-lock.json",
      ".expo/*",
    ],
  },
  {
    rules: {
      // Allow `catch (error: any)` and other intentional `any` usage.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
