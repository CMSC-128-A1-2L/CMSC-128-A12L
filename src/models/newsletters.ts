import { Schema, Types } from "mongoose";


export interface NewslettersDto {
    _id?: string;
    tags?: string;
    title: string;
    content: string;
    authorId: string;  // user who created the announcement
    publishDate: Date;
    isPinned: boolean;  // important announcements that should appear at the top
    attachments?: string[]; // optional URLs to attachments
    thumbnail?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const NewslettersSchema = new Schema<NewslettersDto>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  thumbnail: {type: String },
  tags: { type: String, default: '' },
  publishDate: { type: Date, required: true, default: Date.now },
  isPinned: { type: Boolean, required: true, default: false },
  attachments: [{ type: String, required: false }]
}, {
  timestamps: true,
});