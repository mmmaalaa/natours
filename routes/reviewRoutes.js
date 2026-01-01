import { Router } from 'express';
import { authentication } from '../middlewares/authenticationMiddleware.js';
import {
  createRewiew,
  deleteReview,
  getAllReviews,
  getReview,
  getTourReviews,
  updateReview,
} from '../controllers/reviewController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createReviewValidation } from '../validation/reviewValidation.js';
import { allowTo } from '../middlewares/autherizationMiddleware.js';
import { checkOwner } from '../middlewares/checkOwner.js';
import Review from '../models/reviewModel.js';
import { userRoles } from '../models/userModel.js';


const router = Router({ mergeParams: true });
router.use(authentication);

router
  .route('/')
  .post(
    allowTo('user'),
    validate({
      body: createReviewValidation.body,
      params: createReviewValidation.params,
    }),
    createRewiew
  )
  .get(getAllReviews)
  .get(getTourReviews);
router
  .route('/:id')
  .get(getReview)
  .delete(
    allowTo(userRoles.admin, userRoles.user),
    checkOwner(Review),
    deleteReview
  )
  .patch(
    authentication,
    allowTo(userRoles.admin, userRoles.user),
    checkOwner(Review),
    updateReview
  );
export default router;
