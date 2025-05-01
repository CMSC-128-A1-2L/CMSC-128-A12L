import { connectDB } from "@/databases/mongodb";
import { Application } from "@/entities/application";
import { mapApplicationDtoToApplication, mapApplicationToApplicationDto } from "@/mappers/application";
import { ApplicationDto, ApplicationSchema } from "@/models/application";
import { Connection, Model } from "mongoose";

/**
 * A repository for managing job applications.
 */
export interface ApplicationRepository {
    /**
     * Creates a new job application.
     * @param application The application to create
     * @returns The ID of the created application
     */
    createApplication(application: Application): Promise<string>;

    /**
     * Get an application by its ID.
     */
    getApplicationById(id: string): Promise<Application | null>;

    /**
     * Get all applications for a specific job.
     */
    getApplicationsByJobId(jobId: string): Promise<Application[]>;

    /**
     * Get all applications from a specific user.
     */
    getApplicationsByUserId(userId: string): Promise<Application[]>;

    /**
     * Check if a user has already applied to a job.
     */
    hasUserApplied(userId: string, jobId: string): Promise<boolean>;

    /**
     * Update an application's status.
     */
    updateApplicationStatus(id: string, status: Application["status"]): Promise<void>;

    /**
     * Update an application.
     */
    updateApplication(application: Application): Promise<void>;

    /**
     * Delete an application.
     */
    deleteApplication(id: string): Promise<void>;
}

class MongoDBApplicationRepository implements ApplicationRepository {
    private connection: Connection;
    private model: Model<ApplicationDto>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Application"] ?? connection.model("Application", ApplicationSchema, "applications");
    }

    async createApplication(application: Application): Promise<string> {
        const applicationDto = mapApplicationToApplicationDto(application);
        const created = await this.model.create(applicationDto);
        return created._id.toString();
    }

    async getApplicationById(id: string): Promise<Application | null> {
        const applicationDto = await this.model.findById(id);
        return applicationDto ? mapApplicationDtoToApplication(applicationDto) : null;
    }

    async getApplicationsByJobId(jobId: string): Promise<Application[]> {
        const applicationDtos = await this.model.find({ jobId });
        return applicationDtos.map(mapApplicationDtoToApplication);
    }

    async getApplicationsByUserId(userId: string): Promise<Application[]> {
        const applicationDtos = await this.model.find({ userId });
        return applicationDtos.map(mapApplicationDtoToApplication);
    }

    async hasUserApplied(userId: string, jobId: string): Promise<boolean> {
        const application = await this.model.findOne({ userId, jobId });
        return application !== null;
    }

    async updateApplicationStatus(id: string, status: Application["status"]): Promise<void> {
        await this.model.findByIdAndUpdate(id, { 
            status,
            updatedAt: new Date()
        });
    }

    async updateApplication(application: Application): Promise<void> {
        const applicationDto = mapApplicationToApplicationDto(application);
        await this.model.findByIdAndUpdate(application._id, {
            ...applicationDto,
            updatedAt: new Date()
        });
    }

    async deleteApplication(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
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