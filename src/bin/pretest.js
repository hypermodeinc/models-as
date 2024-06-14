import { execSync } from "child_process";
import process from "process";
import console from "console";

try {
  await import("@as-pect/cli");
} catch {
  console.log("Installing @as-pect/cli");
  const npm = process.env.npm_execpath;
  const cmd = `node ${npm} install --no-save --no-audit @as-pect/cli`;
  execSync(cmd, { stdio: "inherit" });
}
