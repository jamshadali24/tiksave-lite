const form = document.getElementById("downloadForm");
const urlInput = document.getElementById("url");
const status = document.getElementById("status");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "Please paste a media URL.";
    return;
  }

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error();
    }

    status.textContent = "Checking link...";

    const response = await fetch(
      "https://tiksave-lite.jamshaidaliakhtar.workers.dev/api/download",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mediaUrl: url
        })
      }
    );

    const data = await response.json();

    if (data.downloadUrl) {
      status.innerHTML =
        '<a href="' +
        data.downloadUrl +
        '" target="_blank" rel="noopener">Download file</a>';
    } else {
      status.textContent =
        data.error || "This link is not supported yet.";
    }
  } catch (error) {
    status.textContent = "Please enter a valid direct media URL.";
  }
});
