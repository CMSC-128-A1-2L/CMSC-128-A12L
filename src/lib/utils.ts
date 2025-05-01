import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getNotificationRepository } from "@/repositories/notifications_repository"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createApplicationNotification(userId: string, jobId: string, title: string, message: string) {
  const notificationRepo = getNotificationRepository();
  await notificationRepo.createNotification({
    _id: '', // will be set by MongoDB
    userId,
    title,
    message,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      jobId
    }
  });
}