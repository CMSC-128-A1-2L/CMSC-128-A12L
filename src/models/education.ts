import { Schema, Types } from "mongoose";

export enum EducLevelDto {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    TERTIARY = "tertiary",
    SEMINAR = "seminar"
};

export interface EducationDto {
    _id: string;
    alumniID: string;
    schoolName: string;
    startDate: Date;
    endDate?: Date;
    educationLevel: EducLevelDto[];
    course?: string;
}

export const EducationSchema = new Schema<EducationDto>({
    alumniID: { type: Types.ObjectId, ref: 'Alumni', required: true },
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    educationLevel: { type: String, required: true },
    course: { type: String }
});
