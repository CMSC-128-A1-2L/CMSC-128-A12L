import { Schema, Types } from 'mongoose';

// -- Implemented by Caleb Castro

export type DonationType = 'Goods' | 'Cash' | 'Services';

export interface DonationDto {
    _id?: string;
    eventId?: string;
    donationName: string;
    description: string;
    type: DonationType;
    monetaryValue: number;
    donorID: string[];
    receiveDate?: Date;
    sponsorshipGoal?: number;
    currentAmount?: number;
    isEventSponsorship?: boolean;
    status?: 'SUCCESS' | 'FAIL';
}

export const DonationSchema = new Schema<DonationDto>({
    eventId: { type: String },
    donationName: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Goods', 'Cash', 'Services'], required: true },
    monetaryValue: { type: Number, required: true },
    donorID: [{ type: Types.ObjectId, ref: 'Users', required: true }],
    receiveDate: { type: Date },
    sponsorshipGoal: { type: Number },
    currentAmount: { type: Number, default: 0 },
    isEventSponsorship: { type: Boolean, default: false },
    status: { type: String, enum: ['SUCCESS', 'FAIL'], default: 'FAIL' }
});
