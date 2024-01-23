import { type IntrospectResult } from "./introspect";

export function generateTypescriptTypesWithoutDocstrings(r: IntrospectResult): string {
  let s = prelude(Object.keys(r.tableTypes));
  for (const [tableName, columns] of Object.entries(r.tableTypes)) {
    s += `export type ${tableName} = {\n`;
    for (const column of columns) {
      s += `  ${column.tsstring};\n`;
    }
    s += "};\n\n";
  }
  return s;
}

function prelude(tableNames: string[]) {
  return `import type { Generated } from "kysely";
import type { GeoJson } from "./types-geojson";
  
export type DB = {
${tableNames.map((x) => `  ${x}: ${x};`).join("\n")}
};\n\n`;
}

// most of the code here is generating docstrings for types.ts
// its just nice to know if and how something is indexed,
// if a typescript "number" actually is a "smallint unsigned",
// what the default value is etc.
// without leaving typescript land

export function generateTypescriptTypes(r: IntrospectResult): string {
  let s = prelude(Object.keys(r.tableTypes));

  for (const [tableName, columns] of Object.entries(r.tableTypes).sort((a, b) => a[0].localeCompare(b[0]))) {
    s += `export type ${tableName} = {\n`;
    for (const column of columns) {
      const tds = dbtypedocstring(column);
      const ds = indexinfodocstring(column, r);
      const indexstring = ds ? `indexed: ${ds}, ` : "";
      const defaultstring = column.defaultValue ? `default: ${column.defaultValue}, ` : "";
      const dbtypestring = `dbtype: ${tds}`;

      s += `  /** ${defaultstring}${indexstring}${dbtypestring} */\n`;
      s += `  ${column.tsstring};\n`;
    }
    s += "};\n\n";
  }
  return s;
}

type TT = IntrospectResult["tableTypes"];
type Col = TT[keyof TT][number];

function dbtypedocstring(c: Col) {
  const t = c.DATA_TYPE;
  const ct = c.COLUMN_TYPE;

  //just some additional info about certain types
  if (t === "time") {
    return `'${ct}', eg "21:01:59.123456" with max ${c.DATETIME_PRECISION} digits after decimal`;
  } else if (t === "date") {
    return `'${ct}', eg "2000-12-24"`;
  } else if (t === "datetime") {
    return `'${ct}', eg "2000-12-24 21:01:59.123456" with max ${c.DATETIME_PRECISION} digits after decimal`;
  } else if (t === "timestamp") {
    return `'${ct}', note: should prob use datetime instead. timestamp has some caveats regarding valid date ranges and inserted/selected value depends on timezone of the system that is doing it etc.`;
  } else if (t === "decimal") {
    return `'${ct}', eg exact number as string "12.34" with max ${c.NUMERIC_PRECISION} digits in total and max ${c.NUMERIC_SCALE} digits after decimal`;
  } else if (t === "varchar" || t === "char") {
    return `'${ct}', eg string with max ${c.CHARACTER_MAXIMUM_LENGTH} chars`;
  } else if (t === "varbinary" || t === "binary") {
    return `'${ct}', eg bytes with max ${c.CHARACTER_OCTET_LENGTH} bytes`;
  } else if (t === "tinytext" || t === "text" || t === "mediumtext" || t === "longtext") {
    return `'${ct}', eg external string blob with max ${c.CHARACTER_MAXIMUM_LENGTH} chars`;
  } else if (t === "tinyblob" || t === "blob" || t === "mediumblob" || t === "longblob") {
    return `'${ct}', eg external bytes blob with max ${c.CHARACTER_OCTET_LENGTH} bytes`;
  } else if (INTEGER_MIN_MAX_MAP[ct] !== undefined) {
    const min = INTEGER_MIN_MAX_MAP[ct]!.min;
    const max = INTEGER_MIN_MAX_MAP[ct]!.max;
    return `'${ct}' eg number in range [${min}, ${max}]`;
  } else if (ct === "tinyint(1)") {
    return `'boolean'`; //synonym
  } else {
    return `'${ct}'`;
  }
}

//https://dev.mysql.com/doc/refman/8.0/en/integer-types.html
const INTEGER_MIN_MAX_MAP: Record<string, { min: string; max: string }> = {
  "tinyint": { min: "-128", max: "127" },
  "tinyint unsigned": { min: "0", max: "255" },
  "smallint": { min: "-32_768", max: "32_767" },
  "smallint unsigned": { min: "0", max: "65_535" },
  "mediumint": { min: "-8_388_608", max: "8_388_607" },
  "mediumint unsigned": { min: "0", max: "16_777_215" },
  "int": { min: "-2_147_483_648", max: "2_147_483_647" },
  "int unsigned": { min: "0", max: "4_294_967_295" },
  "bigint": { min: "-2^63", max: "2^63-1" },
  "bigint unsigned": { min: "0", max: "2^64-1" },
};

function indexinfodocstring(c: Col, r: IntrospectResult) {
  const tableName = c.tableName;
  const colName = c.colName;
  const relevantIndexes = r.tableIndexing[tableName]
    ?.filter((index) => index.colNames.includes(colName))
    .map((x) => `(${x.colNames.join(", ")})`);

  if (!relevantIndexes || relevantIndexes.length < 1) {
    return "";
  }

  return `${relevantIndexes.join(" and ")}`;
}
