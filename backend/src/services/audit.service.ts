import { InternshipActivityLog } from '../models/internship/ActivityLog';

export const logActivity = async (userId: string, action: string, targetType: string, targetId: string | null, details: string) => {
  try {
    const log = new InternshipActivityLog({
      userId,
      action,
      targetType,
      targetId,
      details,
    });
    await log.save();
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
