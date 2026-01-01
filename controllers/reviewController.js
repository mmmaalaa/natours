import Review from '../models/reviewModel.js';
import Tour from '../models/toursModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { checkExists } from '../utils/checkExists.js';
import { deleteOne, getAll, getOne, updateOne } from './factoryHandler.js';

export const createRewiew = asyncHandler(async (req, res, next) => {
  const { review, rating } = req.body;
  const tour = req.params.tourId;
  const user = req.user._id;
  await checkExists({ Model: Tour, id: tour, name: 'Tour' });
  const reviewDoc = await Review.create({
    review,
    rating: rating ? rating : undefined,
    tour,
    user,
  });
  res.status(201).json({
    status: 'success',
    data: reviewDoc,
  });
});

export const getAllReviews = getAll(Review);
export const getTourReviews = asyncHandler(async (req, res, next) => {
  const tour = req.params.tourId;
  await checkExists({ Model: Tour, id: tour, name: 'Tour' });
  const reviews = await Review.find({ tour });
  res.status(200).json({
    status: 'success',
    data: reviews,
  });
});

export const getReview = getOne(Review);

export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
