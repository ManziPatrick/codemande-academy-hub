import { pusher } from '../lib/pusher';

export const sendNotification = async (userId: string, data: any) => {
  try {
    await pusher.trigger(`user-${userId}`, 'notification', data);
  } catch (error) {
    console.error('Pusher notification error:', error);
  }
};

export const broadcastToTeam = async (userIds: string[], data: any) => {
  // Pusher has a limit on batch triggers, but loop is fine for small teams
  for (const id of userIds) {
    try {
      await pusher.trigger(`user-${id}`, 'notification', data);
    } catch (error) {
      console.error(`Pusher broadcast error for user ${id}:`, error);
    }
  }
};
