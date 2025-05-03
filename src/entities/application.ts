export enum ApplicationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export interface Application {
    _id?: string;
    userId: string;
    jobId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    coverLetter?: string;
    resumeUrl?: string;
    fullName: string;
    email: string;
    phone: string;
    portfolio?: string;
    updatedAt?: Date;
}