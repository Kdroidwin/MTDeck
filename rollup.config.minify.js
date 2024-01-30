import { terser } from "rollup-plugin-terser";
import config, { bundlePlugins, userscriptPlugin } from "./rollup.config";

config.output.file = "dist/MTDeckForOTD.min.user.js";
config.plugins = [...bundlePlugins, terser(), userscriptPlugin];

export default config;
