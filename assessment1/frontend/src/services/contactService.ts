import type { ContactFormData } from "../types/contact";

const API_URL = "http://localhost:5000/api/contact";

export const submitContactMessage = async (form: ContactFormData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit message");
  }

  return data;
};