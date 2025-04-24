import { NextRequest, NextResponse } from "next/server";
import { getLogRepository } from "@/repositories/log_repository";

export async function GET(request: NextRequest) {
  try {
    const logRepository = getLogRepository();
    const allLogs = await logRepository.getAllLogs();

    // Sort by timestamp descending and take the latest 10
    const sortedLogs = allLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return NextResponse.json(sortedLogs, { status: 200 });
  } catch (error) {
    console.error(" Failed to fetch test logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
