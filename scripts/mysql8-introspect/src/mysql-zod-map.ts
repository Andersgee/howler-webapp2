import type { Col } from "./introspect";

export function zod_type_from_col(col: Col) {
  const t = col.DATA_TYPE;
  const simple = SIMPLE_DATA_TYPE_MAP[t];
  if (simple) {
    return simple;
  }
  const advanced = ADVANCED_DATA_TYPE_MAP[t];
  if (advanced) {
    return advanced;
  }

  if (t === "enum") {
    //"enum('USER','ADMIN')" => '"USER","ADMIN"'
    const variants = col.COLUMN_TYPE.slice(5, -1).replaceAll("'", '"');
    return `z.enum([${variants}])`;
  } else if (t === "tinyint") {
    if (col.COLUMN_TYPE === "tinyint(1)") {
      return "z.boolean()";
    } else {
      return "z.number()";
    }
  } else {
    return "z.unknown()";
    //throw new Error(`missing type mapping for '${col.COLUMN_TYPE}'`);
  }
}

const ADVANCED_DATA_TYPE_MAP: Record<string, string> = {
  point: `zGeoJson.Point`,
  linestring: `zGeoJson.LineString`,
  polygon: `zGeoJson.Polygon`,
  geometry: `zGeoJson.Geometry`,
  multipoint: `zGeoJson.MultiPoint`,
  multilinestring: `zGeoJson.MultiLineString`,
  multipolygon: `zGeoJson.MultiPolygon`,
  geomcollection: `zGeoJson.GeometryCollection`,
};

//const zTypedArray = z.custom<ArrayBufferView>((value) => ArrayBuffer.isView(value));

const SIMPLE_DATA_TYPE_MAP: Record<string, string> = {
  bigint: "z.bigint()",
  int: "z.number()",
  smallint: "z.number()",
  mediumint: "z.number()",
  //tinyint: "z.number()",
  year: "z.number()",
  double: "z.number()",
  float: "z.number()",
  datetime: "z.date()",
  timestamp: "z.date()",
  time: "z.string()",
  date: "z.string()",
  decimal: "z.string()",
  json: "z.unknown()",
  varchar: "z.string()",
  char: "z.string()",
  binary: "zTypedArray",
  varbinary: "zTypedArray",
  longblob: "zTypedArray",
  tinyblob: "zTypedArray",
  mediumblob: "zTypedArray",
  blob: "zTypedArray",
  tinytext: "z.string()",
  text: "z.string()",
  mediumtext: "z.string()",
  longtext: "z.string()",
  //"enum": "string",
};
