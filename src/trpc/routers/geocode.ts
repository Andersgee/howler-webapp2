import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { zGeoJsonPoint } from "#src/db/types-geojson";
import {
  getGoogleReverseGeocoding,
  getGoogleReverseGeocoding2,
  getGoogleReverseGeocodingFromPlaceId,
} from "#src/lib/geocoding";
import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";

export const geocodeRouter = createTRPCRouter({
  fromPoint: protectedProcedure.input(z.object({ point: zGeoJsonPoint })).query(async ({ input }) => {
    const latLng = latLngLiteralFromPoint(input.point);
    return await getGoogleReverseGeocoding(latLng);
  }),
  fromPoint2: protectedProcedure.input(z.object({ point: zGeoJsonPoint })).query(async ({ input }) => {
    const latLng = latLngLiteralFromPoint(input.point);
    return await getGoogleReverseGeocoding2(latLng);
  }),
  fromPlaceId: protectedProcedure.input(z.object({ placeId: z.string() })).query(async ({ input }) => {
    return await getGoogleReverseGeocodingFromPlaceId(input.placeId);
  }),
});
