import { useState, useEffect } from "react";
import { Draft, Email } from "../../interfaces/common.interface";
import "./EmailInbox.scss";
import { appDataService } from "../../services/app.data.service";
import NewEmail from "./NewEmail";

interface EmailInboxProps {
  onSelectEmail: (email: Email, isDraft: boolean, isNewEmail?: boolean) => void;
  setFetchEmails: (fetchEmails: () => void) => void;
  openRequestId: string | null;
}


const COLOR_PALETTE = [
  '#4ECDC4', '#45B7D1', '#FDCB6E', '#6C5CE7', '#FF8A5B',
  '#2ECC71', '#AF7AC5', '#5DADE2', '#F1948A', '#48C9B0', '#EC7063',
  '#7D3C98', '#229954', '#D35400', '#16A085', '#2980B9', 
  '#8E44AD', '#F39C12', '#D35400', '#C0392B', '#27AE60'
];

const generateAvatarColor = (sender: string): string => {
  let hash = 0;
  
  // Improved hash calculation using bitwise operations and character codes
  for (let i = 0; i < sender.length; i++) {
    hash = ((hash << 5) - hash) + sender.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Ensure colors are distributed evenly using the modulus operation
  let colorIndex = Math.abs(hash) % COLOR_PALETTE.length;

  // Optional: Use sender length to add a diversity factor to further differentiate
  const diversityFactor = (sender.length % 5) + 1;  // Range from 1 to 5
  colorIndex = (colorIndex + diversityFactor) % COLOR_PALETTE.length;

  return COLOR_PALETTE[colorIndex];
};


const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
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

const EmailInbox: React.FC<EmailInboxProps> = ({ onSelectEmail, setFetchEmails, openRequestId }) => {
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
        const { subject: incomingSubject, from: incomingFrom, to: incomingTo, body: incomingBody } = parseIncomingEmail(item.incoming_email);
      
        let outgoingSubject = "";
        let outgoingFrom = "";
        let outgoingTo = "";
        let outgoingBody = "";
      
        // Parse outgoing email if available
        if (item.outgoing_email) {
          ({ subject: outgoingSubject, from: outgoingFrom, to: outgoingTo, body: outgoingBody } = parseOutgoingEmail(item.outgoing_email));
        }
      
        // Return the transformed email
        return {
          id: item.id || "", // Default to empty string if id is missing
          sender: incomingFrom || "", // Default to empty string if sender is missing
          receiver: incomingTo || "", // Default to empty string if receiver is missing
          subject: incomingSubject || "", // Default to empty string if subject is missing
          timestamp: item.created_time || "", // Default to empty string if timestamp is missing
          traceLogs: item.traceLogs || [], // Default to an empty array if traceLogs is missing
          message: incomingBody || "", // Default to empty string if message is missing
          draft: item.outgoing_email ? {
            subject: outgoingSubject || "", // Default to empty string if outgoingSubject is missing
            to: outgoingTo || "", // Default to empty string if outgoingTo is missing
            cc: "", // Default to empty string if cc is missing
            messageContext: outgoingBody || "", // Default to empty string if messageContext is missing
            id: "", // Default to empty string if id is missing
            sender: outgoingFrom || "", // Default to empty string if sender is missing
            timestamp: item.created_time || "", // Default to empty string if timestamp is missing
            receiver: incomingTo || "", // Default to empty string if receiver is missing
            message: outgoingBody || "", // Default to empty string if message is missing
          } : undefined,
          history: undefined, // No history available, can be set to undefined
        };
      });
      
      setEmails(transformedEmails);
      
      // If there's an openRequestId, find and select that email
      if (openRequestId) {
        const targetEmail = transformedEmails.find(email => email.id === openRequestId);
        if (targetEmail) {
          setExpandedEmails(prev => ({ ...prev, [targetEmail.id]: true }));
          handleEmailClick(targetEmail, true);
        } else if (transformedEmails.length > 0) {
          handleEmailClick(transformedEmails[0], true);

        }
      } else if (transformedEmails.length > 0) {
        setSelectedEmailId(transformedEmails[0].id);
        onSelectEmail(transformedEmails[0], false);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setError("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    setFetchEmails(() => fetchEmails);
  }, [setFetchEmails, openRequestId]);

  useEffect(() => {
    // If openRequestId changes, find and select the corresponding email
    if (openRequestId && emails.length > 0) {
      const targetEmail = emails.find(email => email.id === openRequestId);
      if (targetEmail) {
        setSelectedEmailId(`targetEmail.id-draft`,);
        if(targetEmail.draft)
        onSelectEmail(targetEmail.draft, true);
        setExpandedEmails(prev => ({ ...prev, [targetEmail.id]: true }));
      }
    }
  }, [openRequestId, emails]);

  const toggleEmail = (emailId: string) => {
    setExpandedEmails((prevState) => ({
      ...prevState,
      [emailId]: !prevState[emailId],
    }));
  };

  const handleEmailClick = (email: Email, isDraft: boolean) => {
    setSelectedEmailId(isDraft ? `${email.id}-draft` : email.id);
    
    onSelectEmail((isDraft && email.draft) ? email.draft : email, isDraft);
  
  };
  

  const handleComposeNewEmail = () => {
    setShowNewEmailDialog(true);
  };

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
      <button className="compose-newemail" onClick={handleComposeNewEmail}>Compose New Email</button>
      <div className="email-list">
        {emails.map((email) => (
          <div key={email.id} className={`email-item ${selectedEmailId === email.id ? "active" : ""}`}>
            <div className="email-header">
              {(email.draft || email.history) && (
                <button className="toggle-icon" onClick={() => toggleEmail(email.id)}>
                  {expandedEmails[email.id] ? "▲" : "▼"}
                </button>
              )}
              <div
                className="avatar"
                style={{
                  backgroundColor: generateAvatarColor(email.sender),
                  color: 'black',
                }}
              >
                {email.sender[0].toUpperCase()}
              </div>
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
                      <span className="sender draft-label">[Draft] -</span> <span className="draft-header">{email.draft.subject}</span>
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
      {showNewEmailDialog && <NewEmail onClose={handleCloseDialog} onRefresh={fetchEmails} />}
    </div>
  );
};

export default EmailInbox;