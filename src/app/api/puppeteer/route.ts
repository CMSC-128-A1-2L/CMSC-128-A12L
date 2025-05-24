import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser } from "puppeteer-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const remoteExecutablePath =
 "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";let browser: Browser;
async function getBrowser() {

    if (browser) {
        return browser;
    }

    if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production") {
        browser = await puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: true,
        });
    } else {
        browser = await puppeteerCore.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
        });
    }

    return browser;
}

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

    
    try {
        const browser = await getBrowser();
        const page = await browser.newPage();

        // Set viewport to desktop width
        await page.setViewport({ width: 1920, height: 1080 });
        page.setDefaultNavigationTimeout(300000);

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