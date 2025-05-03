import { Schema, Types } from "mongoose";

export enum AnnouncementVisibility {
  ALUMNI = "alumni", // the admins should still be able to see these
  ADMIN = "admin",
  ALL = "all"
}

export interface AnnouncementDto {
  _id?: string;
  title: string;
  content: string;
  authorId: string;  // admin/user who created the announcement
  publishDate: Date;
  visibility: string;
  isPinned: boolean;  // important announcements that should appear at the top
  attachments?: string[]; // optional URLs to attachments
}

export const AnnouncementSchema = new Schema<AnnouncementDto>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  publishDate: { type: Date, required: true, default: Date.now },
  visibility: { type: String, enum: Object.values(AnnouncementVisibility), required: true },
  isPinned: { type: Boolean, required: true, default: false },
  attachments: [{ type: String, required: false }]
}, {
  timestamps: true,
});