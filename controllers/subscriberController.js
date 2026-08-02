import { Subscriber } from "../models/subscriberSchema.js";
import nodemailer from "nodemailer";

export const handleSubscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ message: "Already subscribed" });

    await Subscriber.create({ email });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "You're Subscribed to JobSearch 🚀",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #3c65f5;">Thank you for subscribing!</h2>
              <p>You will receive updates about the latest jobs and career opportunities.</p>
              <br/>
              <p>Best regards,<br/><strong>JobSearch Team</strong></p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error("Nodemailer Email Error (Non-blocking):", mailError.message);
      }
    }

    res.status(200).json({ message: "Subscribed successfully!", success: true });
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
