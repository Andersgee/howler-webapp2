import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { zGeoJsonPoint } from "#src/db/geojson-types";
import { getGoogleReverseGeocoding } from "#src/lib/geocoding";

export const geocodeRouter = createTRPCRouter({
  fromPoint: protectedProcedure.input(z.object({ point: zGeoJsonPoint })).query(async ({ input }) => {
    return await getGoogleReverseGeocoding({ lat: input.point.coordinates[0], lng: input.point.coordinates[1] });
  }),
});
