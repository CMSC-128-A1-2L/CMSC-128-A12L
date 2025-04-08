import { connectDB } from "@/databases/mongodb";
import { Donation } from "@/entities/donation";
import { mapDonationDtoToDonation, mapDonationToDonationDto } from "@/mappers/donation";
import { DonationDto, DonationSchema } from "@/models/donation";
import { Connection, Model } from "mongoose";

export interface DonationRepository {
    createDonation(donation: Donation): Promise<void>;

    getDonations(): Promise<Donation[]>;

    getDonationById(id: string): Promise<Donation | null>;

    getDonationsByUser(userId: string): Promise<Donation[]>;

    updateDonation(donation: Donation): Promise<void>;

    deleteDonation(id: string): Promise<void>;
};

class MongoDbDonationRepository implements DonationRepository {
    private model: Model<DonationDto>;

    async createDonation(donation: Donation): Promise<void> {
        const dto = mapDonationToDonationDto(donation);

        await this.model.create(dto);
    }

    async getDonations(): Promise<Donation[]> {
        const dtos = await this.model.find();

        return dtos.map(dto => mapDonationDtoToDonation(dto));
    }

    async getDonationById(id: string): Promise<Donation | null> {
        const dto = await this.model.findById(id);
        if (dto === null) {
            return null;
        }

        return mapDonationDtoToDonation(dto);
    }

    async getDonationsByUser(userId: string): Promise<Donation[]> {
        const dtos = await this.model.find({ userId: userId });

        return dtos.map(dto => mapDonationDtoToDonation(dto));
    }

    async updateDonation(donation: Donation): Promise<void> {
        const dto = mapDonationToDonationDto(donation);

        await this.model.updateOne({ _id: dto._id }, dto);
    }

    async deleteDonation(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id });
    }

    constructor(connection: Connection) {
        this.model = connection.models["donations"] ?? connection.model<DonationDto>("donations", DonationSchema);
    }
};

let donationRepository: DonationRepository | null = null;

export function getDonationRepository(): DonationRepository {
    if (donationRepository === null) {
        const connection = connectDB();
        donationRepository = new MongoDbDonationRepository(connection);
    }

    return donationRepository;
}
