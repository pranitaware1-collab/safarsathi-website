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

  // =========================
  // HEALTH CHECK (Render)
  // =========================
  app.get("/healthz", (req, res) => {
    res.send("OK");
  });

  // =========================
  // PLAN TRIP API
  // =========================
  app.post("/api/plan-trip", async (req, res) => {
    const {
      clientName,
      clientEmail,
      clientPhone,
      destinationName,
    } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !destinationName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Email setup (optional use)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Twilio setup
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const twilioPhone = process.env.TWILIO_PHONE_NUMBER || "";

      // Send SMS
      await twilioClient.messages.create({
        body: `Hi ${clientName}, your trip to ${destinationName} is received.`,
        from: twilioPhone,
        to: clientPhone,
      });

      res.json({
        success: true,
        message: "Trip request sent successfully!",
      });
    } catch (error) {
      console.error("Plan trip error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // =========================
  // CONTACT API (FIXED)
  // =========================
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      console.log("Contact form received:", req.body);

      // OPTIONAL: nodemailer use here
      // await transporter.sendMail(...)

      res.json({
        success: true,
        message: "Message received successfully!",
      });
    } catch (error) {
      console.error("Contact API error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // =========================
  // VITE DEV / PROD SETUP
  // =========================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // =========================
  // START SERVER
  // =========================
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();