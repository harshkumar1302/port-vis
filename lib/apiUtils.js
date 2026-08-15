import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export const getSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

export const verifyOwner = (req) => {
  const token = req.headers.cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("owner_token="))
    ?.split("=")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!token || !jwtSecret) return { error: "Unauthorized", status: 401 };
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== "owner") return { error: "Forbidden", status: 403 };
    return { ok: true, email: decoded.email };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
};

export const isMissingTable = (error) =>
  error?.code === "42P01" ||
  error?.code === "PGRST205" ||
  /does not exist/i.test(error?.message || "");

export const tableMissingResponse = (res, tableName) =>
  res.status(503).json({
    error: `${tableName} table not set up yet. Run migrations/2026_08_new_apis.sql in Supabase.`,
    code: "TABLE_MISSING",
  });
