//https://dev.mysql.com/doc/refman/8.0/en/spatial-type-overview.html
//geojson spec: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2
//types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/geojson/index.d.ts

import { z } from "zod";

//geojson also has "feature" equivalents that can have "properties" but mysql dont have those
//mysql only allows 2d positions

export const schemaPosition = z.tuple([z.number(), z.number()]);
export type Position = z.infer<typeof schemaPosition>;

export const schemaPoint = z.object({ type: z.literal("Point"), coordinates: schemaPosition });
export type Point = z.infer<typeof schemaPoint>;

export const schemaLineString = z.object({ type: z.literal("LineString"), coordinates: z.array(schemaPosition) });
export type LineString = z.infer<typeof schemaLineString>;

export const schemaPolygon = z.object({ type: z.literal("Polygon"), coordinates: z.array(z.array(schemaPosition)) });
export type Polygon = z.infer<typeof schemaPolygon>;

export const schemaGeometry = z.union([schemaPoint, schemaLineString, schemaPolygon]);
export type Geometry = z.infer<typeof schemaGeometry>;

export const schemaMultiPoint = z.object({ type: z.literal("MultiPoint"), coordinates: z.array(schemaPosition) });
export type MultiPoint = z.infer<typeof schemaMultiPoint>;
const schemaMultiLineString = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(schemaPosition)),
});
export type MultiLineString = z.infer<typeof schemaMultiLineString>;
export const schemaMultiPolygon = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(schemaPosition))),
});
export type MultiPolygon = z.infer<typeof schemaMultiPolygon>;

export const schemaGeometryCollection = z.object({
  type: z.literal("GeometryCollection"),
  geometries: z.array(schemaGeometry),
});
export type GeometryCollection = z.infer<typeof schemaGeometryCollection>;

export const schemaGeoJSON = {
  Point: schemaPoint,
  LineString: schemaLineString,
  Polygon: schemaPolygon,
  Geometry: schemaGeometry,
  MultiPoint: schemaMultiPoint,
  MultiLineString: schemaMultiLineString,
  MultiPolygon: schemaMultiPolygon,
  GeometryCollection: schemaGeometryCollection,
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
