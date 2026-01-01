import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

export const checkOwner = (Model, ownerField = 'user') =>
  asyncHandler(async (req, res, next) => {
    if (req.user.role === 'admin') return next();
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    const ownerId = doc[ownerField]._id
      ? doc[ownerField]._id.toString()
      : doc[ownerField].toString();

    if (ownerId !== req.user._id.toString()) {
      return next(
        new AppError('You are not allowed to perform this action', 403)
      );
    }

    next();
  });
