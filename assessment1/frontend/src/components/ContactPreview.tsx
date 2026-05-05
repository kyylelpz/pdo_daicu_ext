import type { ContactFormData } from "../types/contact";

type ContactPreviewProps = {
  form: ContactFormData;
};

const ContactPreview = ({ form }: ContactPreviewProps) => {
  return (
    <aside className="contact-preview" aria-label="Message preview">
      <div className="preview-header">
        <span>Live Preview</span>
        <strong>{form.name || "Your name"}</strong>
      </div>

      <dl>
        <div>
          <dt>Email</dt>
          <dd>{form.email || "your@email.com"}</dd>
        </div>

        <div>
          <dt>Message</dt>
          <dd>{form.message || "Your message will appear here..."}</dd>
        </div>
      </dl>

      <p className="preview-note">This is how your message will be reviewed before we reply.</p>
    </aside>
  );
};

export default ContactPreview;
