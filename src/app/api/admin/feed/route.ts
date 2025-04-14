import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import cron from "node-cron";

async function sendWithGmail(recipient: string, subject: string, htmlBody: string, scheduledTime: Date){
    console.log("sendWithGmail");
    const response = await fetch("https://script.google.com/macros/s/AKfycbwr9whGdfryOgQDVRqQ58nh-ZfEZOfG8anii-o-vGM3BSFqSa3llYahmA_cabSj6F0/exec",
        {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({recipient, subject, htmlBody, scheduledTime: scheduledTime.toISOString()}),
        }
    );

    return response.json();
}

async function sendWithNodemailer(recipient: string, subject: string, htmlBody: string, scheduledTime: Date){
    console.log("sendWithNodemailer");
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    });

    // Convert scheduled time to a cron expression
    const cronExp = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;

    // Schedule the email with cron
    const scheduleSend = cron.schedule(cronExp, async () => {
        try{
            await transporter.sendMail({
                from: process.env.NEXT_PUBLIC_EMAIL,
                to: recipient,
                subject: subject,
                html: htmlBody
            });

            scheduleSend.stop();
        }catch(error){
            console.error(`Failed to send email. ${error}`);
        }
    });

    return {success: true, message: "Email scheduled successfully."};
    
}

export async function POST(req:NextRequest){
    try{
        const{recipients, subject, htmlBody, provider, scheduledTime} = await req.json();

        const schedTime = new Date(scheduledTime);

        if(!recipients || !Array.isArray(recipients) || recipients.length === 0){
            return NextResponse.json({success: false, error: "No recipients found."});
        }

        let results;
        if(provider === "google"){
            results = await Promise.all(recipients.map((recipient) => sendWithGmail(recipient, subject, htmlBody, schedTime)));
        }else{
            results = await Promise.all(recipients.map((recipient) => sendWithNodemailer(recipient, subject, htmlBody, schedTime)));
        }

        return NextResponse.json({success: true, results});
    }catch(error){
        return NextResponse.json({success:false, message: `Failed to send emails. ${error}`});
    }
}