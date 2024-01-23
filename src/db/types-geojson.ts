import { z } from "zod";

/*
regarding spatial types in mysql:
there are only 3 "geometry" types
"Point", "LineString" and "Polygon"
 and one generic "Geometry" which allows either of them

there are corresponding collection types
"MultiPoint", "MultiLineString" and "MultiPolygon"
and one generic "GeometryCollection" that is not limited to a single geometry type

 tldr:
type Point = { type: "Point"; coordinates: Position };
type LineString = { type: "LineString"; coordinates: Position[] };
type Polygon = { type: "Polygon"; coordinates: Position[][] };
type Geometry = Point | LineString | Polygon;

type MultiPoint = { type: "MultiPoint"; coordinates: Position[] };
type MultiLineString = { type: "MultiLineString"; coordinates: Position[][] };
type MultiPolygon = { type: "MultiPolygon"; coordinates: Position[][][] };
type GeometryCollection = { type: "GeometryCollection"; geometries: Geometry[] };

also:
mysql dont have the "feature" equivalents (that have properties)
positon are always 2d in mysql (optional "elevation" not allowed)

https://dev.mysql.com/doc/refman/8.0/en/spatial-type-overview.html
geojson spec: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2
*/

/** [longitude, latitude] aka [easting, northing] aka [x,y] */
export const zGeoJsonPos = z.tuple([z.number(), z.number()]);
export const zGeoJsonPoint = z.object({ type: z.literal("Point"), coordinates: zGeoJsonPos });
export const zGeoJsonLineString = z.object({ type: z.literal("LineString"), coordinates: z.array(zGeoJsonPos) });
export const zGeoJsonPolygon = z.object({ type: z.literal("Polygon"), coordinates: z.array(z.array(zGeoJsonPos)) });
export const zGeoJsonGeometry = z.union([zGeoJsonPoint, zGeoJsonLineString, zGeoJsonPolygon]);
export const zGeoJsonMultiPoint = z.object({ type: z.literal("MultiPoint"), coordinates: z.array(zGeoJsonPos) });
export const zGeoJsonMultiLineString = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(zGeoJsonPos)),
});
export const zGeoJsonMultiPolygon = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(zGeoJsonPos))),
});
export const zGeoJsonGeometryCollection = z.object({
  type: z.literal("GeometryCollection"),
  geometries: z.array(zGeoJsonGeometry),
});

export const zGeoJson = {
  Point: zGeoJsonPoint,
  LineString: zGeoJsonLineString,
  Polygon: zGeoJsonPolygon,
  Geometry: zGeoJsonGeometry,
  MultiPoint: zGeoJsonMultiPoint,
  MultiLineString: zGeoJsonMultiLineString,
  MultiPolygon: zGeoJsonMultiPolygon,
  GeometryCollection: zGeoJsonGeometryCollection,
};

/** [longitude, latitude] aka [easting, northing] aka [x,y] */
type Position = z.infer<typeof zGeoJsonPos>;
type Point = z.infer<typeof zGeoJsonPoint>;
type LineString = z.infer<typeof zGeoJsonLineString>;
type Polygon = z.infer<typeof zGeoJsonPolygon>;
type Geometry = z.infer<typeof zGeoJsonGeometry>;
type MultiPoint = z.infer<typeof zGeoJsonMultiPoint>;
type MultiLineString = z.infer<typeof zGeoJsonMultiLineString>;
type MultiPolygon = z.infer<typeof zGeoJsonMultiPolygon>;
type GeometryCollection = z.infer<typeof zGeoJsonGeometryCollection>;

/** [longitude, latitude] aka [easting, northing] aka [x,y] */
export type GeoJson = {
  Position: Position;
  Point: Point;
  LineString: LineString;
  Polygon: Polygon;
  Geometry: Geometry;
  MultiPoint: MultiPoint;
  MultiLineString: MultiLineString;
  MultiPolygon: MultiPolygon;
  GeometryCollection: GeometryCollection;
};
