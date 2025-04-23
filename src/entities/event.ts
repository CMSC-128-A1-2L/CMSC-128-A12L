export interface Event {
    _id?: string;
    name: string;
    organizer: string;
    description: string;
    type: string;
    startDate: Date;
    endDate: Date;
    location: string;
    imageUrl?: string;
    sponsorship?: {
        enabled: boolean;
        sponsors: string[];
    };
    rsvp?: {
        enabled: boolean;
        options: ('Yes' | 'No' | 'Maybe')[];
    };
    // These are foreign keys: (these are raw data types that are defined by the objects when parsed)
    wouldGo: string[];    
    wouldNotGo: string[]; 
    wouldMaybeGo: string[]; 
} 