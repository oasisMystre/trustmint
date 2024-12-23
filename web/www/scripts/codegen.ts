import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";

dotenv.config({ path: ".env" });

function main() {
  const envKeys = Object.keys(process.env);
  const template = readFileSync("./scripts/templates/env.txt", "utf-8");
  const search = /^VITE_APP_|VITE_/;

  writeFileSync(
    "./src/utils/env.ts",
    template.replace(
      "%env%",
      envKeys
        .filter((key) => search.test(key))
        .map((key) => `"${key.replace(search, "")}"`)
        .join("|")
    )
  );
}

main();
