import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendWithGmail(recipient: string, subject: string, htmlBody: string){
    // console.log("sendWithGmail");

    const response = await fetch("https://script.google.com/macros/s/AKfycbz9rR3nlCCb8fysr-NtXdSmP8wtVBaAMzrL3QnjcZwasCnZyIxaLHV9xjpLxoXzX09v4g/exec",
        {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({recipient, subject, htmlBody}),
        }
    );

    return response.json();
}

async function sendWithNodemailer(userEmail: string, recipient: string, subject: string, htmlBody: string){
    // console.log("sendWithNodemailer");
    
    // Check if app password is in .env file.
    if(!process.env.APP_PASSWORD){
        throw new Error("Missing APP_PASSWORD in .env file.");
    }

    // Check if user email is in .env file
    if(!userEmail){
        throw new Error("Missing NEXT_PUBLIC_EMAIL in .env file.");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userEmail,
            pass: process.env.APP_PASSWORD,
        }
    });

    return transporter.sendMail({
        from: userEmail,
        to: recipient,
        subject: subject,
        html: htmlBody
    });
}

export async function POST(req:NextRequest){
    try{
        const{recipients, subject, htmlBody, userEmail, provider} = await req.json();

        // Check recipient/s are provided.
        if(!recipients || !Array.isArray(recipients) || recipients.length === 0){
            return NextResponse.json({success: false, error: "No recipients found."});
        }

        let results;
        if(provider === "google"){
            results = await Promise.all(recipients.map((recipient) => sendWithGmail(recipient, subject, htmlBody)));
        }else{
            results = await Promise.all(recipients.map((recipient) => sendWithNodemailer(userEmail, recipient, subject, htmlBody)));
        }

        return NextResponse.json({success: true, results});
    }catch(error){
        return NextResponse.json({success:false, message: `Failed to send emails. ${error}`});
    }
}