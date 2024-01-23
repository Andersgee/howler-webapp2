import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { zGeoJsonPoint } from "#src/db/types-geojson";
import { getGoogleReverseGeocoding } from "#src/lib/geocoding";
import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";

export const geocodeRouter = createTRPCRouter({
  fromPoint: protectedProcedure.input(z.object({ point: zGeoJsonPoint })).query(async ({ input }) => {
    const latLng = latLngLiteralFromPoint(input.point);
    return await getGoogleReverseGeocoding(latLng);
  }),
});
