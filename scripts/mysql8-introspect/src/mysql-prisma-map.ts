import { type Col } from "./introspect";

export function prisma_type_from_col(col: Col): [string, string] {
  const coltype = col.COLUMN_TYPE;
  const simple = SIMPLE_TYPE_MAP[coltype];
  if (simple) {
    return simple;
  }

  const cmaxlen = col.CHARACTER_MAXIMUM_LENGTH;
  const dtprec = col.DATETIME_PRECISION;
  const numprec = col.NUMERIC_PRECISION;
  const numscale = col.NUMERIC_SCALE;

  if (coltype === "datetime") {
    return ["DateTime", `@db.DateTime()`];
  } else if (coltype.startsWith("datetime")) {
    return ["DateTime", `@db.DateTime(${dtprec})`];
  } else if (coltype === "timestamp") {
    return ["DateTime", `@db.Timestamp()`];
  } else if (coltype.startsWith("timestamp")) {
    return ["DateTime", `@db.Timestamp(${dtprec})`];
  } else if (coltype === "time") {
    return ["DateTime", `@db.Time()`];
  } else if (coltype.startsWith("time")) {
    return ["DateTime", `@db.Time(${dtprec})`];
  } else if (coltype.startsWith("decimal")) {
    if (numprec === 65n && numscale == 30n) {
      return ["Decimal", ""];
    } else {
      return ["Decimal", `@db.Decimal(${numprec},${numscale})`];
    }
  } else if (coltype.startsWith("varchar")) {
    if (cmaxlen === 191) {
      return ["String", ""];
    } else {
      return ["String", `@db.VarChar(${cmaxlen})`];
    }
  } else if (coltype.startsWith("char")) {
    return ["String", `@db.Char(${cmaxlen})`];
  } else if (coltype.startsWith("binary")) {
    return ["Bytes", `@db.Binary(${cmaxlen})`];
  } else if (coltype.startsWith("varbinary")) {
    return ["Bytes", `@db.VarBinary(${cmaxlen})`];
  } else if (coltype.startsWith("enum")) {
    return [coltype, ""];
  } else {
    //throw new Error(`missing type mapping for '${col.COLUMN_TYPE}'`);
    return [`Unsupported("${col.COLUMN_TYPE}")`, ""];
  }
}

const SIMPLE_TYPE_MAP: Record<string, [string, string]> = {
  "bigint": ["BigInt", ""], //["BigInt", "@db.BigInt"];
  "bigint unsigned": ["BigInt", "@db.UnsignedBigInt"],
  "int": ["Int", ""], //["Int", "@db.Int"],
  "smallint": ["Int", "@db.SmallInt"],
  "smallint unsigned": ["Int", "@db.UnsignedSmallInt"],
  "mediumint": ["Int", "@db.MediumInt"],
  "mediumint unsigned": ["Int", "@db.UnsignedMediumInt"],
  "int unsigned": ["Int", "@db.UnsignedInt"],
  "tinyint(1)": ["Boolean", ""],
  "tinyint": ["Int", "@db.TinyInt"],
  "tinyint unsigned": ["Int", "@db.UnsignedTinyInt"],
  "year": ["Int", "@db.Year"],
  "double": ["Float", ""], //["Float", "@db.Double"]
  "float": ["Float", "@db.Float"],
  "json": ["Json", ""],
  "date": ["DateTime", "@db.Date"],
  "longblob": ["Bytes", ""], //["Bytes", "@db.LongBlob"]
  "tinyblob": ["Bytes", "@db.TinyBlob"],
  "mediumblob": ["Bytes", "@db.MediumBlob"],
  "blob": ["Bytes", "@db.Blob"],
  "tinytext": ["String", "@db.TinyText"],
  "text": ["String", "@db.Text"],
  "mediumtext": ["String", "@db.MediumText"],
  "longtext": ["String", "@db.LongText"],
};

export function prisma_default_from_col(prismabasetype: string | undefined, col: Col) {
  //relevant info is either in COLUMN_DEFAULT or EXTRA
  //TLDR; if EXTRA==="DEFAULT_GENERATED" then use COLUMN_DEFAULT always
  //otherwise use EXTRA if not empty or COLUMN_DEFAULT if not empty. in that order.
  const value = col.EXTRA === "DEFAULT_GENERATED" ? col.COLUMN_DEFAULT : col.EXTRA || col.COLUMN_DEFAULT;

  if (col.EXTRA.startsWith("DEFAULT_GENERATED on update CURRENT_TIMESTAMP")) {
    return "now()";
  }

  if (!value) {
    return "";
  }

  if (value.startsWith("CURRENT_TIMESTAMP")) {
    return "now()";
  } else if (prismabasetype === "Boolean") {
    return `${value === "1"}`;
  } else {
    //return `dbgenerated("${value}")`;
    return `${SIMPLE_DEFAULT_MAP[value] ?? value}`;
  }
}

const SIMPLE_DEFAULT_MAP: Record<string, string> = {
  auto_increment: "autoincrement()",
};

export const REFERENTIAL_ACTION_MAP = {
  "CASCADE": "Cascade",
  "SET NULL": "SetNull",
  "SET DEFAULT": "SetDefault",
  "RESTRICT": "Restrict",
  "NO ACTION": "NoAction",
};

export function prisma_updatedat_from_col(col: Col) {
  //note:
  //prisma has an "@updatedAt" which means "update this col with current time any time this row is updated"
  //but prisma wants to handle that in prisma client rather than on db level
  //this complicates things, because prisma diff does not care about any @updatedAt usage
  //
  //anyway, mysql has the functionality so atleast we can PULL any "@updatedAt" usage
  //see "extra-diff.ts" for dealing with actually PUSHING "@updatedAt" usage

  return col.EXTRA.startsWith("DEFAULT_GENERATED on update CURRENT_TIMESTAMP") ? "@updatedAt" : "";
}
