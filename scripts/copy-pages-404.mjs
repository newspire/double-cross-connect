import { copyFile } from "node:fs/promises";

if (process.env.GITHUB_PAGES === "true") {
  await copyFile("dist/index.html", "dist/404.html");
}
