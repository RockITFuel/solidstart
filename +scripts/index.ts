import { Glob } from "bun";

/**
 * This script is used to extract all the server functions from the project.
 * It will scan all the files in the src directory and extract the server functions.
 * The goal is to check if there is a guard in the server function.
 */

const glob = new Glob("**/*.{ts,tsx}");

type ServerFunction = {
  functionName: string;
  line: number;
  guard: string;
};

const results: {
  fileName: string;
  serverFunctions: ServerFunction[];
}[] = [];

for (const fileName of glob.scanSync({
  absolute: true,
  cwd: "../src/",
})) {
  const file = Bun.file(fileName);

  const text = await file.text();
  if (text.includes("use server")) {
    // console.log(fileName);
    const serverFunctionsName = await extractServerFunctions(fileName);

    results.push({
      fileName,
      serverFunctions: serverFunctionsName,
    });
  }
}
// console.table(results);

function printServerFunctionsTable() {
  results.forEach((result, i) => {
    console.log("|----|---------------------");
    console.log(`| ${i}  | ${result.fileName}`);
    console.log("|----|---------------------");
    console.table(result.serverFunctions);
    console.log("");
    console.log("");

    // console.log("|----|---------------------");
  });
}

printServerFunctionsTable();

async function extractServerFunctions(filePath: string) {
  const file = Bun.file(filePath);
  const content = await file.text();
  const lines = content.split("\n");

  const serverFunctionNames: ServerFunction[] = [];

  const functionPatterns = [
    /(async\s+function\s+(\w+)|const\s+(\w+)\s*=\s*async\s*\(.*?\)\s*=>|const\s+(\w+)\s*=\s*\w+\s*\(.*?\)\s*=>)/,
    /const\s+(\w+)\s*=\s*\w+\s*\(\s*async\s*\(\s*\)\s*=>/,
  ];

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of functionPatterns) {
      const match = lines[i].match(pattern);
      if (match) {
        for (let j = 1; j <= 10; j++) {
          if (lines[i + j] && lines[i + j].includes('"use server"')) {
            const extractedFunctionName = extractFunctionName(lines[i]);
            if (
              extractedFunctionName &&
              serverFunctionNames.some(
                (f) => f.functionName === extractedFunctionName
              ) === false
            ) {
              serverFunctionNames.push({
                functionName: extractedFunctionName,
                line: i,
                guard: "",
              });
            }

            break;
          }
        }
      }
    }
  }

  return serverFunctionNames;
}

function extractFunctionName(line: string) {
  switch (true) {
    case line.includes("const") && line.includes("="): {
      //   console.log("line: ", line);
      return line.split("const ")[1].split(" = ")[0];
    }
    default: {
      console.log("line: ", line);
      return;
    }
  }
}
