import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import cron from "node-cron";

async function sendWithGmail(recipient: string, subject: string, htmlBody: string, scheduledTime: Date){
    console.log("DEBUG: Attempting to send with Gmail to:", recipient);
    const googleAppsScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!googleAppsScriptUrl) {
        console.error("DEBUG: Google Script URL not configured");
        throw new Error("Google Script URL not configured");
    }
    
    console.log("DEBUG: Sending request to Google Script URL");
    const response = await fetch(googleAppsScriptUrl,
        {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({recipient, subject, htmlBody, scheduledTime: scheduledTime.toISOString()}),
        }
    );

    const result = await response.json();
    console.log("DEBUG: Google Script response:", result);
    return result;
}

async function sendWithNodemailer(recipient: string, subject: string, htmlBody: string, scheduledTime: Date){
    console.log("DEBUG: Attempting to send with Nodemailer to:", recipient);
    console.log("DEBUG: Using email:", process.env.NEXT_PUBLIC_EMAIL);
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    });

    // Verify transporter connection
    try {
        await transporter.verify();
        console.log("DEBUG: Nodemailer connection verified successfully");
    } catch (error) {
        console.error("DEBUG: Nodemailer connection failed:", error);
        throw error;
    }

    // Convert scheduled time to a cron expression
    const cronExp = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;
    console.log("DEBUG: Cron expression:", cronExp);

    // Schedule the email with cron
    const scheduleSend = cron.schedule(cronExp, async () => {
        console.log("DEBUG: Executing scheduled email send to:", recipient);
        try{
            const info = await transporter.sendMail({
                from: process.env.NEXT_PUBLIC_EMAIL,
                to: recipient,
                subject: subject,
                html: htmlBody
            });
            console.log("DEBUG: Email sent successfully:", info.response);
            scheduleSend.stop();
        }catch(error){
            console.error("DEBUG: Failed to send scheduled email:", error);
        }
    });

    return {success: true, message: "Email scheduled successfully."};
}

export async function POST(req:NextRequest){
    try{
        console.log("DEBUG: Received email request");
        const{recipients, subject, htmlBody, provider, scheduledTime} = await req.json();
        console.log("DEBUG: Request data:", {
            recipients,
            subject,
            provider,
            scheduledTime
        });

        const schedTime = new Date(scheduledTime);
        console.log("DEBUG: Scheduled time:", schedTime);

        if(!recipients || !Array.isArray(recipients) || recipients.length === 0){
            console.error("DEBUG: No recipients found in request");
            return NextResponse.json({success: false, error: "No recipients found."});
        }

        console.log("DEBUG: Processing emails for recipients:", recipients);
        let results;
        if(provider === "google"){
            console.log("DEBUG: Using Google Script provider");
            results = await Promise.all(recipients.map((recipient) => sendWithGmail(recipient, subject, htmlBody, schedTime)));
        }else{
            console.log("DEBUG: Using Nodemailer provider");
            results = await Promise.all(recipients.map((recipient) => sendWithNodemailer(recipient, subject, htmlBody, schedTime)));
        }

        console.log("DEBUG: Email sending results:", results);
        return NextResponse.json({success: true, results});
    }catch(error){
        console.error("DEBUG: Error processing email request:", error);
        return NextResponse.json({success:false, message: `Failed to send emails. ${error}`});
    }
}
