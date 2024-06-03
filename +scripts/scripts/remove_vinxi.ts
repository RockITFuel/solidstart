import { rm } from "fs/promises";
import { join } from "path";
import chalk from "chalk";

const targetDir = join(process.cwd(), "node_modules", ".vinxi");

async function removeVinxiDir() {
  try {
    await rm(targetDir, { recursive: true, force: true });
    console.log(chalk.green("Successfully removed ") + chalk.red(targetDir));
  } catch (error) {
    console.error(`Error removing ${targetDir}:`, error);
  }
}

removeVinxiDir();
