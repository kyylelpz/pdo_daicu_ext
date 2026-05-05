import type { ContactFormData } from "../types/contact";

type ContactFormProps = {
  form: ContactFormData;
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ContactForm = ({ form, loading, onChange, onSubmit }: ContactFormProps) => {
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        value={form.name}
        onChange={onChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={form.email}
        onChange={onChange}
      />

      <textarea
        name="message"
        placeholder="Your message"
        value={form.message}
        onChange={onChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;