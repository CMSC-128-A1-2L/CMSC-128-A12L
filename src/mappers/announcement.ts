// src/mappers/announcement.ts
import { Announcement } from "@/entities/announcements";
import { AnnouncementDto } from "@/models/announcements";

export function mapAnnouncementDtoToAnnouncement(announcementDto: AnnouncementDto): Announcement {
    return {
        _id: announcementDto._id?.toString(),
        title: announcementDto.title,
        content: announcementDto.content,
        authorId: announcementDto.authorId,
        publishDate: announcementDto.publishDate,
        visibility: announcementDto.visibility,
        isPinned: announcementDto.isPinned,
        attachments: announcementDto.attachments || []
    };
}

export function mapAnnouncementToAnnouncementDto(announcement: Announcement): AnnouncementDto {
    return {
        _id: announcement._id,
        title: announcement.title,
        content: announcement.content,
        authorId: announcement.authorId,
        publishDate: announcement.publishDate,
        visibility: announcement.visibility,
        isPinned: announcement.isPinned,
        attachments: announcement.attachments
    };
}