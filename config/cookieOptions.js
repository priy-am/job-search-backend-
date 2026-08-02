/**
 * Centralized cookie options helper for production deployment on Render & Vercel.
 * Cross-site cookies (Vercel -> Render) MUST have sameSite: "none" and secure: true over HTTPS.
 */
export const getCookieOptions = () => {
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    process.env.VERCEL === "1";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};
