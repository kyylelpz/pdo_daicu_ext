export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export type ContactResponse = {
  success: boolean;
  message?: string;
  errors?: ContactFormErrors;
};
