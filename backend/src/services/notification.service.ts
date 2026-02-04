import { Server } from 'socket.io';

let io: Server;

export const initNotificationService = (socketIo: Server) => {
  io = socketIo;
};

export const sendNotification = (userId: string, data: any) => {
  if (io) {
    io.to(userId.toString()).emit('notification', data);
  }
};

export const broadcastToTeam = (userIds: string[], data: any) => {
  if (io) {
    userIds.forEach(id => {
      io.to(id.toString()).emit('notification', data);
    });
  }
};
