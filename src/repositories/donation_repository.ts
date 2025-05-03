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

    /**
     * Creates or updates an event sponsorship.
     * @param eventId The ID of the event being sponsored
     * @param sponsorshipData The sponsorship details including goal amount
     * @returns A promise that resolves to the sponsorship ID
     */
    createEventSponsorship(eventId: string, sponsorshipData: Donation): Promise<string>;

    /**
     * Gets sponsorship details for an event
     * @param eventId The ID of the event
     * @returns A promise that resolves to the sponsorship details or null if not found
     */
    getEventSponsorship(eventId: string): Promise<Donation | null>;

    /**
     * Adds a sponsorship contribution to an event
     * @param eventId The ID of the event
     * @param contribution The contribution details including amount and donor
     * @returns A promise that resolves when the contribution is added
     */
    addSponsorshipContribution(eventId: string, contribution: Donation): Promise<void>;
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

    async createEventSponsorship(eventId: string, sponsorshipData: Donation): Promise<string> {
        const sponsorshipDto = mapDonationToDonationDto({
            ...sponsorshipData,
            eventId,
            isEventSponsorship: true,
            currentAmount: 0
        });
        const created = await this.model.create(sponsorshipDto);
        return created._id.toString();
    }

    async getEventSponsorship(eventId: string): Promise<Donation | null> {
        const sponsorshipDto = await this.model.findOne({ 
            eventId, 
            isEventSponsorship: true 
        });
        return sponsorshipDto ? mapDonationDtoToDonation(sponsorshipDto) : null;
    }

    async addSponsorshipContribution(eventId: string, contribution: Donation): Promise<void> {
        const sponsorship = await this.model.findOne({ 
            eventId, 
            isEventSponsorship: true 
        });

        if (!sponsorship) {
            throw new Error('Sponsorship not found for this event');
        }

        // Update the current amount
        const newAmount = (sponsorship.currentAmount || 0) + contribution.monetaryValue;
        await this.model.findByIdAndUpdate(sponsorship._id, {
            $set: { currentAmount: newAmount }
        });

        // Create the contribution record
        const contributionDto = mapDonationToDonationDto({
            ...contribution,
            eventId,
            isEventSponsorship: false
        });
        await this.model.create(contributionDto);
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