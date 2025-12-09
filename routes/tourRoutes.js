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

const router = Router();

router.route('/').get(getAllTours).post(createTour);

router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
