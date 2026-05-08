import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import twilio from "twilio";


dotenv.config();

async function startServer() {
  const app = express();
const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API routes
  app.post("/api/plan-trip", async (req, res) => {
    const { clientName, clientEmail, clientPhone, destinationName } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !destinationName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for required environment variables
    const requiredEnvVars = [
      "EMAIL_USER", "EMAIL_PASS", 
      "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"
    ];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return res.status(500).json({ 
        error: "Configuration Error", 
        details: `The following environment variables are missing: ${missingVars.join(", ")}. Please set them in Settings > Secrets.` 
      });
    }

    try {
      // 1. Email to Owner and Admin
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const ownerEmail = process.env.OWNER_EMAIL || "suyogaware2@gmail.com";
      const adminEmail = process.env.ADMIN_EMAIL || "pranitaware1@gmail.com";

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${ownerEmail}, ${adminEmail}`,
        subject: `New Trip Inquiry: ${destinationName}`,
        text: `New trip inquiry received!\n\nClient Name: ${clientName}\nClient Email: ${clientEmail}\nClient Phone: ${clientPhone}\nDestination: ${destinationName}\n\nPlease contact the client to finalize the booking and payment (offline).`,
      };

      await transporter.sendMail(mailOptions);

      // 2. Twilio: SMS to Client and Call to Owner
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

     const twilioPhone = process.env.TWILIO_PHONE_NUMBER || "";
      const ownerPhone = process.env.OWNER_PHONE || "7972519926";

      // SMS to Client
      await twilioClient.messages.create({
        body: `Hello ${clientName}! Your booking for ${destinationName} is confirmed. Please note that payment will be taken offline. Our team will contact you soon.`,
        from: twilioPhone,
        to: clientPhone,
      });

      // Call to Owner
      await twilioClient.calls.create({
        twiml: `<Response><Say>Hello! You have a new trip inquiry for ${destinationName} from ${clientName}. Please check your email for details.</Say></Response>`,
        from: twilioPhone,
        to: ownerPhone,
      });

      res.json({ success: true, message: "Inquiry sent successfully!" });
    } catch (error: any) {
      console.error("Error processing trip inquiry:", error);
      
      let errorMessage = "Failed to process inquiry";
      let details = error.message;

      if (error.message.includes("Application-specific password required")) {
        errorMessage = "Gmail Authentication Error";
        details = "You are using a regular Gmail password. Google requires an 'App Password' for third-party apps. Please go to your Google Account > Security > 2-Step Verification > App Passwords to generate one, then update the EMAIL_PASS secret in Settings > Secrets.";
      }

      res.status(500).json({ 
        error: errorMessage, 
        details: details 
      });
    }
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for required environment variables
    const requiredEnvVars = ["EMAIL_USER", "EMAIL_PASS"];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return res.status(500).json({ 
        error: "Configuration Error", 
        details: `The following environment variables are missing: ${missingVars.join(", ")}. Please set them in Settings > Secrets.` 
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const ownerEmail = process.env.OWNER_EMAIL || "suyogaware2@gmail.com";
      const adminEmail = process.env.ADMIN_EMAIL || "pranitaware1@gmail.com";

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${ownerEmail}, ${adminEmail}`,
        subject: `New Contact Message from ${name}`,
        text: `You have a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Message sent successfully!" });
    } catch (error: any) {
      console.error("Error sending contact message:", error);
      
      let errorMessage = "Failed to send message";
      let details = error.message;

      if (error.message.includes("Application-specific password required")) {
        errorMessage = "Gmail Authentication Error";
        details = "You are using a regular Gmail password. Google requires an 'App Password' for third-party apps. Please go to your Google Account > Security > 2-Step Verification > App Passwords to generate one, then update the EMAIL_PASS secret in Settings > Secrets.";
      }

      res.status(500).json({ 
        error: errorMessage, 
        details: details 
      });
    }
  });

  // Vite middleware for development
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
