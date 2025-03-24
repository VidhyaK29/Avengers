import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmailDetails from "./EmailDetails";
import { ToastContainer } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("EmailDetails Component", () => {
    const mockRefreshEmails = jest.fn();

    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      ) as jest.Mock;
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

  it("renders message when no email is selected", () => {
    render(<EmailDetails email={null} isDraft={false} refreshEmails={mockRefreshEmails} />);
    expect(screen.getByText("Select an email to view details.")).toBeInTheDocument();
  });

  it("renders new email form and submits successfully", async () => {
    const email = {
        id: "123",
        subject: "Test Email",
        sender: "sender@test.com",
        receiver: "receiver@test.com",
        message: "Hello, this is a test email.",
        timestamp: new Date().toISOString(),
      };
  
    render(<EmailDetails email={email} isDraft={false} refreshEmails={mockRefreshEmails} />);
  });

  it("renders received email correctly", () => {
    const email = {
      id: "123",
      subject: "Test Email",
      sender: "sender@test.com",
      receiver: "receiver@test.com",
      message: "Hello, this is a test email.",
      timestamp: new Date().toISOString(),
    };

    render(<EmailDetails email={email} isDraft={false} refreshEmails={mockRefreshEmails} />);

    expect(screen.getByText("Test Email")).toBeInTheDocument();
    expect(screen.getByText("TO : receiver@test.com")).toBeInTheDocument();
  });
});
