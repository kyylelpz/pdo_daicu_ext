import Button from "./Button";
import type { ContactFormData, ContactFormErrors } from "../types/contact";

type ContactFormProps = {
  form: ContactFormData;
  errors: ContactFormErrors;
  isValid: boolean;
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ContactForm = ({
  form,
  errors,
  isValid,
  loading,
  onChange,
  onSubmit,
}: ContactFormProps) => {
  return (
    <form className="contact-form" noValidate onSubmit={onSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          id="name"
          maxLength={80}
          name="name"
          placeholder="Kyle Lemuel Lopez"
          required
          type="text"
          value={form.name}
          onChange={onChange}
        />
        {errors.name && (
          <span className="field-error" id="name-error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          id="email"
          maxLength={254}
          name="email"
          placeholder="lopez.kyle922@gmail.com"
          required
          type="email"
          value={form.email}
          onChange={onChange}
        />
        {errors.email && (
          <span className="field-error" id="email-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={Boolean(errors.message)}
          id="message"
          maxLength={2000}
          name="message"
          placeholder="How can we help?"
          required
          value={form.message}
          onChange={onChange}
        />
        <div className="field-meta">
          {errors.message ? (
            <span className="field-error" id="message-error">
              {errors.message}
            </span>
          ) : (
            <span> </span>
          )}
          <span>{form.message.length}/1000</span>
        </div>
      </div>

      <Button disabled={loading || !isValid} type="submit">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
