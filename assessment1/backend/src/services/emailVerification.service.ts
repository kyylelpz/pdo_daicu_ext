import EmailVerificationCache from "../models/EmailVerificationCache";

type QuickEmailVerificationResponse = {
  result?: "valid" | "invalid" | "unknown";
  reason?: string;
  safe_to_send?: boolean;
  success?: boolean;
  message?: string;
};

export type EmailVerificationResult = {
  email: string;
  isValid: boolean;
  reason: string;
};

const QUICK_EMAIL_VERIFICATION_URL =
  "https://api.quickemailverification.com/v1/verify";
const DEFAULT_VALID_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_INVALID_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const getCacheTtlMs = (isValid: boolean) => {
  const envValue = isValid
    ? process.env.EMAIL_VERIFICATION_VALID_CACHE_TTL_MS
    : process.env.EMAIL_VERIFICATION_INVALID_CACHE_TTL_MS;
  const parsedValue = Number(envValue);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return isValid ? DEFAULT_VALID_CACHE_TTL_MS : DEFAULT_INVALID_CACHE_TTL_MS;
};

const isFreshCache = (checkedAt: Date, isValid: boolean) =>
  Date.now() - checkedAt.getTime() <= getCacheTtlMs(isValid);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const fetchEmailVerification = async (
  email: string
): Promise<EmailVerificationResult> => {
  const apiKey = process.env.QUICKEMAILVERIFICATION_API_KEY;

  if (!apiKey) {
    throw new Error("QUICKEMAILVERIFICATION_API_KEY is missing in .env");
  }

  const url = new URL(QUICK_EMAIL_VERIFICATION_URL);
  url.searchParams.set("email", email);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  const data = (await response.json()) as QuickEmailVerificationResponse;

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Unable to verify recipient email address."
    );
  }

  return {
    email,
    isValid: data.result === "valid" && data.safe_to_send !== false,
    reason: data.reason || data.result || "unknown",
  };
};

export const verifyRecipientEmail = async (
  email: string
): Promise<EmailVerificationResult> => {
  const normalizedEmail = normalizeEmail(email);
  const cachedResult = await EmailVerificationCache.findOne({
    email: normalizedEmail,
  }).lean();

  if (
    cachedResult &&
    isFreshCache(cachedResult.checkedAt, cachedResult.isValid)
  ) {
    return {
      email: normalizedEmail,
      isValid: cachedResult.isValid,
      reason: cachedResult.reason,
    };
  }

  const verificationResult = await fetchEmailVerification(normalizedEmail);

  await EmailVerificationCache.findOneAndUpdate(
    { email: normalizedEmail },
    {
      email: normalizedEmail,
      isValid: verificationResult.isValid,
      reason: verificationResult.reason,
      checkedAt: new Date(),
    },
    { upsert: true }
  );

  return verificationResult;
};

export const verifyRecipientEmails = async (emails: string[]) => {
  const uniqueEmails = [...new Set(emails.map(normalizeEmail))];
  const results = await Promise.all(uniqueEmails.map(verifyRecipientEmail));

  return {
    validRecipients: results
      .filter((result) => result.isValid)
      .map((result) => result.email),
    invalidRecipients: results.filter((result) => !result.isValid),
  };
};
