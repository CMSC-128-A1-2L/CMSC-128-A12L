// -- Implemented by Caleb Castro

export type type = 'Goods' | 'Cash' | 'Services';

export interface Donation {
    _id?: string;
    donationName: string;
    description: string;
    type: type;
    monetaryValue: number;
    donorID: string[];  // array of donationIDs (foreign keys)
    receiveDate?: Date;
}
