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
}


export const DonationSchema = new Schema<DonationDto>({
    eventId: { type: String },
    donationName: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Goods', 'Cash', 'Services'], required: true },
    monetaryValue: { type: Number, required: true },
    donorID: [{ type: Types.ObjectId, ref: 'Users', required: true }],
    receiveDate: { type: Date }
});
