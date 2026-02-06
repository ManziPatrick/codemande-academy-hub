import { Router } from 'express';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/TeamController';
import { authMiddleware, requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route - no auth required
router.get('/', getTeamMembers);

// Protected routes - require admin
router.post('/', authMiddleware, requireAuth, requireAdmin, createTeamMember);
router.put('/:id', authMiddleware, requireAuth, requireAdmin, updateTeamMember);
router.delete('/:id', authMiddleware, requireAuth, requireAdmin, deleteTeamMember);

export default router;
