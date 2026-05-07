import { useState } from "react";
import ContactForm from "../components/ContactForm";
import ContactPreview from "../components/ContactPreview";
import { submitContactMessage } from "../services/contactService";
import type { ContactFormData, ContactFormErrors } from "../types/contact";
import "../styles/ContactUs.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FeedbackMessage = {
  message: string;
  type: "success" | "error";
};

const formatInvalidRecipientsMessage = (
  recipients: { email: string; reason: string }[]
) => {
  const recipientList = recipients
    .map((recipient) => `${recipient.email} (${recipient.reason})`)
    .join(", ");

  return `The following recipient email address is invalid or unsafe to send: ${recipientList}.`;
};

const validateForm = (form: ContactFormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > 254) {
    errors.email = "Email must be 254 characters or fewer.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length > 1000) {
    errors.message = "Message must be 1000 characters or fewer.";
  }

  return errors;
};

const ContactUs = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);

  const currentErrors = validateForm(form);
  const isValid = Object.keys(currentErrors).length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const nextForm = {
      ...form,
      [name]: value,
    };

    setForm(nextForm);
    setErrors(validateForm(nextForm));
    setFeedback([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback([
        {
          message: "Please correct the highlighted fields.",
          type: "error",
        },
      ]);
      return;
    }

    setLoading(true);
    setFeedback([]);

    try {
      const data = await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      if (data.success) {
        const nextFeedback: FeedbackMessage[] = [
          {
            message: "Message sent successfully.",
            type: "success",
          },
        ];

        if (data.invalidRecipients?.length) {
          nextFeedback.push({
            message: formatInvalidRecipientsMessage(data.invalidRecipients),
            type: "error",
          });
        }

        setFeedback(nextFeedback);
        setForm({
          name: "",
          email: "",
          message: "",
        });
        setErrors({});
      } else {
        setErrors(data.errors ?? {});
        setFeedback([
          {
            message: data.message || "Failed to send message.",
            type: "error",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      const response = error instanceof Error ? (error as Error & {
        response?: { message?: string; errors?: ContactFormErrors };
      }).response : undefined;

      setErrors(response?.errors ?? {});
      setFeedback([
        {
          message: response?.message || "Server error. Please try again.",
          type: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-layout">
        <section className="contact-shell">
          <div className="contact-panel">
            <h1>Contact Us</h1>
            <p className="contact-intro">
              Send us a message and we'll get back to you as soon as possible.
            </p>

            <ContactForm
              errors={errors}
              form={form}
              isValid={isValid}
              loading={loading}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            {feedback.length > 0 && (
              <div className="feedback-list" role="status">
                {feedback.map((item) => (
                  <p
                    className={`feedback feedback-${item.type}`}
                    key={`${item.type}-${item.message}`}
                  >
                    {item.message}
                  </p>
                ))}
              </div>
            )}
          </div>

          <ContactPreview form={form} />
        </section>

        <footer className="contact-footer">
          &copy; 2026 Kyle Lemuel Lopez
        </footer>
      </div>
    </main>
  );
};

export default ContactUs;
