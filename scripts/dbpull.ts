import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { introspect, generatePrismaSchema, generateTypescriptTypes, generateZodSchema } from "./mysql8-introspect";
import { dbfetch } from "#src/db";
import { writeFile } from "node:fs/promises";
import { join } from "path";

const db = dbfetch();

const cwd = process.cwd();
const pulledPrismaPath = join(cwd, "prisma", "pulled.prisma");
const typescriptTypesPath = join(cwd, "src", "db", "types.ts");
const zodSchemaPath = join(cwd, "src", "db", "types-zod.ts");

async function main() {
  const introspectresult = await introspect(db);

  await writeFile(pulledPrismaPath, generatePrismaSchema(introspectresult));
  await writeFile(typescriptTypesPath, generateTypescriptTypes(introspectresult));
  await writeFile(zodSchemaPath, generateZodSchema(introspectresult));
  console.log("generated types");
  console.log("Done.");
}

void main();
