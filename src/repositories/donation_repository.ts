import { connectDB } from "@/databases/mongodb";
import { Donation } from "@/entities/donation";
import { mapDonationDtoToDonation, mapDonationToDonationDto } from "@/mappers/donation";
import { DonationDto, DonationSchema } from "@/models/donation";
import { Connection, Model } from "mongoose";

// -- Implemented by Caleb Castro

/**
 * A repository for managing donations.
 */
export interface DonationRepository {
    /**
     * Creates a donation in the repository.
     * 
     * @param donation The event to create.
     * @returns A promise that resolves when the event is created successfully.
     */
    createDonation(donation: Donation): Promise<string>;

    /**
     * Gets a donation by its ID.
     * 
     * @param id The MongoDB _id of the education (school) to fetch.
     * @returns A promise that resolves to either the fetched school or institution or null if not found.
     */
    getDonationById(id: string): Promise<Donation | null>;

    /**
     * Gets all donations in the repository.
     * 
     * @returns A promise that resolves to an array of all education (school or institution).
     */
    getAllDonations(): Promise<Donation[]>;

    /**
     * Updates a donation in the repository.
     * 
     * @param donation The school or institution to update.
     * @returns A promise that resolves when the school or institution is updated successfully.
     */
    updateDonation(donation: Donation): Promise<void>;

    /**
     * Deletes a donation from the repository.
     * 
     * @param id The ID of the school or institution to delete.
     * @returns A promise that resolves when the school or institution is deleted successfully.
     */
    deleteDonation(id: string): Promise<void>;
}

class MongoDBDonationRepository implements DonationRepository {
    private connection: Connection;
    private model: Model<DonationDto>;

    async createDonation(donation: Donation): Promise<string> {
        const donationDto = mapDonationToDonationDto(donation);
        const created = await this.model.create(donationDto);
        return created._id.toString();
    }

    async getDonationById(id: string): Promise<Donation | null> {
        const donationDto = await this.model.findById(id);
        return donationDto ? mapDonationDtoToDonation(donationDto) : null;
    }

    async getAllDonations(): Promise<Donation[]> {
        const donationDto = await this.model.find();
        return donationDto.map(mapDonationDtoToDonation);
    }

    async updateDonation(donation: Donation): Promise<void> {
        const donationDto = mapDonationToDonationDto(donation);
        await this.model.findByIdAndUpdate(donation._id, donationDto);
    }

    async deleteDonation(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Donation"] ?? connection.model("Donation", DonationSchema, "donations");    //not sure if tama yung connection -- Caleb
    }
}

let donationRepository: DonationRepository | null = null;

export function getEducationRepository(): DonationRepository {
    if (donationRepository !== null) {
        return donationRepository;
    }

    const connection = connectDB();
    donationRepository = new MongoDBDonationRepository(connection);
    return donationRepository;
} 