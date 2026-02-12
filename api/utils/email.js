import { Resend } from "resend";

export const sendWelcomeEmail = async (email) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Skipping email.");
        return;
    }

    try {
        await resend.emails.send({
            from: "Visheshkala <studio@vishakhagarg.com>", // You might need to verify a domain in Resend
            to: email,
            subject: "Welcome to your Artist Journey! ✨",
            html: `
        <div style="font-family: 'serif', 'Georgia', serif; color: #4A3728; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAF9F6; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://vishakhagarg.vercel.app/logo.png" alt="V.G Logo" style="width: 80px; height: 80px; object-fit: contain;" />
          </div>
          
          <h1 style="color: #2C3E50; text-align: center; margin-bottom: 20px;">Welcome, Artist! ✨</h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello from <strong>Visheshkala</strong>!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We are absolutely delighted to have you start this beautiful journey with us. Your account has been successfully created, and your master dashboard is now ready for your creative touch.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for being a part of this artistic story. We can't wait to see the magic you'll showcase here.
          </p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E5;">
            <p style="font-size: 14px; color: #8B735B; font-style: italic;">
              "Where soul meets craft..."
            </p>
            <p style="font-size: 12px; color: #A0704F; font-weight: bold; margin-top: 10px;">
              Visheshkala Art Studio
            </p>
          </div>
        </div>
      `,
        });
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
};
