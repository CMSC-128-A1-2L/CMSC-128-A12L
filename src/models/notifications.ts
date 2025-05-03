// models/notification.ts
import { Schema, Types } from "mongoose";

// NotificationDto represents the shape of the data in the database
export interface NotificationDto {
    _id?: string;
    userId?: string; // Optional for global notifications
    type: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Notification schema for Mongoose
export const NotificationSchema = new Schema<NotificationDto>({
    userId: { type: String }, // Optional field
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});

// Add indexes for better query performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ type: 1 });
