import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import twilio from "twilio";

async function startServer() {
  const app = express();

  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // HEALTH CHECK (ADD THIS)
  app.get("/healthz", (req, res) => {
    res.send("OK");
  });

  // API routes
  app.post("/api/plan-trip", async (req, res) => {
    const { clientName, clientEmail, clientPhone, destinationName } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !destinationName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );

      const twilioPhone = process.env.TWILIO_PHONE_NUMBER || "";
      const ownerPhone = process.env.OWNER_PHONE || "";

      await twilioClient.messages.create({
        body: `Hello ${clientName}! Booking received for ${destinationName}`,
        from: twilioPhone,
        to: clientPhone,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();