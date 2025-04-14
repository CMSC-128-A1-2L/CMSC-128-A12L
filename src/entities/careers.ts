// entities/careers
export interface Careers {
    _id?: string;
    alumniID?: string; 
    company: string;
    address?: string;
    position: string;
    startDate: Date;
    endDate?: Date;    
    tags?: string[]; 
} 


