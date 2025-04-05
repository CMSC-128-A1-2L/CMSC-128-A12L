import { Schema } from "mongoose";

export interface OpportunityDto {
    _id?: string;
    userId: string;
    title: string;
    description: string;
    position: string;
    company: string;
    location: string;
    tags: string[];
    workMode: string;
}

export const OpportunitySchema = new Schema<OpportunityDto>({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    tags: { type: [String], required: true },
    workMode: { type: String, required: true }
}); 