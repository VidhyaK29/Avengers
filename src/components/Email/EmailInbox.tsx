import { useState, useEffect } from "react";
import { Email, Draft } from "../../interfaces/common.interface"; // Import the Draft interface
import "./EmailInbox.scss";
import {appDataService} from "../../services/app.data.service";
import NewEmail from "./NewEmail";

interface EmailInboxProps {
  onSelectEmail: (email: Email, isDraft: boolean, isNewEmail?: boolean) => void;
  setFetchEmails: (fetchEmails: () => void) => void;
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", // e.g., Wed
    month: "numeric", // e.g., 3
    day: "numeric", // e.g., 12
  }).format(date);
};

const parseIncomingEmail = (incomingEmail: string) => {
  const subjectMatch = incomingEmail.match(/Subject: (.+?)(?:\/|\nBody:| Body:|$)/);
  const fromMatch = incomingEmail.match(/From: (.+?)(?:\/|\nTo:| To:|$)/);
  const toMatch = incomingEmail.match(/To: (.+?)(?:\/|\nSubject:| Subject:|$)/);
  const bodyMatch = incomingEmail.match(/\/?Body: ([\s\S]+)/);

  return {
    subject: subjectMatch ? subjectMatch[1] : "No Subject",
    from: fromMatch ? fromMatch[1] : "Unknown Sender",
    to: toMatch ? toMatch[1] : "Unknown Recipient",
    body: bodyMatch ? bodyMatch[1] : "No message body",
  };
};

const parseOutgoingEmail = (outgoingEmail: string) => {
  const subjectMatch = outgoingEmail.match(/subject:\s*(.+?)(?:\n|$)/i);
  const fromMatch = outgoingEmail.match(/from:\s*(.+?)(?:\n|$)/i);
  const toMatch = outgoingEmail.match(/to:\s*(.+?)(?:\n|$)/i);
  const bodyMatch = outgoingEmail.match(/body:\s*([\s\S]+)/i);

  return {
    subject: subjectMatch ? subjectMatch[1] : "No Subject",
    from: fromMatch ? fromMatch[1] : "Unknown Sender",
    to: toMatch ? toMatch[1] : "Unknown Recipient",
    body: bodyMatch ? bodyMatch[1].trim() : "No message body",
  };
};


const EmailInbox: React.FC<EmailInboxProps> = ({ onSelectEmail, setFetchEmails }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEmails, setExpandedEmails] = useState<{ [key: string]: boolean }>({});
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showNewEmailDialog, setShowNewEmailDialog] = useState<boolean>(false);
  const fetchEmails = async () => {
    try {
      const dataToreverse: Email[] = await appDataService.fetchEmails();
      const data = dataToreverse.reverse();
      const transformedEmails: Email[] = data.map((item: any) => {
        const { subject: incomingSubject, from: incomingFrom, to: incomingTo, body: incomingBody } =
          parseIncomingEmail(item.incoming_email);
    
        let outgoingSubject = "";
        let outgoingFrom = "";
        let outgoingTo = "";
        let outgoingBody = "";
    
        if (item.outgoing_email) {
          ({ subject: outgoingSubject, from: outgoingFrom, to: outgoingTo, body: outgoingBody } =
            parseOutgoingEmail(item.outgoing_email));
        }
        return {
          id: item.id,
          sender: incomingFrom,
          receiver: incomingTo,
          subject: incomingSubject,
          timestamp: item.created_time,
          message: incomingBody,
          draft: item.outgoing_email ? {
            subject: outgoingSubject,
            from: outgoingFrom,
            to: outgoingTo,
            body: outgoingBody,
            cc: "",
            messageContext: outgoingBody, 
          } : undefined,
          history: undefined,
        };
      });
      setEmails(transformedEmails);
      if (transformedEmails.length > 0) {
        setSelectedEmailId(transformedEmails[0].id);
        onSelectEmail(transformedEmails[0], false);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    setFetchEmails(() => fetchEmails); // Pass fetchEmails to App
  }, [setFetchEmails]);


  const toggleEmail = (emailId: string) => {
    setExpandedEmails((prevState) => ({
      ...prevState,
      [emailId]: !prevState[emailId],
    }));
  };

  const handleEmailClick = (email: Email, isDraft: boolean) => {
    setSelectedEmailId(isDraft ? `${email.id}-draft` : email.id);
    onSelectEmail(email, isDraft);
  };
  const handleComposeNewEmail = () => {
    setShowNewEmailDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setShowNewEmailDialog(false);
  };

  if (loading) {
    return <div className="email-inbox">Loading emails...</div>;
  }

  if (error) {
    return <div className="email-inbox">Error: {error}</div>;
  }

  return (
    <div className="email-inbox">
  <button onClick={handleComposeNewEmail}>Compose New Email</button>
  <button onClick={handleComposeNewEmail}>Voice</button>
      <div className="email-list">
        {emails.map((email) => (
          <div key={email.id} className={`email-item ${selectedEmailId === email.id ? "active" : ""}`}>
            <div className="email-header">
              {(email.draft || email.history) && (
                <button className="toggle-icon" onClick={() => toggleEmail(email.id)}>
                  {expandedEmails[email.id] ? "▲" : "▼"}
                </button>
              )}
              <div className="avatar">{email.sender[0]}</div>
              <div className="sender-info">
                <span className="sender" onClick={() => handleEmailClick(email, false)}>
                  {email.sender}
                </span>
                <span className="timestamp">{formatTimestamp(email.timestamp)}</span>
              </div>
            </div>
            <div className="email-subject">{email.subject}</div>
            <div className="email-preview">
              {email.message.length > 50 ? `${email.message.substring(0, 50)}...` : email.message}
            </div>

            {expandedEmails[email.id] && (
              <div className="email-details">
                {email.draft && (
                  <div
                    className={`email-item ${selectedEmailId === email.id + "-draft" ? "active" : ""}`}
                    onClick={() => handleEmailClick(email, true)}
                  >
                    <div className="email-header">
                      <span className="sender draft-label">[Draft] -</span>  <span className="draft-header">{email.draft.subject}</span>
                    </div>
                    <div className="email-message">{email.draft.messageContext}</div>
                  </div>
                )}
                {email.history && email.history.length > 0 && (
                  <div className="email-history">
                    <h4>History</h4>
                    {email.history.map((historyItem) => (
                      <div key={historyItem.id} className="history-item">
                        <div className="history-header">
                          <span className="history-sender">{historyItem.sender}</span>
                          <span className="history-timestamp">{formatTimestamp(historyItem.timestamp)}</span>
                        </div>
                        <div className="history-subject">{historyItem.subject}</div>
                        <div className="history-message">{historyItem.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showNewEmailDialog && <NewEmail  />}
    </div>
  );
};

export default EmailInbox;