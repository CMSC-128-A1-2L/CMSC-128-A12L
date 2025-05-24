import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Browser } from "puppeteer-core";

interface ErrorResponse {
    error: string;
    details?: string;
}

// Chrome launch options for serverless environment
const getChromeLaunchOptions = async () => ({
    args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
    ],
    executablePath: process.env.NODE_ENV === "development"
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(),
    headless: chromium.headless,
    defaultViewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    },
});

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    let browser: Browser | null = null;

    try {
        // Authentication check
        if (!session?.user?.id) {
            return NextResponse.json<ErrorResponse>(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Environment check
        if (!process.env.NEXT_PUBLIC_APP_URL) {
            return NextResponse.json<ErrorResponse>(
                { error: "Server configuration error", details: "NEXT_PUBLIC_APP_URL is not set" },
                { status: 500 }
            );
        }

        // Initialize browser with serverless-compatible options
        browser = await puppeteer.launch(await getChromeLaunchOptions());
        const page = await browser.newPage();

        // Optimize page loading
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const resourceType = request.resourceType();
            if (["image", "stylesheet", "font"].includes(resourceType)) {
                request.continue();
            } else {
                request.continue();
            }
        });

        // Configure viewport and timeouts
        await page.setViewport({ width: 1920, height: 1080 });
        page.setDefaultNavigationTimeout(60000);

        // Navigate to the reports page
        const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reports`;
        await page.goto(pageUrl, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });

        // Wait for dynamic content to load
        await page.waitForSelector("#reports-container", { timeout: 10000 })
            .catch(() => console.warn("Reports container selector not found"));
        
        // Additional wait for any animations or dynamic content
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate PDF with optimized settings
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
            preferCSSPageSize: true,
        });

        // Cleanup
        await browser.close();
        browser = null;        // Return PDF with proper headers
        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="admin-reports.pdf"',
                "Content-Length": pdfBuffer.length.toString(),
                "Cache-Control": "no-cache",
            },
        });

    } catch (error) {
        console.error("PDF Generation Error:", error);
        
        // Ensure browser cleanup on error
        if (browser) {
            await browser.close().catch(console.error);
        }

        // Return appropriate error response
        return NextResponse.json<ErrorResponse>(
            {
                error: "Failed to generate PDF",
                details: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 }
        );
    }
}