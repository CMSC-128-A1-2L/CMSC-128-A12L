import { Schema } from "mongoose";
import { ApplicationStatus } from "@/entities/application";

export interface ApplicationDto {
    _id?: string;
    userId: string;
    jobId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    updatedAt?: Date;
    coverLetter?: string;
    resumeUrl?: string;
    fullName: string;
    email: string;
    phone: string;
    portfolio?: string;
}

export const ApplicationSchema = new Schema<ApplicationDto>({
    userId: { type: String, required: true },
    jobId: { type: String, required: true },
    status: { 
        type: String, 
        enum: Object.values(ApplicationStatus), 
        required: true,
        default: ApplicationStatus.PENDING
    },
    appliedAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date },
    coverLetter: { type: String },
    resumeUrl: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    portfolio: { type: String }
}, {
    timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' }
});

// Add indexes for better query performance
ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true }); // One application per job per user
ApplicationSchema.index({ jobId: 1 }); // For querying applications by job
ApplicationSchema.index({ userId: 1 }); // For querying user's applications