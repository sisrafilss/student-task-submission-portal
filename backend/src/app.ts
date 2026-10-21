import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

// Middlewares & Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Student Submission Portal Backend API is running successfully!',
  });
});

// Application Routes
app.use('/api/v1', router);

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Your requested path was not found!',
      },
    ],
  });
});

export default app;

