/* Sample form for testing blast emails.*/

"use client"
import { getSession } from "next-auth/react";
import React, { useState } from "react";

export default function EmailForm() {
  const [recipientList, setRecipients] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [scheduledTime, setTime] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const sendBlastEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    const recipients = recipientList.split(",");

    const session = await getSession();
    const userEmail = session?.user?.email || process.env.NEXT_PUBLIC_EMAIL; // Currently defaults to the latter
    const domain = userEmail?.split("@")[1];
    const provider = (domain==="gmail.com" || domain==="up.edu.ph")? 'google' : 'other';

    const response = await fetch("/api/admin/feed", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        recipients,
        subject: subject,
        htmlBody: `<p>${message}</p>`,
        userEmail: userEmail,
        provider: provider,
        scheduledTime: scheduledTime
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
      <form onSubmit={sendBlastEmail}>
      <input
          type="text"
          placeholder="Recipients(comma separated)"
          value={recipientList}
          onChange={(e) => setRecipients(e.target.value)}
          name = "recipientsField"
          required
        />
        <br/>
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
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setTime(e.target.value)}
          name="scheduleField"
          required
        />
        <br/>
        <button type="submit">Send Emails</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
