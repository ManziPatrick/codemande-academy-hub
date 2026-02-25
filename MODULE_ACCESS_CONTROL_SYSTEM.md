# Module Access Control System

This document describes the implementation of strict module progression for the online learning platform.

## Backend folder structure

- `backend/src/models/ModuleAssignment.ts` – assignment submission + review status
- `backend/src/models/ModuleProgress.ts` – per-student module progression state
- `backend/src/models/ModuleAccessConfig.ts` – Auto Unlock mode config
- `backend/src/controllers/ModuleAccessController.ts` – progression logic
- `backend/src/routes/ModuleAccessRoutes.ts` – REST endpoints
- `backend/src/middleware/roles.ts` – role-based middleware helper

## Frontend folder structure

- `frontend/src/features/module-access/api.ts` – REST client
- `frontend/src/features/module-access/ModuleGuard.tsx` – navigation guard for locked modules
- `frontend/src/pages/portal/student/ModuleAccessDashboard.tsx` – student UI
- `frontend/src/pages/portal/trainer/TrainerModuleReviewPanel.tsx` – trainer review UI
- `frontend/src/pages/portal/admin/AdminModuleControlPanel.tsx` – admin manual override and Auto Unlock UI

## REST API design

Base: `/api/module-access`

### Student endpoints
- `POST /mark-lesson-complete`
  - Body: `{ courseId, moduleId, lessonId }`
- `POST /submit-assignment`
  - Body: `{ courseId, moduleId, submissionLink?, fileUrl? }`
  - Sets `status = pending`
- `GET /can-access?courseId=<id>&moduleIndex=<number>`
  - Prevents manual URL navigation to locked modules

### Trainer/Admin endpoints
- `GET /pending-assignments`
- `POST /review-assignment`
  - Body: `{ assignmentId, status: approved|rejected, feedback?, score? }`
- `POST /unlock-module`
  - Body: `{ studentId, courseId, moduleIndex }`
- `POST /lock-module`
  - Body: `{ studentId, courseId, moduleIndex }`
- `POST /force-progress`
  - Body: `{ studentId, courseId, targetModuleIndex }`
- `POST /auto-unlock-config`
  - Body: `{ courseId, autoUnlockEnabled, autoUnlockScoreThreshold }`

### Shared
- `GET /progress/:studentId?courseId=<id>`

## Database schema mapping

### Users (existing)
- `name/fullName`
- `email`
- `role`: `student | trainer | admin | super_admin`

### Courses (existing)
- `title`
- `modules[]`

### Modules (existing sub-document)
- `title`
- `lessons[]`
- `order/orderIndex`
- `assignmentRequired` derived from lesson metadata

### ModuleAssignment (new)
- `studentId`
- `courseId`
- `moduleId`
- `submissionLink`
- `fileUrl`
- `status`: `pending | approved | rejected`
- `feedback`
- `score`
- `approvedBy`
- `approvedAt`
- `submittedAt`

### ModuleProgress (new)
- `studentId`
- `courseId`
- `currentModuleIndex`
- `completedLessons[]`
- `unlockedModules[]`
- `overrideUnlockedModules[]`
- `assignmentSubmissionDates`
- `approvalDates`
- `approvedByMap`

### ModuleAccessConfig (new)
- `courseId`
- `autoUnlockEnabled`
- `autoUnlockScoreThreshold`

## Progression logic

1. First module is unlocked by default.
2. Student completes required lessons.
3. Student submits assignment -> `pending`.
4. Trainer/Admin reviews:
   - `approved`: unlock next module (or apply auto-unlock score threshold when enabled)
   - `rejected`: keep locked, student resubmits.
5. Admin/Trainer can manually unlock/lock/force-progress.

## Navigation protection

`ModuleGuard` checks `/can-access` before rendering module content.

On denied access:
- redirects to previous module
- shows message: `Complete your assignment to unlock this module.`

## Example UI mock structure

### Student Dashboard
- Header + progress bar
- Module list with lock/unlock icons
- Assignment submission form
- Status badges (Pending, Approved, Rejected)

### Trainer Review Panel
- Pending submissions list
- Open submission link
- Score + feedback
- Approve / Reject buttons

### Admin Control Panel
- Manual unlock / lock controls
- Force-progress controls
- Auto Unlock mode toggle + threshold input

## Security

- JWT middleware (`authMiddleware`, `requireAuth`)
- Role guards (`requireRoles`)
- Students cannot access admin/trainer actions
- Server enforces lock rules even if frontend is bypassed

