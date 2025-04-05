import mongoose, { Schema, Document } from 'mongoose';

export interface LogsDto {
    _id?: string;
    imageUrl?: string;
    name: string;
    action: string;
    status?: string;
    timestamp: Date;
    ipAddress?: string;
}

export const LogSchema: Schema = new Schema<LogsDto>({
  imageUrl: { type: String },
  name: { type: String, required: true },
  action: { type: String, required: true },
  status: { type: String },
  timestamp: { type: Date, required: true, default: Date.now },
  ipAddress: { type: String },
});

