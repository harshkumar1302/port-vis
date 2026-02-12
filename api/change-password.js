import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Verify user is authenticated
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = cookies
        .split(";")
        .find((c) => c.trim().startsWith("owner_token="))
        ?.split("=")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    let userEmail;
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ error: "Server configuration error" });
        }
        const decoded = jwt.verify(token, jwtSecret);
        userEmail = decoded.email;
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }

    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters" });
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
        // Get current user
        const { data: user, error: userError } = await supabase
            .from("admin_auth")
            .select("*")
            .eq("email", userEmail)
            .single();

        if (userError || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        const { error: updateError } = await supabase
            .from("admin_auth")
            .update({ password_hash: newPasswordHash })
            .eq("email", userEmail);

        if (updateError) {
            console.error("Error updating password:", updateError);
            return res.status(500).json({ error: "Failed to update password" });
        }

        // Send confirmation email
        const resend = new Resend(process.env.RESEND_API_KEY);

        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "Visheshkala <studio@vishakhagarg.com>",
                    to: userEmail,
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
                                Your Visheshkala admin password was successfully changed from your dashboard.
                            </p>
                            
                            <div style="background-color: #FFF3CD; border-left: 4px solid #FFC107; padding: 16px; margin: 30px 0; border-radius: 8px;">
                                <p style="font-size: 14px; line-height: 1.6; color: #856404; margin: 0;">
                                    <strong>⚠️ Security Alert:</strong> If you didn't make this change, someone may have unauthorized access to your account. Please reset your password immediately.
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
            message: "Password updated successfully"
        });

    } catch (err) {
        console.error("Password change error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
