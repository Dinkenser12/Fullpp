<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WhatsApp Profile Picture Update</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <style>
    /* Embedded CSS for a cleaner demo */
    body {
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: #f9f9f9;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      width: 100%;
      max-width: 600px;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 50px;
    }

    header {
      text-align: center;
      margin-bottom: 20px;
    }

    header h1 {
      font-size: 24px;
      margin: 0;
      color: #444;
    }

    header p {
      font-size: 14px;
      color: #666;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-group input[type="file"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 14px;
    }

    button {
      width: 100%;
      padding: 10px 15px;
      background: #28a745;
      color: #fff;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    button:hover {
      background: #218838;
    }

    #qrCodeContainer {
      display: none;
      text-align: center;
      margin-top: 20px;
    }

    #qrCodeContainer img {
      width: 250px;
      height: 250px;
      object-fit: cover;
      border: 1px solid #ddd;
      border-radius: 10px;
    }

    #status {
      margin-top: 20px;
      font-size: 14px;
      color: #d9534f;
      text-align: center;
    }

    footer {
      margin-top: auto;
      padding: 10px;
      font-size: 12px;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>WhatsApp Profile Picture Update</h1>
      <p>Upload a picture and scan the QR code to update your profile picture.</p>
    </header>

    <main>
      <!-- File Upload Form -->
      <form id="uploadForm" enctype="multipart/form-data">
        <div class="form-group">
          <label for="profilePic">Choose a Picture:</label>
          <input type="file" id="profilePic" name="profilePic" accept="image/*" required />
        </div>
        <button type="submit">Upload Picture</button>
      </form>

      <!-- QR Code and Status Section -->
      <div id="qrCodeContainer">
        <h2>Scan the QR Code</h2>
        <div id="qrCode"></div>
        <p>Scan the QR code with WhatsApp to complete the update process.</p>
      </div>

      <div id="status"></div>
    </main>

    <footer>
      <p>© 2025 WhatsApp Profile Manager. All rights reserved.</p>
    </footer>
  </div>

  <script>
    const uploadForm = document.getElementById("uploadForm");
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const qrCodeDiv = document.getElementById("qrCode");
    const statusDiv = document.getElementById("status");

    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusDiv.textContent = "";
      qrCodeContainer.style.display = "none";

      const formData = new FormData(uploadForm);

      try {
        // Step 1: Upload file
        statusDiv.textContent = "Uploading picture...";
        const uploadResponse = await fetch("/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(await uploadResponse.text());
        }

        statusDiv.textContent = "Picture uploaded successfully! Fetching QR code...";

        // Step 2: Fetch QR Code
        const qrResponse = await fetch("/start-session");
        const qrData = await qrResponse.json();

        if (qrData.qr) {
          qrCodeDiv.innerHTML = `<img src="${qrData.qr}" alt="QR Code" />`;
          qrCodeContainer.style.display = "block";
          statusDiv.textContent = "Scan the QR code to complete the process.";
        } else {
          throw new Error("Failed to generate QR code.");
        }
      } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
      }
    });
  </script>
</body>
</html>
