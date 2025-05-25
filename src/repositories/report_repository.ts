import { connectDB } from "@/databases/mongodb";
import { Report, ReportStatus } from "@/entities/report";
import { mapReportDtoToReport, mapReportToReportDto } from "@/mappers/report";
import { ReportDto, ReportSchema } from "@/models/report";
import { Connection, Model } from "mongoose";

export interface ReportRepository {    createReport(report: Report): Promise<string>;
    getReportById(id: string): Promise<Report | null>;
    getReportsByUserId(userId: string): Promise<Report[]>;
    getAllReports(): Promise<Report[]>;
    updateReport(id: string, updateData: Partial<Report>): Promise<Report | null>;
    deleteReport(id: string): Promise<void>;
    updateReportStatus(id: string, status: ReportStatus, adminResponse?: string): Promise<Report | null>;
}

class MongoDBReportRepository implements ReportRepository {
    private connection: Connection;
    private model: Model<ReportDto>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Report"] ?? connection.model("Report", ReportSchema, "reports");
    }

    async createReport(report: Report): Promise<string> {
        const reportDto = mapReportToReportDto(report);
        const created = await this.model.create(reportDto);
        return created._id.toString();
    }

    async getReportById(id: string): Promise<Report | null> {
        const reportDto = await this.model.findById(id);
        return reportDto ? mapReportDtoToReport(reportDto) : null;
    }

    async getReportsByUserId(userId: string): Promise<Report[]> {
        const reportDtos = await this.model.find({ userId }).sort({ updatedAt: -1 });
        return reportDtos.map(mapReportDtoToReport);
    }

    async getAllReports(): Promise<Report[]> {
        const reportDtos = await this.model.find().sort({ updatedAt: -1 });
        return reportDtos.map(mapReportDtoToReport);
    }

    async updateReport(report: Report): Promise<void> {
        const reportDto = mapReportToReportDto(report);
        await this.model.findByIdAndUpdate(report._id, reportDto);
    }

    async deleteReport(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    async updateReportStatus(id: string, status: ReportStatus, adminResponse?: string): Promise<void> {
        const updateData: Partial<ReportDto> = {
            status,
            updatedAt: new Date()
        };
        if (adminResponse !== undefined) {
            updateData.adminResponse = adminResponse;
        }
        await this.model.findByIdAndUpdate(id, { $set: updateData });
    }
}

let reportRepository: ReportRepository | null = null;

export function getReportRepository(): ReportRepository {
    if (reportRepository !== null) {
        return reportRepository;
    }

    const connection = connectDB();
    reportRepository = new MongoDBReportRepository(connection);
    return reportRepository;
}
