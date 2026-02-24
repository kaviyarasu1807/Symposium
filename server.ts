import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Database from "better-sqlite3";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Database setup
const db = new Database("velonix.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    fullName TEXT,
    collegeName TEXT,
    department TEXT,
    year TEXT,
    email TEXT,
    phone TEXT,
    selectedEvents TEXT,
    transactionId TEXT,
    screenshotPath TEXT,
    status TEXT DEFAULT 'pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
`);

// Seed admin if not exists
const adminCount = db.prepare("SELECT count(*) as count FROM admin").get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);
  db.prepare("INSERT INTO admin (username, password) VALUES (?, ?)").run("admin", hashedPassword);
}

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Auth Middleware
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API Routes ---

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare("SELECT * FROM admin WHERE username = ?").get(username) as any;

  if (admin && bcrypt.compareSync(password, admin.password)) {
    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Registration
app.post("/api/register", upload.single("screenshot"), async (req, res) => {
  try {
    const { fullName, collegeName, department, year, email, phone, selectedEvents, transactionId } = req.body;
    const screenshotPath = req.file ? `/uploads/${req.file.filename}` : "";
    const registrationId = "VEL-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    db.prepare(`
      INSERT INTO registrations (id, fullName, collegeName, department, year, email, phone, selectedEvents, transactionId, screenshotPath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(registrationId, fullName, collegeName, department, year, email, phone, selectedEvents, transactionId, screenshotPath);

    // Generate QR Code for ticket
    const qrCodeData = await QRCode.toDataURL(registrationId);

    // Send Emails (Optional: only if SMTP is configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Student Email
      const studentMailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: `Registration Confirmed - VELONIX'2K26`,
        html: `
          <h1>Registration Successful!</h1>
          <p>Hi ${fullName},</p>
          <p>You have successfully registered for VELONIX'2K26.</p>
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>College:</strong> ${collegeName}</p>
          <p><strong>Events:</strong> ${selectedEvents}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p>Please show the attached QR code at the registration desk on the event day.</p>
          <img src="${qrCodeData}" alt="QR Code Ticket" />
        `,
      };
      transporter.sendMail(studentMailOptions).catch(console.error);

      // Admin Alert
      const adminMailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `New Registration Alert - ${registrationId}`,
        html: `
          <h2>New Registration Received</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>College:</strong> ${collegeName}</p>
          <p><strong>Events:</strong> ${selectedEvents}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><a href="${process.env.APP_URL}${screenshotPath}">View Payment Screenshot</a></p>
        `,
      };
      transporter.sendMail(adminMailOptions).catch(console.error);
    }

    res.json({ success: true, registrationId, qrCodeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Admin: Get Registrations
app.get("/api/admin/registrations", authenticateAdmin, (req, res) => {
  const registrations = db.prepare("SELECT * FROM registrations ORDER BY timestamp DESC").all();
  res.json(registrations);
});

// Admin: Update Status
app.post("/api/admin/update-status", authenticateAdmin, (req, res) => {
  const { id, status } = req.body;
  db.prepare("UPDATE registrations SET status = ? WHERE id = ?").run(status, id);
  res.json({ success: true });
});

// Admin: Stats
app.get("/api/admin/stats", authenticateAdmin, (req, res) => {
  const total = db.prepare("SELECT count(*) as count FROM registrations").get() as any;
  const pending = db.prepare("SELECT count(*) as count FROM registrations WHERE status = 'pending'").get() as any;
  const approved = db.prepare("SELECT count(*) as count FROM registrations WHERE status = 'approved'").get() as any;
  
  // Event-wise counts
  const allRegs = db.prepare("SELECT selectedEvents FROM registrations").all() as any[];
  const eventCounts: Record<string, number> = {};
  allRegs.forEach(reg => {
    const events = reg.selectedEvents.split(",");
    events.forEach((e: string) => {
      const trimmed = e.trim();
      if (trimmed) eventCounts[trimmed] = (eventCounts[trimmed] || 0) + 1;
    });
  });

  res.json({
    total: total.count,
    pending: pending.count,
    approved: approved.count,
    eventCounts
  });
});

// Contact Form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
    transporter.sendMail(mailOptions).catch(console.error);
  }
  res.json({ success: true });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
