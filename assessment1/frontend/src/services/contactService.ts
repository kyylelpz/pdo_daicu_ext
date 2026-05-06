import type { ContactFormData, ContactResponse } from "../types/contact";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";
const buildApiUrl = (path: string) =>
  `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export const submitContactMessage = async (
  form: ContactFormData
): Promise<ContactResponse> => {
  const response = await fetch(buildApiUrl("/contact"), {
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
