import type { ContactFormData } from "../types/contact";

type ContactPreviewProps = {
  form: ContactFormData;
};

const ContactPreview = ({ form }: ContactPreviewProps) => {
  return (
    <div className="contact-preview">
      <h3>Live Preview</h3>

      <p>
        <strong>Name:</strong> {form.name || "Your name"}
      </p>

      <p>
        <strong>Email:</strong> {form.email || "your@email.com"}
      </p>

      <p>
        <strong>Message:</strong>
      </p>

      <p>{form.message || "Your message will appear here..."}</p>
    </div>
  );
};

export default ContactPreview;