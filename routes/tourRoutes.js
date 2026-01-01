import { Router } from 'express';
import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} from '../controllers/tourController.js';
import { authentication } from '../middlewares/authenticationMiddleware.js';
import { allowTo } from '../middlewares/autherizationMiddleware.js';
import { userRoles } from '../models/userModel.js';
import reviewRoutes from './reviewRoutes.js';

const router = Router({ mergeParams: true });
router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/')
  .get(authentication, getAllTours)
  .post(
    authentication,
    allowTo(userRoles.admin, userRoles.leadGuide),
    createTour
  );

router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(authentication, allowTo(userRoles.admin, userRoles.leadGuide),getMonthlyPlan);

router
  .route('/:id')
  .get(authentication, getTour)
  .patch(authentication, allowTo(userRoles.admin, userRoles.leadGuide), updateTour)
  .delete(authentication, allowTo(userRoles.admin, userRoles.leadGuide), deleteTour);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);
export default router;
