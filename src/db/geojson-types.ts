//https://dev.mysql.com/doc/refman/8.0/en/spatial-type-overview.html
//geojson spec: https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.2
//types: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/geojson/index.d.ts

//geojson also has "feature" equivalents that can have "properties" but mysql dont have those
//mysql only allows 2d positions

export type Position = [x: number, y: number];

//there are only 3 "geometry" types
export type Point = { type: "Point"; coordinates: Position };
export type LineString = { type: "LineString"; coordinates: Position[] };
export type Polygon = { type: "Polygon"; coordinates: Position[][] };
//and one generic that allows any of those 3
export type Geometry = Point | LineString | Polygon;

//also corresponding "collection" types
export type MultiPoint = { type: "MultiPoint"; coordinates: Position[] };
export type MultiLineString = { type: "MultiLineString"; coordinates: Position[][] };
export type MultiPolygon = { type: "MultiPolygon"; coordinates: Position[][][] };
//and one generic collection that that is not limited to a single geometry type
export type GeometryCollection = { type: "GeometryCollection"; geometries: Geometry[] };

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
