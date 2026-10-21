import { type ErrorRequestHandler } from 'express';
import config from '../../config';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { ZodError } from 'zod';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong!';
  let errorMessages: Array<{ path: string | number; message: string }> = [];

  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errorMessages = error.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] || '',
      message: issue.message,
    }));
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;

