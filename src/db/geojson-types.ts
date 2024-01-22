//https://dev.mysql.com/doc/refman/8.0/en/spatial-type-overview.html
//geojson spec: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2
//types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/geojson/index.d.ts

import { z } from "zod";

//geojson also has "feature" equivalents that can have "properties" but mysql dont have those
//mysql only allows 2d positions

export const zGeoJsonPos = z.tuple([z.number(), z.number()]);
export type Position = z.infer<typeof zGeoJsonPos>;

export const zGeoJsonPoint = z.object({ type: z.literal("Point"), coordinates: zGeoJsonPos });
export type Point = z.infer<typeof zGeoJsonPoint>;

export const zGeoJsonLineString = z.object({ type: z.literal("LineString"), coordinates: z.array(zGeoJsonPos) });
export type LineString = z.infer<typeof zGeoJsonLineString>;

export const zGeoJsonPolygon = z.object({ type: z.literal("Polygon"), coordinates: z.array(z.array(zGeoJsonPos)) });
export type Polygon = z.infer<typeof zGeoJsonPolygon>;

export const zGeoJsonGeometry = z.union([zGeoJsonPoint, zGeoJsonLineString, zGeoJsonPolygon]);
export type Geometry = z.infer<typeof zGeoJsonGeometry>;

export const zGeoJsonMultiPoint = z.object({ type: z.literal("MultiPoint"), coordinates: z.array(zGeoJsonPos) });
export type MultiPoint = z.infer<typeof zGeoJsonMultiPoint>;

export const zGeoJsonMultiLineString = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(zGeoJsonPos)),
});
export type MultiLineString = z.infer<typeof zGeoJsonMultiLineString>;

export const zGeoJsonMultiPolygon = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(zGeoJsonPos))),
});
export type MultiPolygon = z.infer<typeof zGeoJsonMultiPolygon>;

export const zGeoJsonGeometryCollection = z.object({
  type: z.literal("GeometryCollection"),
  geometries: z.array(zGeoJsonGeometry),
});
export type GeometryCollection = z.infer<typeof zGeoJsonGeometryCollection>;

export const schemaGeoJSON = {
  Point: zGeoJsonPoint,
  LineString: zGeoJsonLineString,
  Polygon: zGeoJsonPolygon,
  Geometry: zGeoJsonGeometry,
  MultiPoint: zGeoJsonMultiPoint,
  MultiLineString: zGeoJsonMultiLineString,
  MultiPolygon: zGeoJsonMultiPolygon,
  GeometryCollection: zGeoJsonGeometryCollection,
};

//export type Position = [x: number, y: number];

//there are only 3 "geometry" types
//export type Point = { type: "Point"; coordinates: Position };
//export type LineString = { type: "LineString"; coordinates: Position[] };
//export type Polygon = { type: "Polygon"; coordinates: Position[][] };
//and one generic that allows any of those 3
//export type Geometry = Point | LineString | Polygon;

//also corresponding "collection" types
//export type MultiPoint = { type: "MultiPoint"; coordinates: Position[] };
//export type MultiLineString = { type: "MultiLineString"; coordinates: Position[][] };
//export type MultiPolygon = { type: "MultiPolygon"; coordinates: Position[][][] };
//and one generic collection that that is not limited to a single geometry type
//export type GeometryCollection = { type: "GeometryCollection"; geometries: Geometry[] };

export type GeoJSON = {
  Point: Point;
  LineString: LineString;
  Polygon: Polygon;
  Geometry: Geometry;
  MultiPoint: MultiPoint;
  MultiLineString: MultiLineString;
  MultiPolygon: MultiPolygon;
  GeometryCollection: GeometryCollection;
};
