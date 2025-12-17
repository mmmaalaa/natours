import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import crypto from 'crypto';
import emailEmitter from '../utils/sendEmailEvent.js';

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    return next(new AppError('User already exists', 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const token = user.createJWT();
  res.status(201).json({
    status: 'success',
    token,
    data: {
      name: user.name,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('invalid email or password', 401));
  }

  const token = user.createJWT();
  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    data: {
      token,
    },
  });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Click on the link below to reset your password: \n ${resetURL}`;
  try {
    emailEmitter.emit('sendEmail', user.email, 'Reset Password', message);
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Failed to send password reset email', 500));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Invalid token or expired', 400));
  }
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });
  const token = user.createJWT();
  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
    data: {
      token,
    },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (!(await user.comparePassword(oldPassword))) {
    return next(new AppError('Invalid old password', 401));
  }
  user.password = newPassword;
  await user.save();
  const token = user.createJWT();
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    data: {
      token,
    },
  });
});


