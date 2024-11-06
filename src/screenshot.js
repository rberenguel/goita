import { colors } from "./common.js";

import { Arrow } from "./arrow.js";
import { Rect } from "./rect.js";
import { Text } from "./text.js";
import { Image } from "./image.js";
import { ClipPath } from "./clip.js";

let elements = {};
let kind = null;
const svg = document.getElementById("svgOverlay");
const svgImage = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "image",
);

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.set({ linkback: true });
  chrome.storage.local.get(["screenshot", "url"], function (result) {
    const img = document.getElementById("screenshotImg");
    console.log(result);
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
      svg.appendChild(svgImage);

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
        <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(50, 50, 50, 0.7)" />
        <feDropShadow dx="-3" dy="-3" stdDeviation="3" flood-color="rgba(200, 200, 200, 0.7)" />
      `;
      svg.appendChild(filter);
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs",
      );
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

      svg.appendChild(defs);
      svg.addEventListener("textInput", (event) => {
        console.log(event);
        if (currentTextElement) {
          currentTextElement.textContent += event.data;
        }
      });
    };
  });

  const svg = document.getElementById("svgOverlay");
  const img = document.getElementById("screenshotImg");
  let isDrawing = false;

  let colorName = "red";
  let color = colors[colorName];
  // the useful globals, but most will go away;
  let startX, startY;
  let rect;
  let arrow;
  let activeTextEditor;
  let offsetX, offsetY;
  let textEditor;
  let textEditorOffsetX, textEditorOffsetY;
  let clipPathRect;
  let selected = null;
  let dragging = false;

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selected) {
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
      selected = null;
      return;
    }
    if (event.key === "Escape" && isDrawing) {
      if (rect) {
        svg.removeChild(rect);
        rect = null;
      }
      if (arrow) {
        // If drawing an arrow
        svg.removeChild(arrow);
        arrow = null;
      }
      // Text input handles itself by blur
      isDrawing = false;
    }
    if (event.key === "Escape" && kind === "text") {
      return;
    }
    if (
      kind === "text" &&
      selected &&
      selected.is("text") &&
      selected.focused()
    ) {
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
    }
    if (event.key === "r") {
      console.log("drawing");
      isDrawing = true;
      kind = "rect";
    }
    if (event.key === "k") {
      const clipPathUrl = svgImage.getAttribute("clip-path");
      if (clipPathUrl) {
        const id = clipPathUrl.substring(5, clipPathUrl.length - 1);
        const clip = elements[id];
        clip.image.setAttribute("x", 0);
        clip.image.setAttribute("y", 0);
        clip.delete();
        selected = null;
        kind = null;
        return;
      }

      isDrawing = true;
      kind = "clipping";
    }
    if (event.key === "s") {
      console.log("drawing highlight");
      isDrawing = true;
      kind = "highlight";
    }
    if (event.key === "a") {
      isDrawing = true;
      kind = "arrow";
    }
    if (event.key === "v") {
      kind = "paste";
      isDrawing = true;
      event.stopPropagation();
    }
    if (event.key === "t") {
      isDrawing = true;
      kind = "text";
      event.stopPropagation();
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
        delete elements[selected.id];
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
    console.log(selected);
    console.log(selected && selected.is);
    if (selected && selected.is) {
      selected.deselect();
    }
    console.log(event);
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

                    elements[pastedImage.id] = pastedImage;
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
        elements[rect.id] = rect;
        selected = rect;
        event.preventDefault();
        return;
      }
      if (kind === "clipping") {
        const newClipPath = new ClipPath(startX, startY, svg, svgImage);
        elements[newClipPath.id] = newClipPath;
        console.log(newClipPath);
        console.log(elements);
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

        elements[text.id] = text;
        selected = text;
        return;
      }
      if (kind === "arrow") {
        arrow = new Arrow(startX, startY, colorName, svg);
        elements[arrow.id] = arrow;
        event.preventDefault();
        selected = arrow;
        return;
      }
      isDrawing = false;
      event.stopPropagation();
      event.preventDefault();
    }

    // Cleanup anything otherwise, since now we are selecting / starting drag
    selected = null;
    kind = null;
    for (let el in elements) {
      elements[el].deselect();
    }
    if (event.target.tagName === "rect") {
      dragging = true;
      event.preventDefault();
      selected = event.target;
      const _kind = selected.getAttribute("_kind");
      if (["rect", "highlight", "clip"].includes(_kind)) {
        selected = elements[selected.getAttribute("id")];
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
        selected = elements[selected.getAttribute("id")];
        selected.select();
        selected.dragInit(event.clientX, event.clientY);
        console.log("Ref: Selected an image");
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
            selected = elements[clipPathId];
            selected.select();
            selected.dragInit(event.clientX, event.clientY);
            console.log("Ref: Selected a clip path");
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
      event.target.id == "sourceLink" ||
      event.target.parentElement.id == "sourceLink"
    ) {
      selected = event.target.closest("#sourceLink");
      offsetX = event.clientX - selected.offsetLeft;
      offsetY = event.clientY - selected.offsetTop;
      dragging = true;
      kind = "source";
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    const _kind = event.target.getAttribute("_kind");
    if (!_kind) {
      console.info("Clicked on something useless unexpectedly");
      return;
    }
    kind = _kind;
    selected = event.target;
    dragging = true;

    selected = elements[selected.getAttribute("id")];
    selected.select();
    selected.dragInit(event.clientX, event.clientY);
    console.log(`Ref: Selected an ${kind}`);

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

    if (dragging && kind === "svg" && clipPathRect) {
      alert("This should not happen");
      requestAnimationFrame(() => {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        // Apply the delta to the initial position of the clipPathRect
        const newX = svg.getBoundingClientRect().left + deltaX;
        const newY = svg.getBoundingClientRect().top + deltaY;
        console.log(newX, newY);
        clipPathRect.setAttribute("x", newX);
        clipPathRect.setAttribute("y", newY);
      });
      return;
    }

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

    if (isDrawing && kind === "arrow" && selected && selected.is) {
      // This should be generic regardless of whether it is an arrow or not
      selected.updateShape(event);
    }
    if (selected && dragging && selected.is) {
      event.stopPropagation();
      selected.drag(event);
      return;
    }
  });

  svg.addEventListener("mouseup", () => {
    if (isDrawing) {
      isDrawing = false;
      rect = null;
      arrow = null;
      if (selected.is) {
        console.log("deselecting");
        selected.deselect();
        selected = null;
      }
    }

    dragging = false;
  });
});
