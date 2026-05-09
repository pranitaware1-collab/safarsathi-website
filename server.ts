import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import twilio from "twilio";

const app = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000;

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// NODEMAILER
// -------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------------
// SAFE MAIL FUNCTION
// -------------------------
const sendMailSafe = async (mailOptions: any) => {
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email timeout")), 10000)
    ),
  ]);
};

// -------------------------
// HEALTH CHECK
// -------------------------
app.get("/healthz", (req, res) => {
  res.send("OK");
});

// -------------------------
// CONTACT API
// -------------------------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    console.log("Contact received:", req.body);

    // EMAIL TO OWNER
    await sendMailSafe({
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // EMAIL TO USER
    await sendMailSafe({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We received your message - SafarSathi",
      text: `Hi ${name},

We received your message:

${message}

We will contact you soon.

- SafarSathi Team`,
    });

    res.json({
      success: true,
      message: "Emails sent successfully!",
    });

  } catch (err: any) {
    console.error("EMAIL ERROR:", err);

    res.status(500).json({
      error: err.message || "Server error",
    });
  }
});

// -------------------------
// PLAN TRIP API
// -------------------------
app.post("/api/plan-trip", async (req, res) => {
  const { clientName, clientEmail, clientPhone, destinationName } = req.body;

  if (!clientName || !clientEmail || !clientPhone || !destinationName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await twilioClient.messages.create({
      body: `Hi ${clientName}, trip to ${destinationName} confirmed.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: clientPhone,
    });

    res.json({
      success: true,
      message: "Trip request sent!",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});