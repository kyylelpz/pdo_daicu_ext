import { useState } from "react";
import ContactForm from "../components/ContactForm";
import ContactPreview from "../components/ContactPreview";
import { submitContactMessage } from "../services/contactService";
import type { ContactFormData } from "../types/contact";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setFeedback("");

    try {
      const data = await submitContactMessage(form);

      if (data.success) {
        setFeedback("Message sent successfully!");
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setFeedback(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setFeedback("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-card">
        <div>
          <h1>Contact Us</h1>
          <p>Send us a message and preview it live.</p>

          <ContactForm
            form={form}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          {feedback && <p className="feedback">{feedback}</p>}
        </div>

        <ContactPreview form={form} />
      </section>
    </main>
  );
};

export default ContactUs;