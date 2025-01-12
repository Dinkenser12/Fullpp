<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WhatsApp Profile Picture Update</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="container">
    <header>
      <h1>Update Your WhatsApp Profile Picture</h1>
      <p>Upload a new profile picture for your WhatsApp account effortlessly.</p>
    </header>

    <main>
      <form id="uploadForm" enctype="multipart/form-data">
        <div class="form-group">
          <label for="profilePic">Choose a Picture:</label>
          <input type="file" id="profilePic" name="profilePic" accept="image/*" required />
        </div>
        <button type="submit" id="submitBtn">Update Profile Picture</button>
      </form>
      <div id="status"></div>
      <div id="loadingSpinner" class="spinner hidden"></div>
    </main>

    <footer>
      <p>© 2025 WhatsApp Profile Manager. All rights reserved.</p>
    </footer>
  </div>

  <script>
    const form = document.getElementById("uploadForm");
    const statusDiv = document.getElementById("status");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        // Reset status and show loading
        statusDiv.textContent = "";
        statusDiv.className = "";
        submitBtn.disabled = true;
        loadingSpinner.classList.remove("hidden");

        const response = await fetch("/update-profile-pic", {
          method: "POST",
          body: formData,
        });

        // Hide loading and re-enable button
        loadingSpinner.classList.add("hidden");
        submitBtn.disabled = false;

        if (response.ok) {
          statusDiv.textContent = "Profile picture updated successfully!";
          statusDiv.className = "success";
        } else {
          const errorText = await response.text();
          statusDiv.textContent = `Error: ${errorText}`;
          statusDiv.className = "error";
        }
      } catch (error) {
        loadingSpinner.classList.add("hidden");
        submitBtn.disabled = false;
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.className = "error";
      }
    });
  </script>
</body>
</html>
  
