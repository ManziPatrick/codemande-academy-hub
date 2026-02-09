import { pusher } from '../lib/pusher';
import Notification from '../models/Notification';

export const sendNotification = async (userId: string, data: {
  type: string;
  title: string;
  message: string;
  link?: string;
  [key: string]: any;
}) => {
  try {
    // Save to database
    const notification = await Notification.create({
      userId,
      ...data,
      read: false
    });

    // Send via Pusher (including the ID for interaction)
    await pusher.trigger(`user-${userId}`, 'notification', {
      id: notification._id,
      ...data,
      userId,
      read: false,
      createdAt: notification.createdAt
    });

    return notification;
  } catch (error) {
    console.error('Pusher notification error:', error);
    return null;
  }
};

export const broadcastToTeam = async (userIds: string[], data: {
  type: string;
  title: string;
  message: string;
  link?: string
}) => {
  const notifications = [];
  for (const id of userIds) {
    const notify = await sendNotification(id, data);
    if (notify) notifications.push(notify);
  }
  return notifications;
};
