import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../backend/.env') });

const defaultDbUrl = 'postgresql://postgres:postgres@localhost:5432/student_submission_portal?schema=public';

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5002,
  database_url: process.env.DATABASE_URL || defaultDbUrl,
  database_url_unpooled: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || defaultDbUrl,
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET || 'student_portal_jwt_secret_key_2026',
    expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'student_portal_refresh_secret_key_2026',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'student_portal/avatars',
  },
};

