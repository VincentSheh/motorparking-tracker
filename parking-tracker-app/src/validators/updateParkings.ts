import { z } from "zod";

export const updateParkingSchema = z.object({
  parkingId: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  maxSpace: z.number().optional(),
  polygons: z.string().optional()
});
