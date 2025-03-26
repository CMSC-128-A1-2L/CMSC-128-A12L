import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getToken } from "next-auth/jwt";

async function sendWithGmail(recipient: string, userEmail: any, subject: string, htmlBody: string, token: any){
    console.log("sendWithGmail.");

    const response = await fetch("https://script.google.com/macros/s/AKfycbzxeSZw-GAEXbRuUterbyu1pfAzVcVsSvRbXBN5YqiDlcV7rOnDbwRS5OrWsS86pnrlHg/exec",
        {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({recipient, subject, htmlBody}),
        }
    );

    return response.json();
}

async function sendWithNodemailer(userEmail: string, recipient: string, subject: string, htmlBody: string){
    console.log("sendWithNodemailer.");
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    return transporter.sendMail({
        from: userEmail,
        to: recipient,
        subject,
        html: htmlBody
    });
}

export async function POST(req:NextRequest){
    try{
        const{recipients, subject, htmlBody, userEmail, provider} = await req.json();
        const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

        if(!recipients || !Array.isArray(recipients) || recipients.length === 0){
            return NextResponse.json({success: false, error: "Provide a list of recipients."});
        }

        let results;
        if(provider === "google"){
            results = await Promise.all(recipients.map((recipient) => sendWithGmail(recipient, userEmail, subject, htmlBody, token)));
        }else{
            results = await Promise.all(recipients.map((recipient) => sendWithNodemailer(userEmail, recipient, subject, htmlBody)));
        }

        return NextResponse.json({success: true, results});
    }catch(error){
        return NextResponse.json({success:false, message: "Failed to send emails."});
    }
}