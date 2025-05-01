import { connectDB } from "@/databases/mongodb";
import { Application, ApplicationStatus } from '@/entities/application';
import { mapApplicationDtoToApplication, mapApplicationToApplicationDto } from '@/mappers/application';
import { ApplicationDto, ApplicationSchema } from '@/models/application';
import { Connection, Model } from "mongoose";

export interface ApplicationRepository {
    createApplication(application: Omit<Application, '_id'>): Promise<string>;
    getApplicationById(id: string): Promise<Application | null>;
    getApplicationsByUserId(userId: string): Promise<Application[]>;
    getApplicationsByJobId(jobId: string): Promise<Application[]>;
    updateApplicationStatus(id: string, status: ApplicationStatus): Promise<boolean>;
    hasUserApplied(userId: string, jobId: string): Promise<boolean>;
    deleteApplication(id: string): Promise<boolean>;
}

class MongoDBApplicationRepository implements ApplicationRepository {
    private connection: Connection;
    private model: Model<ApplicationDto>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Application"] ?? connection.model("Application", ApplicationSchema, "applications");
    }

    async createApplication(application: Omit<Application, '_id'>): Promise<string> {
        const applicationDto = mapApplicationToApplicationDto(application as Application);
        applicationDto.updatedAt = new Date();
        const created = await this.model.create(applicationDto);
        return created._id.toString();
    }

    async getApplicationById(id: string): Promise<Application | null> {
        const applicationDto = await this.model.findById(id);
        return applicationDto ? mapApplicationDtoToApplication(applicationDto) : null;
    }

    async getApplicationsByUserId(userId: string): Promise<Application[]> {
        const applicationDtos = await this.model.find({ userId });
        return applicationDtos.map(mapApplicationDtoToApplication);
    }

    async getApplicationsByJobId(jobId: string): Promise<Application[]> {
        const applicationDtos = await this.model.find({ jobId });
        return applicationDtos.map(mapApplicationDtoToApplication);
    }

    async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<boolean> {
        const result = await this.model.updateOne(
            { _id: id },
            { $set: { status, updatedAt: new Date() } }
        );
        return result.modifiedCount === 1;
    }

    async hasUserApplied(userId: string, jobId: string): Promise<boolean> {
        const result = await this.model.findOne({ userId, jobId });
        return !!result;
    }

    async deleteApplication(id: string): Promise<boolean> {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}

let applicationRepository: ApplicationRepository | null = null;

export function getApplicationRepository(): ApplicationRepository {
    if (applicationRepository !== null) {
        return applicationRepository;
    }

    const connection = connectDB();
    applicationRepository = new MongoDBApplicationRepository(connection);
    return applicationRepository;
}