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

interface LogEntry {
  agent: string;
  response: string;
}

const EmailDetails: React.FC<EmailDetailsProps> = ({ email, isDraft, refreshEmails }) => {
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: email?.subject || "",
    to: email?.to || "",
    body: email?.message || "",
  });
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);

  const mockLogs: LogEntry[] = [
    {"agent": "NER_Agent", "response": "[{\"request_id\":\"902a4dc4-3577-4345-9e8b-5e10c0205844\"}]"},
    {"agent": "customer_agent", "response": "[{\"c\":{\"identity\":11,\"labels\":[\"Customer\"],\"properties\":{\"address\":\"Mumbai\",\"phone\":\"+919940498911\",\"name\":\"Nidhi Saxena\",\"id\":\"734a64a0-992c-465e-af86-4877f10f1d59\",\"email\":\"customer12@businessmail.com\"},\"elementId\":\"4:936c2283-e6ab-49c9-9b97-7ad93806a6c2:11\"}}]"},
    {"agent": "order_agent", "response": "[{\"o\":{\"identity\":4570,\"labels\":[\"Order\"],\"properties\":{\"date\":{\"year\":2024,\"month\":12,\"day\":31},\"total\":9874,\"id\":\"0fdf906d-7132-4e93-846c-ad7bba150039\",\"status\":\"Shipped\"},\"elementId\":\"4:936c2283-e6ab-49c9-9b97-7ad93806a6c2:4570\"},\"products\":[{\"identity\":2223,\"labels\":[\"Product\"],\"properties\":{\"price\":2662,\"name\":\"Pharmaceutical Ingredients\",\"weight\":\"25.78 kg\",\"id\":\"f6b7329b-1035-4e8f-9a9f-d12b4ab491fd\",\"dimensions\":\"30.8x38.4x0.7 cm\"},\"elementId\":\"4:936c2283-e6ab-49c9-9b97-7ad93806a6c2:2223\"},{\"identity\":2068,\"labels\":[\"Product\"],\"properties\":{\"price\":3405,\"name\":\"Pharmaceutical Ingredients\",\"weight\":\"36.13 kg\",\"id\":\"5197959f-841c-4a51-acbb-ac3a2dfcae67\",\"dimensions\":\"16.6x37.5x48.3 cm\"},\"elementId\":\"4:936c2283-e6ab-49c9-9b97-7ad93806a6c2:2068\"},{\"identity\":1565,\"labels\":[\"Product\"],\"properties\":{\"price\":3807,\"name\":\"Textile Fabric\",\"weight\":\"17.56 kg\",\"id\":\"8bc1d572-ac31-4720-b167-5bead54c36e7\",\"dimensions\":\"40.6x2.2x10.4 cm\"},\"elementId\":\"4:936c2283-e6ab-49c9-9b97-7ad93806a6c2:1565\"}]}]"},
    {"agent": "order_agent", "response": "[{\"s\":{\"identity\":5637,\"labels\":[\"Shipment\"],\"properties\":{\"carrier\":\"Blue Dart\",\"shipped_date\":{\"year\":2025,\"month\":1,\"day\":14},\"tracking_number\":\"TRK9587534\",\"weight\":\"55.2 kg\",\"id\":\"21b08510-1738-407e-a0fc-e3c4bfc99dab\"},\"elementId\":\"4:936c2283-e6ab-49c9-9b97-7ad93806a6c2:5637\"}}]"}
  ];

  const toggleLog = (index: number) => {
    if (expandedLogs.includes(index)) {
      setExpandedLogs(expandedLogs.filter(i => i !== index));
    } else {
      setExpandedLogs([...expandedLogs, index]);
    }
  };

  const formatResponse = (response: string) => {
    try {
      const parsed = JSON.parse(response);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return response;
    }
  };

  const getSimplifiedResponse = (agent: string) => {
    switch(agent) {
      case "NER_Agent": return "Request Details";
      case "customer_agent": return "Customer Details";
      case "order_agent": return "Order Details";
      default: return "Details";
    }
  };

  const renderLogs = () => {
    return (
      <div className="log-trace">
        <div className="log-header">
          <h3>Number [23254660]</h3>
        </div>
        
        {mockLogs.map((log, index) => (
          <div key={index} className="log-section">
            <div 
              className="agent-header" 
              onClick={() => toggleLog(index)}
            >
              <div className="agent-title">
                <h4>{log.agent.replace('_', ' ')}</h4>
                <span className="timestamp">Tuesday, 28 May 2024</span>
              </div>
              <span className="accordion-icon">
                {expandedLogs.includes(index) ? '−' : '+'}
              </span>
            </div>
            
            {expandedLogs.includes(index) && (
              <>
                {index === 0 && (
                  <>
                    <div className="divider"></div>
                    <div className="code-block">
                      <h5>Code</h5>
                      <pre>RequestNode</pre>
                      {mockLogs.map((logItem, idx) => (
                        <pre key={idx}>{`{\n    Agent : "${logItem.agent.replace('_', ' ')}"\n    response : "${getSimplifiedResponse(logItem.agent)}"\n}`}</pre>
                      ))}
                    </div>
                    <div className="divider"></div>
                  </>
                )}
                
                <div className="agent-response">
                  <pre>{formatResponse(log.response)}</pre>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ... (rest of your existing component code remains the same)
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
    <div className="email-details">
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
      {renderLogs()}
    </div>
  );
};

export default EmailDetails;