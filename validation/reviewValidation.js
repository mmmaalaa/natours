import { z } from 'zod';
import { zObjectId } from '../middlewares/validationMiddleware.js';
import { requiredFields } from '../utils/zodHelper.js';

export const createReviewValidation = {
  body: z
    .object({
      review: z
        .string({
          error: (issue) => requiredFields(issue, 'Review'),
        })
        .min(1, 'Review can not be empty'),
      rating: z
        .number()
        .min(1, 'Rating must be above 1.0')
        .max(5, 'Rating must be below 5.0')
        .optional(),
    })
    .strict(),
  params: z
    .object({
      tourId: zObjectId,
    })
    .strict(),
};
