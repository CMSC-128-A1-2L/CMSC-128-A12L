export enum ReportStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    REJECTED = "rejected"
}

export enum ReportCategory {
    BUG = "bug",
    FEATURE_REQUEST = "feature_request",
    ACCOUNT_ISSUE = "account_issue",
    OTHER = "other"
}

export interface Report {
    _id?: string;
    userId: string;  // ID of the user who created the report
    title: string;
    description: string;
    category: ReportCategory;
    status: ReportStatus;
    adminResponse?: string;
    attachmentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
