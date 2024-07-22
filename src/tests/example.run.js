import { readFileSync } from "fs";
import { instantiate } from "../build/example.spec.js";

const binary = readFileSync("./build/example.spec.wasm");
const module = new WebAssembly.Module(binary);

const exports = instantiate(module, {});
