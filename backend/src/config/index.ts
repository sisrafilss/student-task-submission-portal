import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5002,
  database_url: process.env.DATABASE_URL,
  database_url_unpooled: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET || 'student_portal_jwt_secret_key_2026',
    expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  },
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
};

