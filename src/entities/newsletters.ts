export interface Newsletter {
    _id?: string;
    title: string;
    content: string;
    authorId: string;
    thumbnail?: string;
    publishDate: Date;
    isPinned: boolean;
    attachments?: string[];
    tags: string;
    createdAt?: Date;
    updatedAt?: Date;
} 