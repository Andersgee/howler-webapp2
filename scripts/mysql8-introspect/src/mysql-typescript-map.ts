import type { Col } from "./introspect";

export function ts_type_from_col(col: Col) {
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
    //"enum('USER','ADMIN')" => '"USER" | "ADMIN"'
    const variants = col.COLUMN_TYPE.slice(5, -1).replaceAll("'", '"').split(",");
    return variants.join(" | ");
  } else if (t === "tinyint") {
    if (col.COLUMN_TYPE === "tinyint(1)") {
      return "boolean";
    } else {
      return "number";
    }
  } else {
    return "unknown";
    //throw new Error(`missing type mapping for '${col.COLUMN_TYPE}'`);
  }
}

const ADVANCED_DATA_TYPE_MAP: Record<string, string> = {
  point: `GeoJSON["Point"]`,
  linestring: `GeoJSON["LineString"]`,
  polygon: `GeoJSON["Polygon"]`,
  geometry: `GeoJSON["Geometry"]`,
  multipoint: `GeoJSON["MultiPoint"]`,
  multilinestring: `GeoJSON["MultiLineString"]`,
  multipolygon: `GeoJSON["MultiPolygon"]`,
  geomcollection: `GeoJSON["GeometryCollection"]`,
};

const SIMPLE_DATA_TYPE_MAP: Record<string, string> = {
  bigint: "bigint",
  int: "number",
  smallint: "number",
  mediumint: "number",
  //tinyint: "number",
  year: "number",
  double: "number",
  float: "number",
  datetime: "Date",
  timestamp: "Date",
  time: "string",
  date: "string",
  decimal: "string",
  json: "unknown",
  varchar: "string",
  char: "string",
  binary: "Buffer",
  varbinary: "Buffer",
  longblob: "Buffer",
  tinyblob: "Buffer",
  mediumblob: "Buffer",
  blob: "Buffer",
  tinytext: "string",
  text: "string",
  mediumtext: "string",
  longtext: "string",
  //"enum": "string",
};
