import { type IntrospectResult } from "./introspect";

export function generateZodSchema(r: IntrospectResult): string {
  let s = prelude();
  for (const [tableName, columns] of Object.entries(r.tableTypes)) {
    s += `export const ${tableName} = z.object({\n`;
    for (const column of columns) {
      s += `  ${column.zodstring},\n`;
    }
    s += "});\n\n";
  }
  //s += postlude(Object.keys(r.tableTypes));
  return s;
}

function prelude() {
  return `import * as z from "zod";
import { schemaGeoJSON } from "./geojson-types"

const zTypedArray = z.custom<ArrayBufferView>((value) => ArrayBuffer.isView(value));

// this file here mostly generated as a copy-paste starting point reference for when specifying api inputs
//
// anyway, this is how values of "INSERT" looks from a zod perspective
// but database defaults to NULL for nullable cols if not specifying a value for that col on insert
// so having any .nullable() (aka T | null) as .nullish() (aka T | null | undefined) is also valid for inserts
//
// for "UPDATE" obviously everything is .optional() which also means all .nullable() cols become .nullish()
//
// again, this is just a copy paste starting point for writing input schemas
\n`;
}

function postlude(tableNames: string[]) {
  return `export const schemaDB = z.object({
${tableNames.map((x) => `  ${x}: ${x},`).join("\n")}
});\n`;
}
