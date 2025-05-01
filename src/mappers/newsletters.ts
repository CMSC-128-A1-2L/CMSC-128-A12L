// src/mappers/announcement.ts
import { Newsletters } from "@/entities/newsletters";
import { NewslettersDto } from "@/models/newsletters";

export function mapNewslettersDtoToNewsletter(newslettersDto: NewslettersDto): Newsletters {
    return {
        _id: newslettersDto._id?.toString(),
        title: newslettersDto.title,
        content: newslettersDto.content,
        authorId: newslettersDto.authorId,
        publishDate: newslettersDto.publishDate,
        isPinned: newslettersDto.isPinned,
        attachments: newslettersDto.attachments || [],
        tags: newslettersDto.tags,
        thumbnail: newslettersDto.thumbnail
    };
}

export function mapNewslettersToNewslettersDto(newsletters: Newsletters): NewslettersDto {
    return {
        _id: newsletters._id,
        title: newsletters.title,
        content: newsletters.content,
        authorId: newsletters.authorId,
        publishDate: newsletters.publishDate,
        isPinned: newsletters.isPinned,
        attachments: newsletters.attachments,
        tags: newsletters.tags,
        thumbnail: newsletters.thumbnail
    };
}