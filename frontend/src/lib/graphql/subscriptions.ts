import { gql } from "@apollo/client";

export const MESSAGE_ADDED = gql`
  subscription OnMessageAdded($conversationId: ID!) {
    messageAdded(conversationId: $conversationId) {
      id
      content
      conversationId
      sender {
        id
        username
      }
      createdAt
    }
  }
`;

export const NOTIFICATION_ADDED = gql`
  subscription OnNotificationAdded($userId: ID!) {
    notificationAdded(userId: $userId) {
      id
      userId
      type
      title
      message
      read
      createdAt
    }
  }
`;
