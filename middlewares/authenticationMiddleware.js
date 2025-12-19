import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
export const authentication = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new AppError('You are not logged in', 401));
  }

  const { id, iat } = jwt.verify(accessToken, process.env.JWT_SECRET);
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (user.changePasswordAfter(iat)) {
    return next(new AppError('Please login again', 401));
  }
  req.user = user;
  next();
});
