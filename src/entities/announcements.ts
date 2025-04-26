export interface Announcement {
    _id?: string;
    title: string;
    content: string;
    authorId: string;  // admin/user who created the announcement
    publishDate: Date;
    visibility: string;
    isPinned: boolean;  // important announcements that should appear at the top
    attachments?: string[]; // optional URLs to attachments
  }