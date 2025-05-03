// entities/notification.ts
export interface Notification {
  _id?: string;
  userId?: string; // Optional for global notifications
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
