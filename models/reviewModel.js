import { model, Schema } from 'mongoose';
import Tour from './toursModel.js';

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [
        true,
        'Review must belong to a tour. Please provide a tour id',
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [
        true,
        'Review must belong to a user. Please provide a user id',
      ],
    },
  },
  {
    timestamps: true,
  }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: '-__v -password',
  });
});

reviewSchema.statics.calcAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', async function () {
  await this.constructor.calcAvgRating(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAvgRating(doc.tour);
  }
});
const Review = model('Review', reviewSchema);

export default Review;
