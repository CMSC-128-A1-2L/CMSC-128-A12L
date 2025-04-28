import { Logs } from "@/entities/logs";
import { LogsDto } from "@/models/logs";

export function mapLogsToLogDto(logs: Logs): LogsDto {
    return {
        _id: logs._id,
        userId: logs.userId,
        imageUrl: logs.imageUrl,
        name: logs.name,
        action: logs.action,
        status: logs.status,
        timestamp: logs.timestamp,
        ipAddress: logs.ipAddress
    };
}

export function mapLogDtoToLogs(logDto: LogsDto): Logs {
    return {
        _id: logDto._id,
        userId: logDto.userId,
        imageUrl: logDto.imageUrl,
        name: logDto.name,
        action: logDto.action,
        status: logDto.status,
        timestamp: logDto.timestamp,
        ipAddress: logDto.ipAddress
    };
}