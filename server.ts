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

  // ✅ Health check (Render requirement)
  app.get("/healthz", (req, res) => {
    res.send("OK");
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
      // Email setup
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Twilio setup
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID as string,
        process.env.TWILIO_AUTH_TOKEN as string
      );

      const twilioPhone = process.env.TWILIO_PHONE_NUMBER || "";
      const ownerPhone = process.env.OWNER_PHONE || "";

      // Send SMS to client
      await twilioClient.messages.create({
        body: `Hi ${clientName}, your trip to ${destinationName} is received.`,
        from: twilioPhone,
        to: clientPhone,
      });

      res.json({ success: true, message: "Trip request sent!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // -------------------------
  // PRODUCTION / DEV MODE
  // -------------------------
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

  // -------------------------
  // START SERVER
  // -------------------------
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();