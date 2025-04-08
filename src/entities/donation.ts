export enum DonationPaymentMethod {
    NONE,
    PAYMAYA = "paymaya",
    STRIPE = "stripe",
};

/**
 * A donation made by the user.
 **/
export interface Donation {
    id: string;
    paymentMethod: DonationPaymentMethod;
    userId: string;
    price: number;
    referenceNumber: string;
    createdAt: Date;
    completedAt: Date;
    updatedAt: Date;
};
