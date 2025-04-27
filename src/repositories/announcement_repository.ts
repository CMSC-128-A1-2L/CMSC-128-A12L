import { connectDB } from "@/databases/mongodb";
import { Announcement } from "@/entities/announcements";
import { mapAnnouncementDtoToAnnouncement, mapAnnouncementToAnnouncementDto } from "@/mappers/announcement";
import { AnnouncementDto, AnnouncementSchema } from "@/models/announcements";
import { Connection, Model } from "mongoose";

/**
 * A repository for managing announcements.
 */
export interface AnnouncementRepository {
    /**
     * Creates a new announcement in the repository.
     * 
     * @param announcement The announcement to create.
     * @returns A promise that resolves with the ID of the created announcement.
     */
    createAnnouncement(announcement: Announcement): Promise<string>;

    /**
     * Gets an announcement by its ID.
     * 
     * @param id The MongoDB _id of the announcement to fetch.
     * @returns A promise that resolves to either the fetched announcement or null if not found.
     */
    getAnnouncementById(id: string): Promise<Announcement | null>;

    /**
     * Gets all announcements created by a specific user.
     * 
     * @param authorId The ID of the user whose announcements to fetch.
     * @returns A promise that resolves to an array of announcements.
     */
    getAnnouncementsByAuthorId(authorId: string): Promise<Announcement[]>;

    /**
     * Gets all announcements with specified visibility levels.
     * 
     * @param visibilities Array of visibility levels to filter by.
     * @returns A promise that resolves to an array of matching announcements.
     */
    getAnnouncementsByVisibility(visibilities: string[]): Promise<Announcement[]>;

    /**
     * Gets all announcements in the repository.
     * 
     * @returns A promise that resolves to an array of all announcements.
     */
    getAllAnnouncements(): Promise<Announcement[]>;

    /**
     * Updates an existing announcement in the repository.
     * 
     * @param announcement The announcement to update.
     * @returns A promise that resolves when the announcement is updated successfully.
     */
    updateAnnouncement(announcement: Announcement): Promise<void>;

    /**
     * Deletes an announcement from the repository.
     * 
     * @param id The ID of the announcement to delete.
     * @returns A promise that resolves when the announcement is deleted successfully.
     */
    deleteAnnouncement(id: string): Promise<void>;
}

class MongoDBAnnouncementRepository implements AnnouncementRepository {
    private connection: Connection;
    private model: Model<AnnouncementDto>;

    async createAnnouncement(announcement: Announcement): Promise<string> {
        const announcementDto = mapAnnouncementToAnnouncementDto(announcement);
        const created = await this.model.create(announcementDto);
        return created._id.toString();
    }

    async getAnnouncementById(id: string): Promise<Announcement | null> {
        const announcementDto = await this.model.findById(id);
        return announcementDto ? mapAnnouncementDtoToAnnouncement(announcementDto) : null;
    }

    async getAnnouncementsByAuthorId(authorId: string): Promise<Announcement[]> {
        const announcementDtos = await this.model.find({ authorId });
        return announcementDtos.map(mapAnnouncementDtoToAnnouncement);
    }

    async getAnnouncementsByVisibility(visibilities: string[]): Promise<Announcement[]> {
        const announcementDtos = await this.model.find({ visibility: { $in: visibilities } });
        return announcementDtos.map(mapAnnouncementDtoToAnnouncement);
    }

    async getAllAnnouncements(): Promise<Announcement[]> {
        const announcementDtos = await this.model.find();
        return announcementDtos.map(mapAnnouncementDtoToAnnouncement);
    }

    async updateAnnouncement(announcement: Announcement): Promise<void> {
        const announcementDto = mapAnnouncementToAnnouncementDto(announcement);
        await this.model.findByIdAndUpdate(announcement._id, announcementDto);
    }

    async deleteAnnouncement(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Announcement"] ?? connection.model("Announcement", AnnouncementSchema, "announcements");
    }
}

let announcementRepository: AnnouncementRepository | null = null;

export function getAnnouncementRepository(): AnnouncementRepository {
    if (announcementRepository !== null) {
        return announcementRepository;
    }

    const connection = connectDB();
    announcementRepository = new MongoDBAnnouncementRepository(connection);
    return announcementRepository;
}