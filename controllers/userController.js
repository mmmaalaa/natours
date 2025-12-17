import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
export const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const updateMe = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

export const deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
