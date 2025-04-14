export interface Event {
    _id?: string;
    name: string;
    description: string;
    type: string;
    startDate: Date;
    endDate: Date;
    location: string;
    // These are foreign keys: (these are raw data types that are defined by the objects when parsed)
    monetaryValue: number;
    wouldGo: string[];    
    wouldNotGo: string[]; 
    wouldMaybeGo: string[]; 
} 