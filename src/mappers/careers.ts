// mappers/ careers.ts

import { Careers } from "@/entities/careers";
import { CareerDto } from "@/models/careers";

export function mapCareerToCareerDto(career: Careers): CareerDto {
    return {
        _id: career._id,
        alumniID: career.alumniID,
        company: career.company,
        address: career.address,
        position: career.position,
        startDate: career.startDate,
        endDate: career.endDate,
        tags: career.tags
    };
}

export function mapCareerDtoToCareer(careerDto: CareerDto): Careers {
    return {
        _id: careerDto._id,
        alumniID: careerDto.alumniID,
        company: careerDto.company,
        address: careerDto.address,
        position: careerDto.position,
        startDate: careerDto.startDate,
        endDate: careerDto.endDate,
        tags: careerDto.tags
    };
} 