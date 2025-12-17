import {z} from "zod";

const crateTourSchema = z.object({
    name: z.string().min(3).max(40),
    slug: z.string(),
    price: z.number().positive(),
    ratingsAverage: z.number().min(1).max(5),
    ratingsQuantity: z.number(),
    duration: z.number(),
    maxGroupSize: z.number(),
    difficulty: z.string(),
    priceDiscount: z.number(),
    summary: z.string(),
    description: z.string(),
    imageCover: z.string(),
    images: z.array(z.string()),
    startDates: z.array(z.date()),
    secretTour: z.boolean(),
})