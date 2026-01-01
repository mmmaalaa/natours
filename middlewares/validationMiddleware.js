import mongoose from 'mongoose';
import { z } from 'zod';

export const validate = (schemas = {}) => {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      next();
    } catch (err) {
      const errors = [];
      if (err.issues) {
        errors.push(...err.issues.map((e) => e.message));
      }
      return res.status(400).json({
        status: 'fail',
        errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
    }
  };
};
export const zObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId',
  });
