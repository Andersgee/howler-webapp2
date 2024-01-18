import * as z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { schemaPoint } from "#src/db/geojson-types";
import { getGoogleReverseGeocoding } from "#src/lib/geocoding";

export const geocodeRouter = createTRPCRouter({
  fromPoint: protectedProcedure.input(z.object({ point: schemaPoint })).query(async ({ input }) => {
    return await getGoogleReverseGeocoding({ lat: input.point.coordinates[0], lng: input.point.coordinates[1] });
  }),
});
