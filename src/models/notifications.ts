// models/notification.ts
import { Schema, Types } from "mongoose";

// NotificationDto represents the shape of the data in the database
export interface NotificationDto {
    _id?: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Notification schema for Mongoose
export const NotificationSchema = new Schema<NotificationDto>({
    userId: { type: Types.ObjectId, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, required: false },
    isRead: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});
