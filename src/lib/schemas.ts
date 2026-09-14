import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Select a category"),
  price: z.string().refine((val) => val !== "" && !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Enter a valid price",
  }),
  status: z.enum(["Draft", "Published", "Completed"]),
  eventImage: z.instanceof(File).optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  venue: z.string().min(1, "Venue is required"),
})

export type EventSchemaValues = z.infer<typeof eventSchema>
