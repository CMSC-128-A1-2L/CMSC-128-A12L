import { Report } from "@/entities/report";
import { ReportDto } from "@/models/report";

export function mapReportDtoToReport(reportDto: ReportDto): Report {
    return {
        _id: reportDto._id,
        userId: reportDto.userId,
        title: reportDto.title,
        description: reportDto.description,
        category: reportDto.category,
        status: reportDto.status,
        adminResponse: reportDto.adminResponse,
        attachmentUrl: reportDto.attachmentUrl,
        createdAt: reportDto.createdAt,
        updatedAt: reportDto.updatedAt
    };
}

export function mapReportToReportDto(report: Report): ReportDto {
    return {
        _id: report._id!,
        userId: report.userId,
        title: report.title,
        description: report.description,
        category: report.category,
        status: report.status,
        adminResponse: report.adminResponse,
        attachmentUrl: report.attachmentUrl,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
    };
}
