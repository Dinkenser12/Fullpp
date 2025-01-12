const express = require("express");
const multer = require("multer");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const Jimp = require("jimp");
const qrcode = require("qrcode");
const path = require("path");
const fs = require("fs");

// Paths for session and uploaded files
const sessionDir = "./auth_info";
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);

let authState;
let saveState;

// Initialize Express app
const app = express();
app.use(express.static("public"));
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Baileys WhatsApp connection
let sock;
let uploadedFilePath = "";

// Initialize the authentication state
async function initializeAuthState() {
  const auth = await useMultiFileAuthState(sessionDir);
  authState = auth.state;
  saveState = auth.saveState;
}

// Start the WhatsApp session
async function startWhatsAppSession(res) {
  const { version } = await fetchLatestBaileysVersion();
  sock = makeWASocket({
    version,
    auth: authState,
    printQRInTerminal: true, // Show QR in terminal
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr } = update;

    if (qr) {
      const qrCodeImage = await qrcode.toDataURL(qr);
      res.json({ qr: qrCodeImage });
    }

    if (connection === "open") {
      console.log("WhatsApp connected!");
      const imgBuffer = fs.readFileSync(uploadedFilePath);
      await updateProfilePicture(sock.user.id, imgBuffer, sock);

      console.log("Profile picture updated!");
      await sock.logout();
      console.log("Logged out!");
      fs.unlinkSync(uploadedFilePath); // Clean up uploaded file
    }
  });
}

// Helper functions
async function updateProfilePicture(jid, buffer, client) {
  const { img } = await generateProfilePicture(buffer);
  await client.query({
    tag: "iq",
    attrs: { to: jid, type: "set", xmlns: "w:profile:picture" },
    content: [{ tag: "picture", attrs: { type: "image" }, content: img }],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = Math.min(jimp.getWidth(), jimp.getHeight());
  const cropped = jimp.crop(0, 0, min, min);
  return {
    img: await cropped.scaleToFit(640, 640).getBufferAsync(Jimp.MIME_JPEG),
  };
}

// Route: Handle file upload
app.post("/upload-file", upload.single("profilePic"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  uploadedFilePath = req.file.path;
  res.status(200).send("File uploaded successfully.");
});

// Route: Start WhatsApp session and return QR code
app.get("/start-session", async (req, res) => {
  try {
    if (!authState) {
      await initializeAuthState();
    }
    await startWhatsAppSession(res);
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).send("Failed to start WhatsApp session.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Initializing authentication state...");
  await initializeAuthState();
});
