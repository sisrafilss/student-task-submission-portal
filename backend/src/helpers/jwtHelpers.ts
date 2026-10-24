import crypto from 'crypto';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(
    {
      ...payload,
      jti: payload.jti || crypto.randomUUID(),
    },
    secret,
    {
      expiresIn: expireTime,
    } as SignOptions
  );
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
