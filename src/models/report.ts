import { Schema } from 'mongoose';
import { ReportCategory, ReportStatus } from '@/entities/report';

export interface ReportDto {
    _id: string;
    userId: string;
    title: string;
    description: string;
    category: ReportCategory;
    status: ReportStatus;
    adminResponse?: string;
    attachmentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const ReportSchema = new Schema<ReportDto>({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: Object.values(ReportCategory)
    },
    status: { 
        type: String, 
        required: true,
        enum: Object.values(ReportStatus),
        default: ReportStatus.PENDING
    },
    adminResponse: { type: String },
    attachmentUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
