import React, { useState } from "react";
import { Email } from "../../interfaces/common.interface";
import "./EmailDetails.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EmailDetailsProps {
  email: Email | null;
  isDraft: boolean;
  refreshEmails: () => void; 
}

const EmailDetails: React.FC<EmailDetailsProps> = ({ email, isDraft, refreshEmails }) => {
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: email?.subject || "",
    to: email?.to || "",
    body: email?.message || "",
  });

  if (!email) {
    return <div className="email-details">Select an email to view details.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const emailInput = `From: ${emailData.to} To: orders@yourcompany.com Subject: ${emailData.subject}`.replace(/\s+/g, ' ').trim() +  `Body: ${emailData.body}`;

    console.log(emailInput, ',,');
    const requestBody = {
      input: emailInput,
    };
    setLoading(true);
    toast.info("Sending email...", { autoClose: false });
    try {
      const response = await fetch("https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      toast.dismiss();
      if (response.ok) {
        refreshEmails();
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      refreshEmails();
      toast.dismiss();
    } finally {
      setLoading(false);
    }
  };

  const formattedTimestamp = new Date(email.timestamp).toLocaleString("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  if (isDraft && email.draft) {
    return (
      <div className="email-details draft-mode">
        <h3>{email.draft.subject}</h3>
        <div className="email-header-draft">
          <div className="draft-field">
            <span>To:</span>
            <input type="text" defaultValue={email.draft.to}  />
          </div>
          <div className="draft-field">
            <span>CC:</span>
            <input type="text" defaultValue={email.draft.cc}  />
          </div>
        </div>
        <div className="email-body">
          <textarea defaultValue={email.draft.messageContext} />
        </div>
        <button className="send-button">Send</button>
      </div>
    );
  }

  if (email.id === 'new') {
    return (
      <div className="email-details draft-mode">
        <ToastContainer />
        <h3>
          Subject:{" "}
          <input type="text" name="subject" value={emailData.subject} onChange={handleChange} />
        </h3>
        <div className="email-header-draft">
          <div className="draft-field">
            <span>From:</span>
            <input type="text" name="to" value={emailData.to} onChange={handleChange} />
          </div>
        </div>
        <div className="email-body">
          <textarea name="body" value={emailData.body} onChange={handleChange} />
        </div>
        <button className="send-button" onClick={handleSubmit}>
          Send
        </button>
      </div>
    );
  }

  return (
    <><div className="email-details">
      <h3>{email.subject}</h3>
      <div className="email-body-content">
        <div className="email-sender">
          <div className="avatar">{email.sender[0]}</div>
          <div className="sender-info">
            <span className="sender-name">{email.sender}</span>
            <span className="receiver-name">TO : {email.receiver}</span>
          </div>
          <div className="email-timestamp">{formattedTimestamp}</div>
        </div>
        <div className="email-body">
          {email.message.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
      <div>Log Trace</div>
    </div>
   </>
  );
};

export default EmailDetails;