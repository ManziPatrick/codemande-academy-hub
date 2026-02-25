import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRoles } from '../middleware/roles';
import {
  canAccessModule,
  forceProgress,
  getPendingAssignments,
  getProgress,
  lockModule,
  markLessonComplete,
  reviewAssignment,
  submitAssignment,
  unlockModule,
  updateAutoUnlockConfig
} from '../controllers/ModuleAccessController';

const router = Router();

/**
 * Student workflow
 */
router.post('/mark-lesson-complete', requireAuth, requireRoles('student'), markLessonComplete);
router.post('/submit-assignment', requireAuth, requireRoles('student'), submitAssignment);
router.get('/can-access', requireAuth, requireRoles('student'), canAccessModule);

/**
 * Trainer/Admin workflow
 */
router.get('/pending-assignments', requireAuth, requireRoles('trainer', 'admin', 'super_admin'), getPendingAssignments);
router.post('/review-assignment', requireAuth, requireRoles('trainer', 'admin', 'super_admin'), reviewAssignment);
router.post('/unlock-module', requireAuth, requireRoles('trainer', 'admin', 'super_admin'), unlockModule);
router.post('/lock-module', requireAuth, requireRoles('trainer', 'admin', 'super_admin'), lockModule);
router.post('/force-progress', requireAuth, requireRoles('trainer', 'admin', 'super_admin'), forceProgress);
router.post('/auto-unlock-config', requireAuth, requireRoles('trainer', 'admin', 'super_admin'), updateAutoUnlockConfig);

/**
 * Shared
 */
router.get('/progress/:studentId', requireAuth, getProgress);

export default router;
