import { Newsletter } from "@/entities/newsletters";
import { NewslettersDto } from "@/models/newsletters";

export function mapNewsletterDtoToNewsletter(dto: NewslettersDto): Newsletter {
    return {
        _id: dto._id?.toString(),
        title: dto.title,
        content: dto.content,
        authorId: dto.authorId,
        thumbnail: dto.thumbnail,
        publishDate: dto.publishDate,
        isPinned: dto.isPinned,
        attachments: dto.attachments,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt
    };
}

export function mapNewsletterToNewsletterDto(newsletter: Newsletter): NewslettersDto {
    return {
        _id: newsletter._id,
        title: newsletter.title,
        content: newsletter.content,
        authorId: newsletter.authorId,
        thumbnail: newsletter.thumbnail,
        publishDate: newsletter.publishDate,
        isPinned: newsletter.isPinned,
        attachments: newsletter.attachments,
        createdAt: newsletter.createdAt,
        updatedAt: newsletter.updatedAt
    };
} 