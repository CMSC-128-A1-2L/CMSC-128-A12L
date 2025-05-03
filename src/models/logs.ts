import mongoose, { Schema, Document } from 'mongoose';

export interface LogsDto {
    _id?: string;
    userId?: string;  // Add userId field
    imageUrl?: string;
    name: string;
    action: string;
    status?: string;
    timestamp: Date;
    ipAddress?: string;
}

export const LogSchema: Schema = new Schema<LogsDto>({
    userId: { type: String },  // Add userId field
    imageUrl: { type: String },
    name: { type: String, required: true },
    action: { type: String, required: true },
    status: { type: String },
    timestamp: { type: Date, required: true, default: Date.now },
    ipAddress: { type: String },
});

// Add index for better query performance
LogSchema.index({ userId: 1 });

