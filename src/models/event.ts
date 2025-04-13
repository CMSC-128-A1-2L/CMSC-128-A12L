import { Schema, Types } from "mongoose";

export interface EventDto {
    _id?: string;
    name: string;
    description: string;
    type: string;
    location: string;
    startDate: Date;
    endDate: Date;
    monetaryValue: number;
    wouldGo: string[];
    wouldNotGo: string[];
    wouldMaybeGo: string[];
}

export const EventSchema = new Schema<EventDto>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    monetaryValue: { type: Number, required: true },
    wouldGo: [{ type: Types.ObjectId, ref: 'Users', required: true }],
    wouldNotGo: [{ type: Types.ObjectId, ref: 'Users', required: true }],
    wouldMaybeGo: [{ type: Types.ObjectId, ref: 'Users', required: true }]
}); 