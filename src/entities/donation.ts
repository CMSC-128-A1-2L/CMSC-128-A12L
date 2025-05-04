// -- Implemented by Caleb Castro

export type type = 'Goods' | 'Cash' | 'Services';

export interface Donation {
    eventId?: string;
    _id?: string;
    donationName: string;
    description: string;
    type: type;
    monetaryValue: number;
    donorID: string[];  // array of donationIDs (foreign keys)
    receiveDate?: Date;
    sponsorshipGoal?: number; // Optional field for event sponsorship goal
    currentAmount?: number; // Optional field to track current amount raised
    isEventSponsorship?: boolean; // Flag to indicate if this is an event sponsorship
}
