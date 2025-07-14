import { Subscriber }from "../models/subscriberSchema.js"
import nodemailer from "nodemailer"

export const handleSubscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is Required" });
  try {

    const existing = await Subscriber.findOne({email});
    if(existing) return res.status(400).json({message: "Already subscribed"});
    await Subscriber.create({email});

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You're Subscribed to JobSearch 🚀",
      html: `
        <h2>Thank you for subscribing!</h2>
        <p>You'll receive updates about the latest jobs and opportunities.</p>
        <br/>
        <p>Regards,<br/>JobSearch Team</p>
      `,
    };

    await transporter.sendMail(mailOptions)

    res.status(200).json({message: "Subscribed successfully!"})

  } catch (error) {
    console.log("Subscription Error: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
