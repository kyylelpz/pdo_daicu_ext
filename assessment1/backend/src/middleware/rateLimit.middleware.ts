import type { Request, RequestHandler } from "express";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const clients = new Map<string, RateLimitEntry>();

const getClientKey = (req: Request) =>
  req.ip || req.socket.remoteAddress || "unknown-client";

export const contactRateLimiter = (
  windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  maxRequests = Number(process.env.CONTACT_RATE_LIMIT_MAX) || 5
): RequestHandler => {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req);
    const entry = clients.get(key);

    if (!entry || entry.resetAt <= now) {
      clients.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds.toString());

      return res.status(429).json({
        success: false,
        message: "Too many contact attempts. Please try again later.",
      });
    }

    entry.count += 1;
    return next();
  };
};
