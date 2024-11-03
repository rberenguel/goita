chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];

  if (currentTab.url.includes("screenshot.html")) {
    // Show buttons if on screenshot.html
    document.getElementById("buttons").style.display = "block";

    // Add click listeners to buttons
    document.getElementById("imageBtn").addEventListener("click", () => {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        fetch(dataUrl)
          .then((response) => response.blob())
          .then((blob) => {
            navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            console.log("Screenshot copied to clipboard!");
            document.getElementById("message").textContent =
              "Screenshot (image) copied to clipboard";
          })
          .catch((err) => {
            console.error("Failed to copy screenshot: ", err);
          });
      });
    });

    document.getElementById("urlBtn").addEventListener("click", () => {
      chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, (dataUrl) => {
        chrome.storage.local.get(["linkback", "url"], function (result) {
          let img;
          if (result.linkback) {
            img = `<a href="${result.url}"><img src="${dataUrl}"></a>`;
          } else {
            img = `<img src="${dataUrl}">`;
          }

          // Create a basic HTML page with the screenshot and source link
          const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Screenshot</title>
            <style>
            body {
                border: 0;
                margin: 0;
                padding: 0;
            }
            </style>
          </head>
          <body>
            ${img}
          </body>
          </html>
        `;
          console.log(img);
          // Encode the HTML content as a data URL
          const htmlDataUrl = `data:text/html;base64,${btoa(htmlContent)}`;

          // Copy the HTML data URL to the clipboard
          navigator.clipboard
            .writeText(htmlDataUrl)
            .then(() => {
              console.log("HTML with screenshot copied to clipboard!");
              document.getElementById("message").textContent =
                "HTML (with screenshot) copied to clipboard";
            })
            .catch((err) => {
              console.error("Failed to copy HTML: ", err);
            });
        });
      });
    });

    window.addEventListener("keydown", (event) => {
      console.log(event);
      if (event.key === "Enter") {
        document.getElementById("imageBtn").click(); // Simulate button click
      }
      if (event.key === " ") {
        document.getElementById("urlBtn").click(); // Simulate button click
      }
    });
  } else {
    // If not on screenshot.html, capture and open screenshot.html as before
    const currentUrl = tabs[0].url;
    chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, function (dataUrl) {
      chrome.storage.local.set(
        { screenshot: dataUrl, url: currentUrl, linkback: true },
        function () {
          chrome.tabs.create({ url: "src/screenshot.html" });
        },
      );
    });
  }
});
