export interface NewsItem {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  publishDate: string;
  thumbnail: string;
  authorId: string;
  isPinned: boolean;
  attachments: string[];
}

export const dummyNewsUpdates: NewsItem[] = [
  {
    _id: "1",
    title: "Alumni Homecoming 2024: A Grand Reunion",
    content: "Join us for the most anticipated event of the year! Our annual Alumni Homecoming will take place on May 15, 2024, at the University Grand Hall. This year's theme is 'Reconnecting Roots, Building Futures.' We'll have special guest speakers, networking sessions, and a gala dinner. Don't miss this opportunity to reconnect with old friends and make new connections!",
    tags: ["Event", "Alumni", "Networking"],
    publishDate: "2024-03-01T10:00:00Z",
    thumbnail: "/assets/news/1.jpg",
    authorId: "admin1",
    isPinned: true,
    attachments: []
  },
  {
    _id: "2",
    title: "New Research Center Opens on Campus",
    content: "The university is proud to announce the opening of the new Advanced Technology Research Center. This state-of-the-art facility will focus on cutting-edge research in artificial intelligence, renewable energy, and sustainable development. The center will provide opportunities for alumni to collaborate on research projects and mentor current students.",
    tags: ["Research", "Technology", "Innovation"],
    publishDate: "2024-02-15T14:30:00Z",
    thumbnail: "/assets/news/2.jpg",
    authorId: "admin2",
    isPinned: false,
    attachments: []
  },
  {
    _id: "3",
    title: "Alumni Scholarship Program Launched",
    content: "We're excited to announce the launch of our new Alumni Scholarship Program. This initiative aims to support outstanding students who demonstrate academic excellence and leadership potential. Alumni can contribute to the program and help shape the future of our university community.",
    tags: ["Scholarship", "Education", "Support"],
    publishDate: "2024-02-01T09:15:00Z",
    thumbnail: "/assets/news/3.jpg",
    authorId: "admin3",
    isPinned: false,
    attachments: []
  },
  {
    _id: "4",
    title: "Career Development Workshop Series",
    content: "Our Career Services department is launching a new series of workshops designed specifically for alumni. Topics include resume building, interview skills, and career transitions. These workshops will be held both in-person and virtually, making them accessible to alumni worldwide.",
    tags: ["Career", "Workshop", "Development"],
    publishDate: "2024-01-20T11:45:00Z",
    thumbnail: "/assets/news/4.jpg",
    authorId: "admin4",
    isPinned: false,
    attachments: []
  }
]; 