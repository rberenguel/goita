import { colors } from "./common.js";

import { Arrow } from "./arrow.js";
import { Rect } from "./rect.js";
import { Text } from "./text.js";
import { Image } from "./image.js";
import { ClipPath } from "./clip.js";

window._elements = {};
let kind = null;
const svg = document.getElementById("svgOverlay");
const svgImage = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "image",
);

document.addEventListener("DOMContentLoaded", () => {
  try {
    chrome.storage.local.set({ linkback: true });
    chrome.storage.local.get(["screenshot", "url"], screenshotHandler);
  } catch (err) {
    // Let's assume we are in test mode. testImage then exists by global import
    screenshotHandler({
      screenshot: testImage,
      url: "https://mostlymaths.net/sketches",
    });
  }

  // ----

  function screenshotHandler(result) {
    const img = document.getElementById("screenshotImg");
    img.src = result.screenshot;

    const sourceLinkDiv = document.getElementById("sourceLink");
    const linkElement = document.createElement("a");
    linkElement.href = result.url; // Set the URL
    linkElement.textContent = result.url; // Set the link text
    linkElement.target = "_blank"; // Open link in a new tab
    sourceLinkDiv.appendChild(linkElement);

    // Set SVG viewport after image loads
    img.onload = function () {
      svgImage.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        result.screenshot,
      );
      const dpi = window.devicePixelRatio;
      svgImage.setAttribute("width", img.width / dpi);
      svgImage.setAttribute("height", img.height / dpi);
      // Just to make sure it is always on top, for tests
      svg.insertBefore(svgImage, svg.firstChild);

      // Remove the original img element
      img.parentNode.removeChild(img);
      svg.setAttribute("viewBox", `0 0 ${img.width} ${img.height}`);
      svg.setAttribute("width", img.width);
      svg.setAttribute("height", img.height);
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter",
      );
      filter.setAttribute("id", "drop-shadow");
      filter.innerHTML = `
      <!--<feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(50, 50, 50, 0.7)" />-->
      <feDropShadow dx="-3" dy="-3" stdDeviation="3" flood-color="rgba(200, 200, 200, 0.7)" />
    `;
      // Just to make sure it is always on top, for tests

      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs",
      );
      defs.insertBefore(filter, defs.firstChild);
      const createMarker = (color) => {
        const marker = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "marker",
        );
        marker.setAttribute("id", "arrowhead-" + color);
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "0"); // Increased refX to position arrowhead further ahead
        marker.setAttribute("refY", "2");
        marker.setAttribute("orient", "auto");
        marker.innerHTML = `<polygon points="0 0, 5 2, 0 4" fill="${colors[
          color
        ](1)}" />`; // Set fill
        defs.appendChild(marker);
      };

      for (let color in colors) {
        createMarker(color);
      }
      // Just to make sure it is always on top, for tests
      svg.insertBefore(defs, svg.firstChild);
      svg.addEventListener("textInput", (event) => {
        console.log(event);
        alert("WHAT");
        if (currentTextElement) {
          currentTextElement.textContent += event.data;
        }
      });
    };
  }

  const svg = document.getElementById("svgOverlay");
  let isDrawing = false;

  let colorName = "red";
  let color = colors[colorName];
  // the useful globals, but most will go away;
  let startX, startY;
  let rect;
  let arrow;
  let selected = null;
  let dragging = false;

  function setBadge(kind) {
    const kindMap = {
      arrow: "↗",
      clip: "✂",
      rect: "▭",
      highlight: "░",
      text: "|",
      paste: "↧",
      color: "c?",
    };
    if (kind === "empty") {
      chrome.action.setTitle({ title: "" });
      chrome.action.setBadgeText({ text: "" });
    }
    try {
      const title = kindMap[kind] ?? "";
      if (kind === "paste") {
        chrome.action.setBadgeBackgroundColor({ color: "black" });
      } else {
        chrome.action.setBadgeBackgroundColor({ color: colors[colorName](1) });
      }

      chrome.action.setTitle({ title: title });
      chrome.action.setBadgeText({ text: title });
    } catch (err) {
      console.info(err);
    }
  }
  setBadge("empty");

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isDrawing) {
      isDrawing = false;
      if (selected) {
        selected.delete();
      }
    }
    if (event.key === "Escape" && selected) {
      console.log("Escaping selected");
      console.info(selected);
      if (selected.is) {
        selected.deselect();
      } else {
        selected.removeAttribute("filter");
      }
      selected = null;
    }
    if (event.key === "c") {
      // Set up colors
      if (kind === "colorSettings") {
        kind = null;
      } else {
        kind = "colorSettings";
      }
      if (selected && selected.is) {
        selected.deselect();
      }
      setBadge("color");
      selected = null;
      return;
    }

    if (event.key === "Escape" && kind === "text") {
      return;
    }
    if (selected && selected.is && selected.is("text") && selected.focused()) {
      console.log("texting");
      event.stopPropagation();
      return;
    }
    if (kind === "colorSettings") {
      if (event.key === "r") {
        colorName = "red";
        color = colors["red"];
      }
      if (event.key === "y") {
        colorName = "yellow";
        color = colors["yellow"];
      }
      if (event.key === "b") {
        colorName = "blue";
        color = colors["blue"];
      }
      if (event.key === "g") {
        colorName = "green";
        color = colors["green"];
      }
      if (event.key === "x") {
        colorName = "redact";
        color = colors["redact"];
      }
      if (event.key === "w") {
        colorName = "white";
        color = colors["white"];
      }
      kind = null;
      setBadge("empty");
    }
    if (event.key === "r") {
      console.info("Drawing rect");
      isDrawing = true;
      kind = "rect";
      setBadge("rect");
    }
    if (event.key === "k") {
      const clipPathUrl = svgImage.getAttribute("clip-path");
      if (clipPathUrl) {
        const id = clipPathUrl.substring(5, clipPathUrl.length - 1);
        const clip = window._elements[id];
        delete window._elements[id];
        clip.image.setAttribute("x", 0);
        clip.image.setAttribute("y", 0);
        clip.delete();
        if (selected && selected.is) {
          selected.deselect();
        }
        selected = null;
        kind = null;
        return;
      }

      isDrawing = true;
      kind = "clipping";
      setBadge("clip");
    }
    if (event.key === "s") {
      setBadge("highlight");
      console.log("drawing highlight");
      isDrawing = true;
      kind = "highlight";
    }
    if (event.key === "a") {
      // TEST
      setBadge("arrow");
      // TEST
      isDrawing = true;
      kind = "arrow";
      console.info("Drawing arrow");
    }
    if (event.key === "v") {
      kind = "paste";
      isDrawing = true;
      event.stopPropagation();
      setBadge("paste");
    }
    if (event.key === "t") {
      setBadge("text");
      isDrawing = true;
      kind = "text";
      event.stopPropagation();
      console.info("Creating text");
      return;
    }
    if (event.key === "Enter" && kind === "text") {
      isAddingText = false;
      currentTextElement = null;
    }
    if (event.key === "Backspace" && selected) {
      if (selected.id === "sourceLink") {
        chrome.storage.local.set({ linkback: false });
      }
      if (selected.is) {
        delete window._elements[selected.id];
        selected.delete();
      } else {
        selected.parentElement.removeChild(selected);
      }

      selected = null;
    }
  });

  document.addEventListener("mousedown", (event) => {
    // Mousedown takes care of selecting and starting dragging.
    // First we select anything selectable, and flag it
    // as dragging started. Dragging is released on
    // mouseup though, so it behaves as select+drag then.
    // If we have set up a command that triggers drawing, then we
    // get into drawing mode and elements are drawn (and implicitly
    // selected until mouseup).
    if (event.button != 0) {
      return;
    }
    if (selected && selected.is) {
      selected.deselect();
    }
    Array.from(document.querySelectorAll(".text-editor")).map((t) => {
      t.blur();
    });
    if (isDrawing) {
      if (kind === "paste") {
        // Get image data from clipboard
        navigator.clipboard.read().then((clipboardItems) => {
          for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
              if (type === "image/png") {
                clipboardItem.getType(type).then((blob) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const pastedImageDataUrl = e.target.result;
                    const pastedImage = new Image(
                      event.offsetX,
                      event.offsetY,
                      pastedImageDataUrl,
                      svg,
                    );

                    window._elements[pastedImage.id] = pastedImage;
                    selected = pastedImage;
                  };
                  reader.readAsDataURL(blob);
                });
                break;
              }
            }
          }
        });
        return;
      }
      startX = event.offsetX;
      startY = event.offsetY;
      if (kind === "rect" || kind === "highlight") {
        const rect = new Rect(startX, startY, colorName, svg, kind);
        window._elements[rect.id] = rect;
        selected = rect;
        event.preventDefault();
        return;
      }
      if (kind === "clipping") {
        const newClipPath = new ClipPath(startX, startY, svg, svgImage);
        window._elements[newClipPath.id] = newClipPath;
        console.log(newClipPath);
        console.log(window._elements);
        newClipPath.applyToImage();
        selected = newClipPath;
        return;
      }
      startX = event.clientX;
      startY = event.clientY;
      if (kind === "text") {
        const text = new Text(
          startX,
          startY,
          color,
          document.getElementById("screenshotContainer"),
        );
        window._elements[text.id] = text;
        selected = text;
        event.stopPropagation(); // Otherwise it will blur itself
        event.preventDefault();
        return;
      }
      if (kind === "arrow") {
        arrow = new Arrow(startX, startY, colorName, svg);
        window._elements[arrow.id] = arrow;
        event.preventDefault();
        selected = arrow;
        return;
      }
      isDrawing = false;
      event.stopPropagation();
      event.preventDefault();
    }

    // Cleanup anything otherwise, since now we are selecting / starting drag
    if (selected && selected.is) {
      selected.deselect();
      selected = null;
      kind = null;
    }

    for (let el in window._elements) {
      window._elements[el].deselect();
    }
    if (event.target.tagName === "rect") {
      dragging = true;
      event.preventDefault();
      selected = event.target;
      const _kind = selected.getAttribute("_kind");
      if (["rect", "highlight", "clip"].includes(_kind)) {
        selected = window._elements[selected.getAttribute("id")];
        kind = selected.kind;
        selected.select();
        selected.dragInit(event.clientX, event.clientY);
      }
      return;
    }
    if (event.target.tagName === "image") {
      // Image is tricky because depending on whether there is a clipping path or not applied to it
      // it is handled separately.
      kind = "image";
      selected = event.target;
      if (selected.getAttribute("_kind") === "image") {
        // This is a pasted image
        selected = window._elements[selected.getAttribute("id")];
        selected.select();
        selected.dragInit(event.clientX, event.clientY);
        dragging = true;
      } else {
        // This is the main screenshot image. Handling clipping paths is done differently.
        const imageObject = selected;
        const clipPathUrl = imageObject.getAttribute("clip-path");

        if (clipPathUrl) {
          console.log("Has a clip path");
          const clipPathId = clipPathUrl.substring(5, clipPathUrl.length - 1);
          const clipPath = document.getElementById(clipPathId);
          const clipPathRect = clipPath.querySelector("rect");

          // Check if the click is inside the clipPathRect, this will select it
          const rectX = parseFloat(clipPathRect.getAttribute("x"));
          const rectY = parseFloat(clipPathRect.getAttribute("y"));
          const rectWidth = parseFloat(clipPathRect.getAttribute("width"));
          const rectHeight = parseFloat(clipPathRect.getAttribute("height"));

          if (
            event.offsetX >= rectX &&
            event.offsetX <= rectX + rectWidth &&
            event.offsetY >= rectY &&
            event.offsetY <= rectY + rectHeight
          ) {
            // Click is inside the clip path
            selected = window._elements[clipPathId];
            selected.select();
            selected.dragInit(event.clientX, event.clientY);
            dragging = true;
          } else {
            // Click is outside the clip path, do nothing
            if (selected && selected.is) {
              selected.deselect();
            }
            selected = null;
            kind = null;
          }
        } else {
          if (selected && selected.is) {
            selected.deselect();
          }
          selected = null;
          kind = null;
        }
      }

      event.preventDefault();
      return;
    }

    // The source link is handled in isolation
    if (
      event.target &&
      (event.target.id == "sourceLink" ||
        (event.target.parentElement &&
          event.target.parentElement.id == "sourceLink"))
    ) {
      selected = event.target.closest("#sourceLink");
      //offsetX = event.clientX - selected.offsetLeft;
      //offsetY = event.clientY - selected.offsetTop;
      dragging = true;
      kind = "source";
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    const _kind =
      event.target &&
      event.target.getAttribute &&
      event.target.getAttribute("_kind");
    if (!_kind) {
      console.info("Clicked on something useless unexpectedly");
      if (selected) {
        selected.deselect();
      }
      return;
    }
    kind = _kind;
    selected = event.target;
    dragging = true;

    selected = window._elements[selected.getAttribute("id")];
    selected.select();
    selected.dragInit(event.clientX, event.clientY);

    event.preventDefault();
    event.stopPropagation();
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  document.addEventListener("mousemove", (event) => {
    // Mousemove either completes the drawing of the element or drags. This is
    // controlled via "dragging"
    if (event.button != 0) {
      return;
    }

    event.preventDefault();

    if (dragging && kind === "source") {
      const bbox = selected.getBoundingClientRect();
      const w = bbox.width;
      const h = bbox.height;
      requestAnimationFrame(() => {
        selected.style.left = `${event.clientX - w / 2}px`;
        selected.style.top = `${event.clientY - h / 2}px`;
      });
      event.stopPropagation();
    }
    if (isDrawing && selected && selected.is) {
      selected.updateShape(event);
      return;
    }
    if (selected && dragging && selected.is) {
      event.stopPropagation();
      selected.drag(event);
      return;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDrawing) {
      console.info("Stopped drawing");
      setBadge("empty");
      isDrawing = false;
      rect = null;
      arrow = null;
      if (selected.is) {
        console.info("Deselecting on mouseup while drawing");
        if (!selected.is("text")) {
          selected.deselect();
          selected = null;
        }
      }
    }

    dragging = false;
  });
});
