'use client';
import { getSession } from "next-auth/react";
import React, { useState } from "react";

export default function EmailForm() {
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const sendBulkEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await getSession();

    const recipients = [
      "katkat030703@gmail.com",
      "juliakthborja@outlook.com",
      "jbborja@up.edu.ph"
    ];

    e.preventDefault();
    setStatus("Sending...");

    const response = await fetch("/api/admin/feed", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        recipients,
        subject: subject,
        htmlBody: `<p>${message}</p>`,
        userEmail:session?.user?.email || process.env.SMTP_EMAIL,
        provider: "google",
      })
    });

    if(!response.ok){
      const errText = await response.text();
      console.error("Error: ", errText);
      return;
    }

    const data = await response.json();
    console.log(data);
    setStatus(data.message);
  }

  return (
    <div>
      <h1>SEND EMAILS</h1>
      <br/>
      <form onSubmit={sendBulkEmails}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          name = "subjectField"
          required
        />
        <br/>
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="messageField"
          required
        />
        <br/>
        <button type="submit">Send Email</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
