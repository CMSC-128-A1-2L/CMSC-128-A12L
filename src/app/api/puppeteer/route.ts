import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
        return NextResponse.json(
            { error: "Server configuration error: NEXT_PUBLIC_APP_URL is not set" },
            { status: 500 }
        );
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Set viewport to desktop width
        await page.setViewport({ width: 1920, height: 1080 });
        page.setDefaultNavigationTimeout(30000);

        await page.goto(`${process.env.NEXT_PUBLIC_APP_URL}/reports`, {
            waitUntil: "networkidle0",
        });

        // Wait for content to fully render
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Get the full height of the page
        const pageHeight = await page.evaluate(() => {
            return document.documentElement.scrollHeight;
        });

        // Generate PDF with custom page size matching desktop view
        const pdf = await page.pdf({
            printBackground: true,
            width: '1920px',
            height: '297mm', // A4 height
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        return new NextResponse(pdf, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="admin-reports.pdf"'
            }
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        if (browser) {
            await browser.close();
        }
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}