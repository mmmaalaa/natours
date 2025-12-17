import { Router } from 'express';
import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import { authentication } from '../middlewares/authenticationMiddleware.js';
import { allowTo } from '../middlewares/autherizationMiddleware.js';
import { userRoles } from '../models/userModel.js';

const router = Router();

router
  .route('/')
  .get(authentication, getAllTours)
  .post(authentication, allowTo(userRoles.admin), createTour);

router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
