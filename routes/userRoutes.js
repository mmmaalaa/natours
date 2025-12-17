import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  updateMe,
  deleteMe,
} from '../controllers/userController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
  createUserSchema,
  forgetPassSchema,
  loginSchema,
  resetPassSchema,
  updatePassSchema,
  updateUserSchema,
} from '../validation/userValidation.js';
import {
  forgetPassword,
  login,
  resetPassword,
  signUp,
  updatePassword,
} from '../controllers/authController.js';
import { authentication } from '../middlewares/authenticationMiddleware.js';

const router = Router();

router.post('/signUp', validate({ body: createUserSchema }), signUp);
router.post('/login', validate({ body: loginSchema }), login);
router.post(
  '/forget-password',
  validate({ body: forgetPassSchema }),
  forgetPassword
);
router.post(
  '/reset-password/:token',
  validate({ body: resetPassSchema }),
  resetPassword
);
router.patch(
  '/update-password',
  authentication,
  validate({ body: updatePassSchema }),
  updatePassword
);
router.patch(
  '/update-user',
  authentication,
  validate({ body: updateUserSchema }),
  updateMe
);
router.delete('/delete-user', authentication, deleteMe);
router
  .route('/')
  .get(authentication, getAllUsers)
  .post(validate({ body: createUserSchema }), createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
