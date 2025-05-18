import { connectDB } from "@/databases/mongodb";
import { Opportunity } from "@/entities/opportunity";
import { mapOpportunityDtoToOpportunity, mapOpportunityToOpportunityDto } from "@/mappers/opportunity";
import { OpportunityDto, OpportunitySchema } from "@/models/opportunity";
import { Connection, Model } from "mongoose";

/**
 * A repository for managing job opportunities.
 */
export interface OpportunityRepository {
    /**
     * Creates a new opportunity in the repository.
     * 
     * @param opportunity The opportunity to create.
     * @returns A promise that resolves when the opportunity is created successfully.
     */
    createOpportunity(opportunity: Opportunity): Promise<string>;

    /**
     * Gets an opportunity by its ID.
     * 
     * @param id The MongoDB _id of the opportunity to fetch.
     * @returns A promise that resolves to either the fetched opportunity or null if not found.
     */
    getOpportunityById(id: string): Promise<Opportunity | null>;

    /**
     * Gets all opportunities created by a specific user.
     * 
     * @param userId The ID of the user whose opportunities to fetch.
     * @returns A promise that resolves to an array of opportunities.
     */
    getOpportunitiesByUserId(userId: string): Promise<Opportunity[]>;

    /**
     * Gets all opportunities in the repository.
     * 
     * @returns A promise that resolves to an array of all opportunities.
     */
    getAllOpportunities(): Promise<Opportunity[]>;

    /**
     * Updates an existing opportunity in the repository.
     * 
     * @param opportunity The opportunity to update.
     * @returns A promise that resolves when the opportunity is updated successfully.
     */
    updateOpportunity(opportunity: Opportunity): Promise<void>;

    /**
     * Deletes an opportunity from the repository.
     * 
     * @param id The ID of the opportunity to delete.
     * @returns A promise that resolves when the opportunity is deleted successfully.
     */
    deleteOpportunity(id: string): Promise<void>;

    /**
     * Deletes all opportunities created by a specific user.
     * 
     * @param userId The ID of the user whose opportunities to delete.
     * @returns A promise that resolves when all opportunities are deleted successfully.
     */
    deleteOpportunitiesByUserId(userId: string): Promise<void>;
}

class MongoDBOpportunityRepository implements OpportunityRepository {
    private connection: Connection;
    private model: Model<OpportunityDto>;

    async createOpportunity(opportunity: Opportunity): Promise<string> {
        const opportunityDto = mapOpportunityToOpportunityDto(opportunity);
        const created = await this.model.create(opportunityDto);
        return created._id.toString();
    }

    async getOpportunityById(id: string): Promise<Opportunity | null> {
        const opportunityDto = await this.model.findById(id);
        return opportunityDto ? mapOpportunityDtoToOpportunity(opportunityDto) : null;
    }

    async getOpportunitiesByUserId(userId: string): Promise<Opportunity[]> {
        const opportunityDtos = await this.model.find({ userId: userId });
        return opportunityDtos.map(mapOpportunityDtoToOpportunity);
    }

    async getAllOpportunities(): Promise<Opportunity[]> {
        const opportunityDtos = await this.model.find();
        return opportunityDtos.map(mapOpportunityDtoToOpportunity);
    }

    async updateOpportunity(opportunity: Opportunity): Promise<void> {
        const opportunityDto = mapOpportunityToOpportunityDto(opportunity);
        await this.model.findByIdAndUpdate(opportunity._id, opportunityDto);
    }

    async deleteOpportunity(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async deleteOpportunitiesByUserId(userId: string): Promise<void> {
        await this.model.deleteMany({ userId: userId });
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Opportunity"] ?? connection.model("Opportunity", OpportunitySchema, "opportunities");
    }
}

let opportunityRepository: OpportunityRepository | null = null;

export function getOpportunityRepository(): OpportunityRepository {
    if (opportunityRepository !== null) {
        return opportunityRepository;
    }

    const connection = connectDB();
    opportunityRepository = new MongoDBOpportunityRepository(connection);
    return opportunityRepository;
}