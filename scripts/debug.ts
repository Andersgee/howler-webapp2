import { execSync } from "node:child_process";
import { join } from "node:path";
import { execa } from "execa";

const cwd = process.cwd();
const schemaPrismaPath = join(cwd, "prisma", "schema.prisma");
const pulledPrismaPath = join(cwd, "prisma", "pulled.prisma");
const typescriptTypesPath = join(cwd, "src", "db", "types.ts");

// pnpm prisma migrate diff --from-schema-datamodel prisma/pulled.prisma --to-schema-datamodel prisma/schema.prisma --script
// pnpm prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script

function prismadiff(fromPath: string, toPath: string) {
  const cmd = `pnpm prisma migrate diff --from-schema-datamodel ${fromPath} --to-schema-datamodel ${toPath} --script`;
  const hmm = execSync(cmd, { encoding: "utf8" });
  console.log(hmm);
}
prismadiff(pulledPrismaPath, schemaPrismaPath);
