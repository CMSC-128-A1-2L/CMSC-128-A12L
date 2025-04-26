// entities/notification.ts
export interface Notification {
  _id?: string;
  userId?: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
