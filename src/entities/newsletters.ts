export interface Newsletters {
    _id?: string;
    tags: string;
    title: string;
    content: string;
    authorId: string;  // user who created the announcement
    publishDate: Date;
    isPinned: boolean;  // important announcements that should appear at the top
    attachments?: string[]; // optional URLs to attachments
    thumbnail?: string;
  }