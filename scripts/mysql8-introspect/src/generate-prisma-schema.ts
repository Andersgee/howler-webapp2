import { type IntrospectResult } from "./introspect";

export function generatePrismaSchema({
  tableTypes,
  enums,
  tableIndexing,
  tableRelations,
  opposingTableRelations,
}: IntrospectResult): string {
  let s = prelude();
  //better...
  for (const [tableName, columns] of Object.entries(tableTypes).sort((a, b) => a[0].localeCompare(b[0]))) {
    s += `model ${tableName} {\n`;
    for (const column of columns) {
      s += `  ${column.prismastring}\n`;
    }
    const relations = tableRelations[tableName];
    if (relations) {
      s += "\n";
      for (const relation of relations) {
        s += `  ${relation.prismastring}\n`;
      }
    }

    const opposingRelations = opposingTableRelations[tableName];
    if (opposingRelations) {
      s += "\n";
      for (const opposingRelation of opposingRelations) {
        s += `  ${opposingRelation.prismastring}\n`;
      }
    }

    const indexing = tableIndexing[tableName];
    if (indexing) {
      s += "\n";
      for (const index of indexing) {
        s += `  ${index.prismastring}\n`;
      }
    }
    s += "}\n\n";
  }
  for (const en of enums) {
    s += `enum ${en.enumName} {\n`;
    for (const variant of en.variants) {
      s += `  ${variant}\n`;
    }
    s += "}\n\n";
  }

  return s;
}

function prelude() {
  return `datasource db {
  provider = "mysql"
  url = env("DATABASE_MYSQL_URL")
}
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextIndex"]
}\n\n`;
}
