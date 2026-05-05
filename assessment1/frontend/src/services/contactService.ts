import type { ContactFormData, ContactResponse } from "../types/contact";

const API_URL =
  import.meta.env.VITE_CONTACT_API_URL ?? "http://localhost:5000/api/contact";

export const submitContactMessage = async (
  form: ContactFormData
): Promise<ContactResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to submit message");
    Object.assign(error, { response: data });
    throw error;
  }

  return data;
};
