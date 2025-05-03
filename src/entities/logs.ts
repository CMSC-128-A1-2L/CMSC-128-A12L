export interface Logs {
    _id?: string;
    userId?: string;  // Add userId field
    imageUrl?: string;
    name: string;
    action: string;
    status?: string;
    timestamp: Date;
    ipAddress?: string;
}