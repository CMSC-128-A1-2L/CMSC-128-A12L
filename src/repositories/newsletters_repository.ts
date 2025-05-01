import { connectDB } from "@/databases/mongodb";
import { Newsletter } from "@/entities/newsletters";
import { mapNewsletterDtoToNewsletter, mapNewsletterToNewsletterDto } from "@/mappers/newsletter";
import { NewslettersDto, NewslettersSchema } from "@/models/newsletters";
import { Connection, Model } from "mongoose";

/**
 * A repository for managing newsletters.
 */
export interface NewsletterRepository {
    /**
     * Creates a new newsletter in the repository.
     * 
     * @param newsletter The newsletter to create.
     * @returns A promise that resolves with the ID of the created newsletter.
     */
    createNewsletter(newsletter: Newsletter): Promise<string>;

    /**
     * Gets a newsletter by its ID.
     * 
     * @param id The MongoDB _id of the newsletter to fetch.
     * @returns A promise that resolves to either the fetched newsletter or null if not found.
     */
    getNewsletterById(id: string): Promise<Newsletter | null>;

    /**
     * Gets all newsletters created by a specific user.
     * 
     * @param authorId The ID of the user whose newsletters to fetch.
     * @returns A promise that resolves to an array of newsletters.
     */
    getNewslettersByAuthorId(authorId: string): Promise<Newsletter[]>;

    /**
     * Gets all newsletters in the repository, sorted by publish date (newest first).
     * 
     * @returns A promise that resolves to an array of all newsletters.
     */
    getAllNewsletters(): Promise<Newsletter[]>;

    /**
     * Gets pinned newsletters.
     * 
     * @returns A promise that resolves to an array of pinned newsletters.
     */
    getPinnedNewsletters(): Promise<Newsletter[]>;

    /**
     * Updates an existing newsletter in the repository.
     * 
     * @param newsletter The newsletter to update.
     * @returns A promise that resolves when the newsletter is updated successfully.
     */
    updateNewsletter(newsletter: Newsletter): Promise<void>;

    /**
     * Deletes a newsletter from the repository.
     * 
     * @param id The ID of the newsletter to delete.
     * @returns A promise that resolves when the newsletter is deleted successfully.
     */
    deleteNewsletter(id: string): Promise<void>;

    /**
     * Searches newsletters by title or content.
     * 
     * @param query The search query.
     * @returns A promise that resolves to an array of matching newsletters.
     */
    searchNewsletters(query: string): Promise<Newsletter[]>;
}

class MongoDBNewsletterRepository implements NewsletterRepository {
    private connection: Connection;
    private model: Model<NewslettersDto>;

    async createNewsletter(newsletter: Newsletter): Promise<string> {
        const newsletterDto = mapNewsletterToNewsletterDto(newsletter);
        const created = await this.model.create(newsletterDto);
        return created._id.toString();
    }

    async getNewsletterById(id: string): Promise<Newsletter | null> {
        const newsletterDto = await this.model.findById(id);
        return newsletterDto ? mapNewsletterDtoToNewsletter(newsletterDto) : null;
    }

    async getNewslettersByAuthorId(authorId: string): Promise<Newsletter[]> {
        const newsletterDtos = await this.model.find({ authorId }).sort({ publishDate: -1 });
        return newsletterDtos.map(mapNewsletterDtoToNewsletter);
    }

    async getAllNewsletters(): Promise<Newsletter[]> {
        const newsletterDtos = await this.model.find().sort({ publishDate: -1 });
        return newsletterDtos.map(mapNewsletterDtoToNewsletter);
    }

    async getPinnedNewsletters(): Promise<Newsletter[]> {
        const newsletterDtos = await this.model.find({ isPinned: true }).sort({ publishDate: -1 });
        return newsletterDtos.map(mapNewsletterDtoToNewsletter);
    }

    async updateNewsletter(newsletter: Newsletter): Promise<void> {
        const newsletterDto = mapNewsletterToNewsletterDto(newsletter);
        await this.model.findByIdAndUpdate(newsletter._id, newsletterDto);
    }

    async deleteNewsletter(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async searchNewsletters(query: string): Promise<Newsletter[]> {
        const newsletterDtos = await this.model.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        }).sort({ publishDate: -1 });
        return newsletterDtos.map(mapNewsletterDtoToNewsletter);
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Newsletter"] ?? connection.model("Newsletter", NewslettersSchema, "newsletters");
    }
}

let newsletterRepository: NewsletterRepository | null = null;

export function getNewsletterRepository(): NewsletterRepository {
    if (newsletterRepository !== null) {
        return newsletterRepository;
    }

    const connection = connectDB();
    newsletterRepository = new MongoDBNewsletterRepository(connection);
    return newsletterRepository;
}