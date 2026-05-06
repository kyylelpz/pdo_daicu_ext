export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactValidationResult =
  | {
      isValid: true;
      data: ContactInput;
    }
  | {
      isValid: false;
      errors: Partial<Record<keyof ContactInput, string>>;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = {
  name: 80,
  email: 254,
  message: 1000,
};

const normalizeValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const validateContactInput = (body: unknown): ContactValidationResult => {
  const payload =
    body && typeof body === "object"
      ? (body as Partial<Record<keyof ContactInput, unknown>>)
      : {};

  const data: ContactInput = {
    name: normalizeValue(payload.name),
    email: normalizeValue(payload.email).toLowerCase(),
    message: normalizeValue(payload.message),
  };

  const errors: Partial<Record<keyof ContactInput, string>> = {};

  if (!data.name) {
    errors.name = "Name is required.";
  } else if (data.name.length > LIMITS.name) {
    errors.name = `Name must be ${LIMITS.name} characters or fewer.`;
  }

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (data.email.length > LIMITS.email) {
    errors.email = `Email must be ${LIMITS.email} characters or fewer.`;
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.message) {
    errors.message = "Message is required.";
  } else if (data.message.length > LIMITS.message) {
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    data,
  };
};

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());
