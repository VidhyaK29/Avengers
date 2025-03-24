import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { toast } from "react-toastify";

const NewEmailDialog: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  // Update the email body when transcript changes
  useEffect(() => {
    setEmailData((prev) => ({ ...prev, body: transcript }));
  }, [transcript]);

  // Handle input changes and update emailData state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const emailInput = `\nFrom: customer12@business.com\nTo: ${emailData.to}\nSubject: ${emailData.subject}\nBody: ${emailData.body}`;

    const requestBody = { input: emailInput };

    setLoading(true);
    toast.info("Sending email...", { autoClose: false });

    try {
      const response = await fetch("https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      toast.dismiss();
      if (response.ok) {
        toast.success("Email sent successfully!");
        setEmailData({ subject: "", to: "", body: "" }); // Reset form after success
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-96 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-2">New Mail</h2>

      {!browserSupportsSpeechRecognition && (
        <p className="text-red-500">Your browser does not support speech recognition.</p>
      )}

      <input
        type="text"
        name="to"
        placeholder="Recipients"
        value={emailData.to}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={emailData.subject}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />

      <textarea
        name="body"
        placeholder="Body Text"
        value={emailData.body}
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2 h-32"
      />

      <div className="flex items-center gap-2">
        <button onClick={() => SpeechRecognition.startListening({ continuous: true })} className="p-2 bg-blue-500 text-white rounded-full">
          Start
        </button>

        <button onClick={SpeechRecognition.stopListening} className="p-2 bg-red-500 text-white rounded-full">
          Stop
        </button>

        <button onClick={resetTranscript} className="p-2 bg-gray-500 text-white rounded-full">
          Reset
        </button>
      </div>

      <button
        className="mt-4 w-full p-2 bg-blue-600 text-white rounded-lg"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Mail"}
      </button>
    </div>
  );
};

export default NewEmailDialog;
