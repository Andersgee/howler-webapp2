import { type IntrospectResult } from "./introspect";

export function generateZodSchema(r: IntrospectResult): string {
  let s = prelude();
  for (const [tableName, columns] of Object.entries(r.tableTypes)) {
    s += `export const schema_insert_${tableName} = z.object({\n`;
    for (const column of columns) {
      s += `  ${column.zod_insertstring},\n`;
    }
    s += "});\n";

    s += `export const schema_update_${tableName} = z.object({\n`;
    for (const column of columns) {
      s += `  ${column.zod_updatestring},\n`;
    }
    s += "});\n\n";
  }
  return s;
}

function prelude() {
  return `import { z } from "zod";
import { zGeoJson } from "./types-geojson";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zTypedArray = z.custom<ArrayBufferView>((value) => ArrayBuffer.isView(value));

// this file here mostly generated as a copy-paste starting point reference for when specifying api inputs
// anyway, this is how values of "INSERT" and "UPDATE" looks from a zod perspective
\n`;
}
