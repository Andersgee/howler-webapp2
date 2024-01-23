import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { introspect, generatePrismaSchema, generateTypescriptTypes, generateZodSchema } from "./mysql8-introspect";
import { dbfetch, dbTransaction } from "#src/db";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { prismadiff } from "./utils/prisma-diff";
import { extradiff } from "./utils/extra-diff";

/*
I like having schema.prisma as source of truth, but without prisma client as driver.

main idea is to:
1. introspect, save pulled.prisma
2. generate sql (compare schema.prisma - pulled.prisma with "prisma migrate diff")
3. apply sql
4. introspect again and generate typescript types

but there are some caveats: prisma diff does not care about certain things like @updatedAt 
since they want to handle that in prisma client rather than on database level
so introspect again and apply remaining stuff
*/

const db = dbfetch();

const cwd = process.cwd();
const schemaPrismaPath = join(cwd, "prisma", "schema.prisma");
const pulledPrismaPath = join(cwd, "prisma", "pulled.prisma");
const typescriptTypesPath = join(cwd, "src", "db", "types.ts");
const zodSchemaPath = join(cwd, "src", "db", "types-zod.ts");

async function main() {
  let introspectresult = await introspect(db);
  await writeFile(pulledPrismaPath, generatePrismaSchema(introspectresult));
  const prismadiffsql = prismadiff(pulledPrismaPath, schemaPrismaPath);

  console.log("applying prismadiffsql");
  await apply(prismadiffsql);
  introspectresult = await introspect(db);

  const extradiffsql = extradiff(introspectresult, schemaPrismaPath);
  if (extradiffsql.length > 0) {
    console.log("applying extradiffsql");
    await apply(extradiffsql);
    introspectresult = await introspect(db);
  }

  await writeFile(typescriptTypesPath, generateTypescriptTypes(introspectresult));
  await writeFile(zodSchemaPath, generateZodSchema(introspectresult));
  console.log("generated types");
  console.log("Done.");
}

async function apply(sqls: string[]) {
  if (sqls.length === 0) {
    console.log("(empty, skipping)");
    return;
  }
  console.log(sqls);
  const compiledQuerys = sqls.map((s) => ({ sql: s, parameters: [] }));
  await dbTransaction(compiledQuerys);
}

void main();
