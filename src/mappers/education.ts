import { Education } from "@/entities/education";
import { EducationDto } from "@/models/education";

export function mapEductoEducDto(education: Education): EducationDto {
    return {
        _id: education._id,
        alumniID: education.alumniID,
        schoolName: education.schoolName,
        startDate: education.startDate,
        endDate: education.endDate,
        educationLevel: education.educationLevel,
        course: education.course
    };
}

export function mapEducDtotoEduc(educationDto: EducationDto): Education {
    return {
        _id: educationDto._id,
        alumniID: educationDto.alumniID,
        schoolName: educationDto.schoolName,
        startDate: educationDto.startDate,
        endDate: educationDto.endDate,
        educationLevel: educationDto.educationLevel,
        course: educationDto.course
    };
}