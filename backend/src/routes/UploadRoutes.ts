import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/UploadController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Protect the upload route
router.post('/image', requireAuth, upload.single('image'), uploadImage);

export default router;
