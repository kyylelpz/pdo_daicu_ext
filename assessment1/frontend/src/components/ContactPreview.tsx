import type { ContactFormData } from "../types/contact";

type ContactPreviewProps = {
  form: ContactFormData;
};

const ContactPreview = ({ form }: ContactPreviewProps) => {
  return (
    <aside className="contact-preview" aria-label="Message preview">
      <p className="preview-label">Live Preview</p>

      <div className="preview-email-card">
        <div className="preview-banner">
          <h2>PDO-DAICU Contact Form</h2>
          <span>New inquiry received from the website</span>
        </div>

        <div className="preview-body">
          <p className="preview-intro">
            A new contact form submission has been received. Please review the
            details below.
          </p>

          <div className="preview-details">
            <p>
              <strong>Name:</strong> {form.name || "Your name"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={form.email ? `mailto:${form.email}` : undefined}>
                {form.email || "your@email.com"}
              </a>
            </p>
          </div>

          <section className="preview-message">
            <h3>Message</h3>
            <p>{form.message || "Your message will appear here..."}</p>
          </section>
        </div>
      </div>

      <p className="preview-note">
        This is a preview of how your message will appear before the email is
        sent.
      </p>
    </aside>
  );
};

export default ContactPreview;
