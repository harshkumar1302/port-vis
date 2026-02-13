import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { Resend } from "resend";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // Initialize Supabase with Service Role
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
            error: "Server configuration missing"
        });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Check if email exists (Silent fail if not found)
        const { data: user, error: userError } = await supabase
            .from("admin_auth")
            .select("email")
            .eq("email", email)
            .single();

        // 2. Definitive "Success" message path
        const successResponse = () => res.status(200).json({
            success: true,
            message: "If an account exists for this email, a reset link has been sent."
        });

        if (!user || userError) {
            return successResponse();
        }

        // 3. Generate secure random token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // 4. Store HASHED token in database
        const { error: tokenError } = await supabase
            .from("password_reset_tokens")
            .insert([{
                email,
                token: hashedToken, // Store the hash
                expires_at: expiresAt.toISOString(),
                used: false
            }]);

        if (tokenError) {
            console.error("Error storing reset token:", tokenError);
            // Still return success to prevent timing attacks/enumeration
            return successResponse();
        }

        // 5. Send reset email with RAW token
        const resend = new Resend(process.env.RESEND_API_KEY);
        const resetUrl = `https://visheshkala.com/reset-password?token=${rawToken}`;

        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "Visheshkala <studio@vishakhagarg.com>",
                    to: email,
                    subject: "Reset Your Visheshkala Password",
                    html: `
                        <div style="font-family: 'Georgia', serif; color: #4A3728; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAF9F6; border-radius: 20px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <img src="https://vishakhagarg.vercel.app/logo.png" alt="V.G Logo" style="width: 80px; height: 80px; object-fit: contain;" />
                            </div>
                            
                            <h1 style="color: #2C3E50; text-align: center; margin-bottom: 20px;">Reset Your Password</h1>
                            
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Hi,
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                We received a request to reset your Visheshkala admin password. Click the button below to create a new password:
                            </p>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background-color: #8D6E63; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
                                    Reset Password
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 20px;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="font-size: 12px; line-height: 1.6; color: #999; word-break: break-all; margin-bottom: 30px;">
                                ${resetUrl}
                            </p>
                            
                            <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 10px;">
                                <strong>This link expires in 1 hour.</strong>
                            </p>
                            
                            <p style="font-size: 14px; line-height: 1.6; color: #666;">
                                If you didn't request this password reset, you can safely ignore this email.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 40px 0;" />
                            
                            <p style="font-size: 12px; color: #999; text-align: center;">
                                Visheshkala Studio<br/>
                                Matchless offerings, from us to you.
                            </p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Error sending reset email:", emailError);
            }
        }

        return successResponse();

    } catch (err) {
        console.error("Password reset request error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}
