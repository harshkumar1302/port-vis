import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import { sendWelcomeEmail } from "../lib/email.js";
import { verifyOwner, getSupabase } from "../lib/apiUtils.js";
import { siteEmailFrom } from "../lib/siteContact.js";

const COOKIE = "owner_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";
const SET_COOKIE = (token) =>
  `owner_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`;

const getJwtSecret = (res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server configuration error (JWT_SECRET missing)." });
    return null;
  }
  return secret;
};

async function handleLogin(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const jwtSecret = getJwtSecret(res);
  if (!jwtSecret) return;
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration missing." });

  const { email, password } = req.body || {};
  try {
    const { data: user, error } = await supabase.from("admin_auth").select("*").eq("email", email).single();
    if (error || !user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ email: user.email, role: "owner" }, jwtSecret, { expiresIn: "12h" });
    res.setHeader("Set-Cookie", SET_COOKIE(token));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: `Internal Server Error: ${err.message || "Unknown error"}` });
  }
}

async function handleLogout(_req, res) {
  res.setHeader("Set-Cookie", COOKIE);
  return res.status(200).json({ ok: true });
}

async function handleMe(req, res) {
  const cookies = req.headers.cookie;
  if (!cookies) return res.status(401).json({ error: "Unauthorized" });
  const token = cookies.split(";").find((c) => c.trim().startsWith("owner_token="))?.split("=")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const jwtSecret = getJwtSecret(res);
  if (!jwtSecret) return;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== "owner") return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    return res.status(200).json({ authenticated: true, email: decoded.email, role: decoded.role });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function handleRegister(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration missing (Supabase keys)." });

  try {
    const { count, error: countError } = await supabase.from("admin_auth").select("*", { count: "exact", head: true });
    if (countError) return res.status(500).json({ error: `Supabase error: ${countError.message}` });
    if (count > 0) return res.status(403).json({ error: "Registration closed. An owner account already exists." });

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const { error: insertError } = await supabase.from("admin_auth").insert([{ email, password_hash: passwordHash }]);
    if (insertError) return res.status(500).json({ error: `Failed to save user: ${insertError.message}` });

    try { await sendWelcomeEmail(email); } catch (e) { console.error("Welcome email failed:", e); }
    return res.status(200).json({ ok: true, message: "Owner registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: `Internal Server Error: ${err.message || "Unknown error"}` });
  }
}

async function handleChangePassword(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const auth = verifyOwner(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Current and new passwords are required" });
  if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters" });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration missing" });

  try {
    const { data: user, error: userError } = await supabase.from("admin_auth").select("*").eq("email", auth.email).single();
    if (userError || !user) return res.status(404).json({ error: "User not found" });
    if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    const newHash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    const { error: updateError } = await supabase.from("admin_auth").update({ password_hash: newHash }).eq("email", auth.email);
    if (updateError) return res.status(500).json({ error: "Failed to update password" });

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: siteEmailFrom(),
          to: auth.email,
          subject: "Your Visheshkala Password Was Changed",
          html: `<p>Your admin password was changed from your dashboard. If this wasn't you, reset it immediately.</p>`,
        });
      } catch (e) { console.error("Password change email failed:", e); }
    }
    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleRequestReset(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email is required" });
  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration missing" });

  const successResponse = () => res.status(200).json({
    success: true,
    message: "If an account exists for this email, a reset link has been sent.",
  });

  try {
    const { data: user } = await supabase.from("admin_auth").select("email").eq("email", email).single();
    if (!user) return successResponse();

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const { error: tokenError } = await supabase.from("password_reset_tokens").insert([{
      email, token: hashedToken, expires_at: expiresAt.toISOString(), used: false,
    }]);
    if (tokenError) { console.error("Reset token error:", tokenError); return successResponse(); }

    if (process.env.RESEND_API_KEY) {
      const resetUrl = `https://visheshkala.com/reset-password?token=${rawToken}`;
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: siteEmailFrom(),
          to: email,
          subject: "Reset Your Visheshkala Password",
          html: `<p><a href="${resetUrl}">Reset your password</a> (expires in 1 hour)</p>`,
        });
      } catch (e) { console.error("Reset email failed:", e); }
    }
    return successResponse();
  } catch (err) {
    console.error("Request reset error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleResetPassword(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) return res.status(400).json({ error: "Token and new password are required" });
  if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const supabase = getSupabase();
  if (!supabase) return res.status(500).json({ error: "Server configuration missing" });

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const { data: resetToken, error: tokenError } = await supabase
      .from("password_reset_tokens").select("*").eq("token", hashedToken).eq("used", false).single();
    if (tokenError || !resetToken) return res.status(400).json({ error: "Invalid or expired reset token" });
    if (new Date() > new Date(resetToken.expires_at)) return res.status(400).json({ error: "Reset token has expired" });

    const passwordHash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    const { error: updateError } = await supabase.from("admin_auth").update({ password_hash: passwordHash }).eq("email", resetToken.email);
    if (updateError) return res.status(500).json({ error: "Failed to update password" });
    await supabase.from("password_reset_tokens").update({ used: true }).eq("token", hashedToken);
    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const ACTIONS = {
  login: handleLogin,
  logout: handleLogout,
  me: handleMe,
  register: handleRegister,
  "change-password": handleChangePassword,
  "request-reset": handleRequestReset,
  "reset-password": handleResetPassword,
};

export default async function handler(req, res) {
  const action = req.query?.action;
  if (!action || !ACTIONS[action]) {
    return res.status(400).json({ error: "Unknown auth action. Use ?action=login|logout|me|register|change-password|request-reset|reset-password" });
  }
  return ACTIONS[action](req, res);
}
