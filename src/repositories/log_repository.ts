import { connectDB } from "@/databases/mongodb";
import { Logs } from "@/entities/logs";
import { mapLogDtoToLogs, mapLogsToLogDto } from "@/mappers/logs";
import { LogsDto, LogSchema } from "@/models/logs";
import { Connection, Model } from "mongoose";

/**
 * A repository for managing logs.
 */
export interface LogRepository {
    /**
     * Creates a new log entry in the repository.
     * 
     * @param log The log to create.
     * @returns A promise that resolves when the log is created successfully.
     */
    createLog(log: Logs): Promise<string>;

    /**
     * Gets a log by its ID.
     * 
     * @param id The MongoDB _id of the log to fetch.
     * @returns A promise that resolves to either the fetched log or null if not found.
     */
    getLogById(id: string): Promise<Logs | null>;

    /**
     * Gets all logs in the repository.
     * 
     * @returns A promise that resolves to an array of all logs.
     */
    getAllLogs(): Promise<Logs[]>;

    /**
     * Updates an existing log in the repository.
     * 
     * @param log The log to update.
     * @returns A promise that resolves when the log is updated successfully.
     */
    updateLog(log: Logs): Promise<void>;

    /**
     * Deletes a log from the repository.
     * 
     * @param id The ID of the log to delete.
     * @returns A promise that resolves when the log is deleted successfully.
     */
    deleteLog(id: string): Promise<void>;
}

class MongoDBLogRepository implements LogRepository {
    private connection: Connection;
    private model: Model<LogsDto>;

    async createLog(log: Logs): Promise<string> {
        const logDto = mapLogsToLogDto(log);
        const created = await this.model.create(logDto);
        return created._id.toString();
    }

    async getLogById(id: string): Promise<Logs | null> {
        const logDto = await this.model.findById(id);
        return logDto ? mapLogDtoToLogs(logDto) : null;
    }

    async getAllLogs(): Promise<Logs[]> {
        const logDtos = await this.model.find();
        return logDtos.map(mapLogDtoToLogs);
    }

    async updateLog(log: Logs): Promise<void> {
        const logDto = mapLogsToLogDto(log);
        await this.model.findByIdAndUpdate(log._id, logDto);
    }

    async deleteLog(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Log"] ?? connection.model("Log", LogSchema, "logs");
    }
}

let logRepository: LogRepository | null = null;

export function getLogRepository(): LogRepository {
    if (logRepository !== null) {
        return logRepository;
    }

    const connection = connectDB();
    logRepository = new MongoDBLogRepository(connection);
    return logRepository;
}
