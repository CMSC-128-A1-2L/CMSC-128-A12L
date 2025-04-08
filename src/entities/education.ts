export enum educLevel {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    TERTIARY = "tertiary",
    SEMINAR = "seminar"
};

export interface Education {
    _id: string;
    alumniID: string;
    schoolName: string;
    startDate: Date;
    endDate?: Date;
    educationLevel: educLevel[];
    course?: string;
}