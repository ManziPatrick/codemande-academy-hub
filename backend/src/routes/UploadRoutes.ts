import { Router } from 'express';
import multer from 'multer';
import { uploadImage, uploadFile } from '../controllers/UploadController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});

// Protect the upload route
router.post('/image', requireAuth, upload.single('image'), uploadImage);
router.post('/file', requireAuth, upload.single('file'), uploadFile);

export default router;
