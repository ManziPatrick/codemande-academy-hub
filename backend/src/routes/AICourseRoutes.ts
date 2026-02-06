import { Router } from 'express';
import { getAICourses, getAICourseBySlug } from '../controllers/AICourseController';

const router = Router();

router.get('/', getAICourses);
router.get('/:slug', getAICourseBySlug);

export default router;
