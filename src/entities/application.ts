export enum ApplicationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn"
}

export interface Application {
    _id?: string;
    userId: string;
    jobId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    updatedAt?: Date;
    coverLetter?: string;
    resumeUrl?: string;
}