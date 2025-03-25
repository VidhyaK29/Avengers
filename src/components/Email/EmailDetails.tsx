import React, { useEffect, useState } from "react";
import { Email } from "../../interfaces/common.interface";
import "./EmailDetails.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle, ChevronUp, ChevronDown } from "lucide-react";

interface EmailDetailsProps {
  email: Email | null;
  isDraft: boolean;
  refreshEmails: () => void;
}

interface LogEntry {
  agent: string;
  response: string;
  status?: string;
}

const EmailDetails: React.FC<EmailDetailsProps> = ({ email, isDraft, refreshEmails }) => {
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: email?.subject || "",
    to: email?.to || "",
    body: email?.message || "",
  });
  const [expanded, setExpanded] = useState<number | null>(0);
  useEffect(() => {
    // Log the selected email whenever it changes
    console.log("Selected email:", email);
  }, [email]);
  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const formatResponse = (response: string) => {
    try {
      // First try to parse directly
      try {
        const parsed = JSON.parse(response);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        // If direct parse fails, check if it's wrapped in extra quotes
        const trimmed = response.trim();
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          const unquoted = trimmed.slice(1, -1);
          // Handle double-escaped JSON
          if (unquoted.startsWith('"') && unquoted.endsWith('"')) {
            const doubleUnquoted = unquoted.slice(1, -1).replace(/\\"/g, '"');
            const parsed = JSON.parse(doubleUnquoted);
            return JSON.stringify(parsed, null, 2);
          }
          // Handle single escaped JSON
          const parsed = JSON.parse(unquoted.replace(/\\"/g, '"'));
          return JSON.stringify(parsed, null, 2);
        }
        return response;
      }
    } catch (e) {
      return response;
    }
  };

  const getSimplifiedResponse = (agent: string) => {
    switch (agent) {
      case "NER_Agent": return "Request Details";
      case "customer_agent": return "Customer Details";
      case "order_agent": return "Order Details";
      default: return "Details";
    }
  };

  const renderLogs = () => {
    if (!email || !email.traceLogs) {
      return <div className="no-logs">No logs available</div>;
    }
  
    // Format date as shown in the image
    const formatDisplayDate = () => {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };
  
    // Parse each log entry in the traceLogs array
    const parsedLogs = email.traceLogs.map(log => {
      if (typeof log === 'string') {
        try {
          return JSON.parse(log) as LogEntry;
        } catch (e) {
          return { agent: 'Unknown', response: log, status: 'error' };
        }
      }
      return log;
    });
  
    // Format agent name for display
    const formatAgentName = (agent: string) => {
      return agent.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
  
    return (
      <div className="log-trace">
        <div className="log-header">
          <label className="log-title">Log Trace</label>
          <div className="input-container">
          <input type="text" value={email.id} readOnly />
          </div>
        </div>
  
        <div className="timeline">
          {parsedLogs.map((log, index) => (
            <div key={index} className="log-section">
            <span className="status-icon">
            <CheckCircle size={18} className="green" />
          </span>
              <div className="agent-header" onClick={() => toggleExpand(index)}>
                <div className="agent-info">
                  <p className="agent-name">Agent {index + 1}</p>
                </div>
                {expanded === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
  
              {expanded === index && (
                <div className="log-content">
                  <div className="code-section">
                    <div className="code-header">
                      <span>Code</span>
                    </div>
                    <pre className="code-block">
                    {formatResponse(log.response)}
                    </pre>
                  </div>
  
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ... rest of your component code remains the same ...
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
    const emailInput = `From: ${emailData.to} To: orders@yourcompany.com Subject: ${emailData.subject}`.replace(/\s+/g, ' ').trim() + ` Body: ${emailData.body}`;

    setLoading(true);
    toast.info("Sending email...", { autoClose: false });
    try {
      const response = await fetch("https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: emailInput,
        }),
      });

      toast.dismiss();
      if (response.ok) {
        refreshEmails();
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("Failed to send email.");
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
  

  

  if (isDraft) {
    return (
      <div className="email-details draft-mode">
        <h3>{email.subject}</h3>
        <div className="email-header-draft">
          <div className="draft-field">
            <span>To:</span>
            <input type="text" defaultValue={email.to} />
          </div>
        
        </div>
        <div className="email-body">
          <textarea defaultValue={email.messageContext} />
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
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    );
  }

  return (
    <>
<div className={(!email || !email.traceLogs )? "email-details" : "email-details-logs"}>     
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
      </div>
      {email && email.traceLogs && renderLogs()}
      </>
  );
};

export default EmailDetails;