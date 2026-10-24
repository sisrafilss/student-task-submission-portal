import bcrypt from 'bcrypt';
import config from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = config.bcrypt_salt_rounds || 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

