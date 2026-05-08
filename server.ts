import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import nodemailer from "nodemailer";
import twilio from "twilio";

const app = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000;
// ✅ MUST be at top
app.use(cors());
app.use(express.json());

// -------------------------
// HEALTH CHECK
// -------------------------
app.get("/healthz", (req, res) => {
  res.send("OK");
});

// -------------------------
// CONTACT API (FIXED)
// -------------------------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    console.log("Contact received:", req.body);

    res.json({ success: true, message: "Message received!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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

    res.json({ success: true, message: "Trip request sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// START SERVER
// -------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});