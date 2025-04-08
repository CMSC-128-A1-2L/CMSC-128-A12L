import { Schema, Types } from 'mongoose';

export enum DonationPaymentMethodDto {
    NONE = 0,
    PAYMAYA = 1,
    STRIPE = 2,
};

export interface DonationDto {
    _id: Types.ObjectId;
    paymentMethod: DonationPaymentMethodDto;
    userId: string;
    price: number;
    referenceNumber: string;
    createdAt: Date;
    completedAt: Date;
    updatedAt: Date;
};

export const DonationSchema = new Schema<DonationDto>(
    {
        paymentMethod: { type: Number, required: true },
        userId: { type: String, required: true },
        price: { type: Number, required: true },
        referenceNumber: { type: String, required: true },
        completedAt: { type: Date, required: true },
    },
    {
        timestamps: true
    }
);
