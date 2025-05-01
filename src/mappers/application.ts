import { Application } from "@/entities/application";
import { ApplicationDto } from "@/models/application";

export function mapApplicationDtoToApplication(applicationDto: ApplicationDto): Application {
    return {
        _id: applicationDto._id,
        userId: applicationDto.userId,
        jobId: applicationDto.jobId,
        status: applicationDto.status,
        appliedAt: applicationDto.appliedAt,
        updatedAt: applicationDto.updatedAt,
        coverLetter: applicationDto.coverLetter,
        resumeUrl: applicationDto.resumeUrl,
        fullName: applicationDto.fullName,
        email: applicationDto.email,
        phone: applicationDto.phone,
        portfolio: applicationDto.portfolio
    };
}

export function mapApplicationToApplicationDto(application: Application): ApplicationDto {
    return {
        _id: application._id,
        userId: application.userId,
        jobId: application.jobId,
        status: application.status,
        appliedAt: application.appliedAt,
        updatedAt: application.updatedAt,
        coverLetter: application.coverLetter,
        resumeUrl: application.resumeUrl,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        portfolio: application.portfolio
    };
}