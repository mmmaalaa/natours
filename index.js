import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';
import cookieParser from 'cookie-parser';
import { globalRateLimiter } from './utils/rateLimit.js';
import helmet from 'helmet';

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api', globalRateLimiter);
app.use(helmet());

app.use(express.json());
app.use(express.static(`./public`));
app.use(cookieParser());

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use((req, res, next) => {
  return next(new AppError('Page not found', 404));
});

app.use(globalErrorHandler);
export default app;
