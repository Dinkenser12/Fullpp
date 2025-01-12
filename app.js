const express = require("express");
const multer = require("multer");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

// Paths for session and uploaded files
const sessionFilePath = "./auth_info.json";
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const { state, saveState } = useMultiFileAuthState(sessionFilePath);

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Baileys WhatsApp connection
let sock;

async function startWhatsAppSession() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using Baileys version: ${version}, latest: ${isLatest}`);

  async function startWhatsAppSession() {
      const { version, isLatest } = await fetchLatestBaileysVersion();
      console.log(`Using Baileys version: ${version}, latest: ${isLatest}`);

      try {
          sock = makeWASocket({
              version,
              auth: state,
              printQRInTerminal: true, // QR Code will appear in terminal
          });

          sock.ev.on("creds.update", saveState);

          sock.ev.on("connection.update", (update) => {
              const { connection, lastDisconnect } = update;
              if (connection === "close") {
                  const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== 401;
                  console.log("Connection closed, reconnecting:", shouldReconnect);
                  if (shouldReconnect) startWhatsAppSession();
              } else if (connection === "open") {
                  console.log("WhatsApp connected!");
              }
          });

          return sock;
      } catch (error) {
          console.error("Error starting WhatsApp session:", error);
      }
  }
}

// Helper function: Generate cropped profile picture
async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = Math.min(jimp.getWidth(), jimp.getHeight());
  const cropped = jimp.crop(0, 0, min, min);
  return {
    img: await cropped.scaleToFit(640, 640).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}

// Helper function: Update full profile picture
async function updatefullpp(jid, imgBuffer, client) {
  const { img } = await generateProfilePicture(imgBuffer);
  await client.query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

// Route: Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route: Handle image upload and update profile picture
app.post("/update-profile-pic", upload.single("profilePic"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const filePath = req.file.path;
    const imgBuffer = fs.readFileSync(filePath);

    // Ensure WhatsApp connection is active
    if (!sock) {
      sock = await startWhatsAppSession();
    }

    // Update the profile picture
    await updatefullpp(sock.user.id, imgBuffer, sock);
    console.log("Profile picture updated successfully!");

    // Logout from WhatsApp
    await sock.logout();
    console.log("Logged out successfully!");

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).send("Profile picture updated and logged out successfully.");
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).send("Failed to update profile picture.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Starting WhatsApp session...");
  await startWhatsAppSession();
});
