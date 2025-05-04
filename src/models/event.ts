import { Schema, Types } from "mongoose";

export interface EventDto {
    _id?: string;
    name: string;
    organizer: string;
    description: string;
    type: string;
    location: string;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
    sponsorship?: {
        enabled: boolean;
        goal?: number;
        currentAmount?: number;
        sponsors: string[];
    };
    rsvp?: {
        enabled: boolean;
        options: ('Yes' | 'No' | 'Maybe')[];
    };
    wouldGo: string[];
    wouldNotGo: string[];
    wouldMaybeGo: string[];
}

export const EventSchema = new Schema<EventDto>({
    name: { type: String, required: true },
    organizer: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    imageUrl: { type: String, required: false },
    sponsorship: {
        type: {
            enabled: { type: Boolean, default: false },
            goal: { type: Number, default: 0 },
            currentAmount: { type: Number, default: 0 },
            sponsors: [{ type: String }]
        },
        required: false
    },
    rsvp: {
        type: {
            enabled: { type: Boolean, default: false },
            options: [{
                type: String,
                enum: ['Yes', 'No', 'Maybe']
            }]
        },
        required: false
    },
    wouldGo: [{ type: String }],
    wouldNotGo: [{ type: String }],
    wouldMaybeGo: [{ type: String }]
});