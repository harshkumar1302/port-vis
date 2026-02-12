import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { token, newPassword } = req.body || {};

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Initialize Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
            error: "Server configuration missing (Supabase keys)"
        });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Verify token exists, is not used, and is not expired
        const { data: resetToken, error: tokenError } = await supabase
            .from("password_reset_tokens")
            .select("*")
            .eq("token", token)
            .eq("used", false)
            .single();

        if (tokenError || !resetToken) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(resetToken.expires_at);

        if (now > expiresAt) {
            return res.status(400).json({ error: "Reset token has expired" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password in admin_auth
        const { error: updateError } = await supabase
            .from("admin_auth")
            .update({ password_hash: passwordHash })
            .eq("email", resetToken.email);

        if (updateError) {
            console.error("Error updating password:", updateError);
            return res.status(500).json({ error: "Failed to update password" });
        }

        // Mark token as used
        await supabase
            .from("password_reset_tokens")
            .update({ used: true })
            .eq("token", token);

        // Send confirmation email
        const resend = new Resend(process.env.RESEND_API_KEY);

        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "Visheshkala <studio@vishakhagarg.com>",
                    to: resetToken.email,
                    subject: "Your Visheshkala Password Was Changed",
                    html: `
                        <div style="font-family: 'Georgia', serif; color: #4A3728; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAF9F6; border-radius: 20px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <img src="https://vishakhagarg.vercel.app/logo.png" alt="V.G Logo" style="width: 80px; height: 80px; object-fit: contain;" />
                            </div>
                            
                            <h1 style="color: #2C3E50; text-align: center; margin-bottom: 20px;">Password Changed Successfully</h1>
                            
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Hi,
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Your Visheshkala admin password was successfully changed.
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                You can now log in to your dashboard using your new password.
                            </p>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://visheshkala.com/admin" style="display: inline-block; padding: 16px 32px; background-color: #8D6E63; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
                                    Go to Dashboard
                                </a>
                            </div>
                            
                            <div style="background-color: #FFF3CD; border-left: 4px solid #FFC107; padding: 16px; margin: 30px 0; border-radius: 8px;">
                                <p style="font-size: 14px; line-height: 1.6; color: #856404; margin: 0;">
                                    <strong>⚠️ Security Alert:</strong> If you didn't make this change, someone may have unauthorized access to your account. Please contact support immediately.
                                </p>
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 40px 0;" />
                            
                            <p style="font-size: 12px; color: #999; text-align: center;">
                                Visheshkala Studio<br/>
                                Matchless offerings, from us to you.
                            </p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
                // Don't fail the request if email fails
            }
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (err) {
        console.error("Password reset error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
