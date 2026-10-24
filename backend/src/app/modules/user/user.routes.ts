import { Router } from 'express';
import multer from 'multer';
import httpStatus from 'http-status';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import ApiError from '../../errors/ApiError';
import { UserController } from './user.controller';
import { updateUserProfileValidationSchema } from './user.validation';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.'
        )
      );
    }
  },
});

const router = Router();

router.get('/me', auth(), UserController.getMe);
router.patch(
  '/profile',
  auth(),
  validateRequest(updateUserProfileValidationSchema),
  UserController.updateProfile
);
router.post('/avatar', auth(), upload.single('avatar'), UserController.updateAvatar);

export const UserRoutes = router;

