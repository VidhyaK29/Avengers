import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Minus, MoveDiagonal, Square, X } from "lucide-react";
import { toast } from "react-toastify";
import { Send, Mic, Paperclip, Link, Image, Trash2 } from "lucide-react";
import { authService } from "../../services/app.data.service";

const NewEmailDialog: React.FC<{ onClose: () => void; onRefresh: () => void }> = ({ onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const bodyRef = useRef<HTMLDivElement>(null);

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  // Update the email body when content changes
  const handleBodyChange = () => {
    if (bodyRef.current) {
      setEmailData(prev => ({
        ...prev,
        body: bodyRef.current?.innerText || ""
      }));
    }
  };

  // Handle paste to remove formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Update the contenteditable div when transcript changes
  useEffect(() => {
    if (bodyRef.current && transcript) {
      bodyRef.current.innerText = transcript;
      // Move cursor to end
      const range = document.createRange();
      range.selectNodeContents(bodyRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      handleBodyChange();
    }
  }, [transcript]);

  // Handle input changes for other fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const customerEmail = sessionStorage.getItem("customerData")
      ? JSON.parse(authService.getUserData() || '{}').email
      : "customer13@businessmail.com";

    const emailInput = `\nFrom: ${customerEmail}\nTo: ${emailData.to}\nSubject: ${emailData.subject}\nBody: ${emailData.body}`;
    const requestBody = { input: emailInput };

    setLoading(true);
    toast.info("Sending email...", { autoClose: false });

    try {
      const response = await fetch("https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      onClose();
      if (response.ok) {
        toast.success("Email sent successfully!");
        setEmailData({ subject: "", to: "", body: "" });
        if (bodyRef.current) bodyRef.current.innerText = "";
        onRefresh();
      } else {
        toast.error("Failed to send email.");
        onRefresh();
      }
    } catch (error) {
      toast.error("Error sending email.");
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mailComposer">
      <div className="header-section">
        <span>New Mail</span>
        <div className="actions">

          <button className="close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="fields">
        <input
          type="text"
          name="to"
          placeholder="Recipients"
          value={emailData.to}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={emailData.subject}
          onChange={handleInputChange}
          className="input"
        />
      </div>
      <div className="body-container-content"
      >
        <div
         className="content-editable"
          ref={bodyRef}
          contentEditable
          onInput={handleBodyChange}
          onPaste={handlePaste}
          style={{ height: '300px' , fontSize: '12px', outline: 'none', border: 'none', padding: '15px'}} // or use dynamic height calculation here
        />

      </div>


      <div className="footer">
        <div className="sendmailButton">
          <button className="sendButton" onClick={handleSubmit} disabled={loading}>
            <Send size={16} /> <span>{loading ? "Sending..." : "Send Mail"}</span>
          </button>
          <div className="icons">
            {listening ? (
              <Square size={16} onClick={SpeechRecognition.stopListening} />
            ) : (
              <Mic size={16} onClick={() => SpeechRecognition.startListening({ continuous: true })} />
            )}
            <Paperclip size={16} />
            <Link size={16} />
            <Image size={16} />
          </div>
        </div>
        <Trash2 className="delete" size={16} onClick={onClose} />
      </div>
    </div>
  );
};

export default NewEmailDialog;