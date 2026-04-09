import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`[workers doctor] ${message}`);
  process.exit(1);
}

const wranglerToml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
const databaseIdMatch = wranglerToml.match(/^database_id\s*=\s*"([^"]+)"/m);
const databaseId = databaseIdMatch?.[1]?.trim();

if (!databaseId || databaseId === "placeholder-replace-with-actual-id") {
  fail("wrangler.toml の database_id が未設定です。Cloudflare D1 の実IDに差し替えてください。");
}

try {
  const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
  execFileSync(npxCommand, ["wrangler", "whoami"], {
    cwd: new URL("..", import.meta.url),
    stdio: "ignore",
  });
} catch {
  fail("Cloudflare 認証が見つかりません。`wrangler login` か `CLOUDFLARE_API_TOKEN` を設定してください。");
}

console.log("[workers doctor] Cloudflare 認証と D1 database_id の基本チェックを通過しました。");
