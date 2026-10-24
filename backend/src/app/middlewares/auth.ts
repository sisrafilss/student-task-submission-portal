import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { verifyToken } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';
import ApiError from '../errors/ApiError';

export interface IAuthUser {
  id: string;
  email: string;
  role: string;
  needsPasswordChange: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

const extractCookie = (cookieHeader: string | undefined, key: string): string | undefined => {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(^|;\\s*)${key}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
};

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let token: string | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = extractCookie(req.headers.cookie, 'accessToken');
      }

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this route');
      }

      // Verify token
      let verifiedUser: IAuthUser;
      try {
        verifiedUser = verifyToken(token, config.jwt.secret as Secret) as unknown as IAuthUser;
      } catch {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired authentication token');
      }

      // Verify user existence in database
      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
      });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User account associated with this token not found');
      }

      if (user.status === 'BLOCKED') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been blocked. Please contact support.');
      }

      // Role authorization check
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Forbidden: You do not have permission to access this resource'
        );
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        needsPasswordChange: user.needsPasswordChange,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

