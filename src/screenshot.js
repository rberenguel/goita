const colors = {
  red: (a) => `rgba(220, 20, 20, ${a})`,
  yellow: (a) => `rgba(220, 220, 10, ${a})`,
  blue: (a) => `rgba(20, 20, 200, ${a})`,
  green: (a) => `rgba(20, 200, 20, ${a})`,
  redact: (a) => `rgba(0, 0, 0, 1.0)`,
  white: (a) => `rgba(250, 250, 250, ${a})`,
};

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
      svgImage.setAttribute("width", img.width);
      svgImage.setAttribute("height", img.height);
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
  // the useful globals
  let startX, startY;
  let rect;
  let arrow;
  let shadowRect;
  let clipPathRect;
  let kind = null;
  let selected = null;
  let dragging = false;

  document.addEventListener("keydown", (event) => {
    console.log("event");
    if (event.key === "Escape" && selected) {
      // Deselect anything Escape
      selected.removeAttribute("filter");
      selected = null;
    }
    if (event.key === "c") {
      // Set up colors
      if (kind === "colorSettings") {
        kind = null;
      } else {
        kind = "colorSettings";
      }

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
    if (kind === "text") {
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
      console.log("clipping");
      isDrawing = true;
      kind = "clipping";
    }
    if (event.key === "s") {
      console.log("drawing");
      isDrawing = true;
      kind = "highlight";
    }
    if (event.key === "a") {
      isDrawing = true;
      kind = "arrow";
    }
    if (event.key === "i") {
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
      selected.parentElement.removeChild(selected);
      selected = null;
    }
  });

  document.addEventListener("mousedown", (event) => {
    if (event.button != 0) {
      return;
    }
    console.log(event);
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

                    // Create an SVG image element
                    const pastedImage = document.createElementNS(
                      "http://www.w3.org/2000/svg",
                      "image",
                    );
                    pastedImage.setAttributeNS(
                      "http://www.w3.org/1999/xlink",
                      "href",
                      pastedImageDataUrl,
                    );
                    pastedImage.setAttribute("x", event.offsetX);
                    pastedImage.setAttribute("y", event.offsetY);
                    svg.appendChild(pastedImage);
                    pastedImage.onload = () => {
                      const imageWidth = pastedImage.width.baseVal.value;
                      const imageHeight = pastedImage.height.baseVal.value;

                      // Calculate centered coordinates
                      const x = event.offsetX - imageWidth / 2;
                      const y = event.offsetY - imageHeight / 2;

                      // Set the centered position
                      pastedImage.setAttribute("x", x);
                      pastedImage.setAttribute("y", y);
                    };
                  };
                  reader.readAsDataURL(blob);
                });
                break;
              }
            }
          }
        });
      }
      if (kind === "rect" || kind === "highlight") {
        event.preventDefault();
        startX = event.offsetX;
        startY = event.offsetY;
        rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", startX);
        rect.setAttribute("y", startY);
        if (kind === "rect") {
          rect.setAttribute("stroke", color(1));
          rect.setAttribute("stroke-width", "5");
          rect.setAttribute("fill", "rgba(0, 0, 0, 0.0)"); // This is to make it easier to select
          rect.setAttribute("rx", "5");
        }
        if (kind === "highlight") {
          rect.setAttribute("stroke-width", "0");
          rect.setAttribute("fill", color(0.2));
        }
        svg.appendChild(rect);
        event.preventDefault();
        return;
      }
      if (kind === "clipping") {
        startX = event.offsetX;
        startY = event.offsetY;

        // Create the clipPath element
        const clipPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "clipPath",
        );
        clipPath.setAttribute("id", "image-clip");

        // Create the rect element within the clipPath
        rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", startX);
        rect.setAttribute("y", startY);
        rect.setAttribute("width", 0); // Initially zero width
        rect.setAttribute("height", 0); // Initially zero height

        clipPath.appendChild(rect);
        svg.appendChild(clipPath);

        // Apply the clipPath to the image
        svgImage.setAttribute("clip-path", "url(#image-clip)");
        return;
      }
      if (kind === "arrow") {
        startX = event.clientX;
        startY = event.clientY;
        arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrow.setAttribute("x1", startX);
        arrow.setAttribute("y1", startY);
        arrow.setAttribute("x2", startX);
        arrow.setAttribute("y2", startY);
        arrow.setAttribute("stroke", color(1));
        arrow.setAttribute("stroke-width", "5");
        arrow.setAttribute("marker-end", `url(#arrowhead-${colorName})`);
        svg.appendChild(arrow);
        event.preventDefault();
        return;
      }
      if (kind === "text") {
        const x = event.offsetX;
        const y = event.offsetY;

        const textEditorWrapper = document.createElement("div");
        textEditorWrapper.classList.add("text-editor-wrapper");
        textEditorWrapper.style.left = `calc(${x}px - 2em)`;
        textEditorWrapper.style.top = `calc(${y}px - 2em)`;

        const textEditor = document.createElement("div");
        textEditor.classList.add("text-editor");
        textEditor.style.color = color(1);
        textEditor.contentEditable = true;
        textEditorWrapper.appendChild(textEditor);

        document
          .getElementById("screenshotContainer")
          .appendChild(textEditorWrapper);
        textEditor.addEventListener("keydown", (ev) => {
          if (ev.key === "Escape") {
            textEditor.blur();
          }
        });
        textEditor.addEventListener("input", () => {
          textEditor.style.width = "auto";
          textEditor.style.height = "auto";

          const rect = textEditor.getBoundingClientRect();

          textEditor.style.width = rect.width + "px";
          textEditor.style.height = rect.height + "px";

          textEditorWrapper.style.width = textEditor.offsetWidth + 20 + "px";
          textEditorWrapper.style.height = textEditor.offsetHeight + 20 + "px";
        });
        textEditor.addEventListener("focus", () => {
          textEditorWrapper.classList.add("selected");
        });
        textEditor.addEventListener("blur", () => {
          kind = null;
          textEditorWrapper.classList.remove("selected");
          if (textEditor.textContent.trim().length === 0) {
            textEditorWrapper.parentElement.removeChild(textEditorWrapper);
          }
        });
        textEditor.focus();
        isDrawing = false;
        event.stopPropagation();
        event.preventDefault();
        return;
      }
    }
    activeTextEditor = null;
    kind = null;
    const elementsWithFilter = document.querySelectorAll("[filter]"); // Select all elements with a filter attribute

    elementsWithFilter.forEach((element) => {
      element.removeAttribute("filter");
    });
    if (event.target.tagName === "rect") {
      kind = "rect";
      selected = event.target;
      dragging = true;
      offsetX = event.clientX - selected.x.baseVal.value;
      offsetY = event.clientY - selected.y.baseVal.value;
      selected.setAttribute("filter", "url(#drop-shadow)");
      event.preventDefault();
      return;
    }
    if (event.target.tagName === "image") {
      kind = "image";
      selected = event.target;
      dragging = true;
      const rect = selected.getBoundingClientRect();
      offsetX = event.clientX - rect.left - startX;
      offsetY = event.clientY - rect.top - startY;
      console.log(offsetX, offsetY);
      const clipPathUrl = selected.getAttribute("clip-path");
      if (clipPathUrl) {
        // If it has a clip-path, store the clipPath's rect element
        const clipPathId = clipPathUrl.substring(5, clipPathUrl.length - 1);
        const clipPath = document.getElementById(clipPathId);
        clipPathRect = clipPath.querySelector("rect");
        startX = parseFloat(clipPathRect.getAttribute("x"));
        startY = parseFloat(clipPathRect.getAttribute("y"));
        const clipPathRectBounds = clipPathRect.getBoundingClientRect();
        //offsetX = event.clientX;
        //offsetY = event.clientY;//event.offsetY - startY;
        //
      }
      /*
      // Add shadow?

      const clipPathUrl = selected.getAttribute("clip-path");
      // It is a clipped image
      if (clipPathUrl) {
        // Get the clipPath element
        const clipPathId = clipPathUrl.substring(5, clipPathUrl.length - 1); // Extract ID from url(#id)
        const clipPath = document.getElementById(clipPathId);

        // Get the rect element within the clipPath
        const clipPathRect = clipPath.querySelector("rect");
        if (clipPathRect) {
          // Create a new rect element for the shadow
          shadowRect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          shadowRect.setAttribute("x", clipPathRect.getAttribute("x"));
          shadowRect.setAttribute("y", clipPathRect.getAttribute("y"));
          shadowRect.setAttribute("width", clipPathRect.getAttribute("width"));
          shadowRect.setAttribute(
            "height",
            clipPathRect.getAttribute("height")
          );
          shadowRect.setAttribute("filter", "url(#drop-shadow)");
          //TODO(me) Remove the drop shadow
          // Insert the shadow rect before the image element
          svg.insertBefore(shadowRect, selected);
        }
      }
        */
      // Get initial translate values (if any)
      const transform = selected.getAttribute("transform");
      if (transform) {
        const translateMatch = transform.match(/translate\(([^,]+),([^)]+)\)/);
        if (translateMatch) {
          startX = parseFloat(translateMatch[1]);
          startY = parseFloat(translateMatch[2]);
        } else {
          startX = 0;
          startY = 0;
        }
      } else {
        startX = 0;
        startY = 0;
      }
      console.log(startX);
      console.log(startY);
      offsetX = event.clientX - svg.getBoundingClientRect().left - startX;
      offsetY = event.clientY - svg.getBoundingClientRect().top - startY;

      event.preventDefault();
      return;
    }
    if (event.target.tagName === "line") {
      kind = "line";
      selected = event.target;
      console.log(selected);
      dragging = true;
      arrowStartOffsetX = event.clientX - selected.x1.baseVal.value;
      arrowStartOffsetY = event.clientY - selected.y1.baseVal.value;
      arrowEndOffsetX = event.clientX - selected.x2.baseVal.value;
      arrowEndOffsetY = event.clientY - selected.y2.baseVal.value;
      selected.setAttribute("filter", "url(#drop-shadow)");
      event.preventDefault();
      return;
    }
    if (event.target.tagName === "svg") {
      // If we have selected an image _and_ there is a clipping rect
      kind = "svg";
      dragging = true;
      return;
    }
    if (event.target.classList.contains("text-editor-wrapper")) {
      console.log("wants to drag text");
      activeTextEditor = event.target;
      activeTextEditor.classList.add("selected");
      textEditorOffsetX = event.clientX - activeTextEditor.offsetLeft;
      textEditorOffsetY = event.clientY - activeTextEditor.offsetTop;
      dragging = true;
      kind = "text";
      event.stopPropagation();
      selected = activeTextEditor;
      event.preventDefault();
      return;
    }
    if (event.target.id == "sourceLink") {
      console.log("wants to drag source link");
      selected = event.target;
      offsetX = event.clientX - selected.offsetLeft;
      offsetY = event.clientY - selected.offsetTop;
      dragging = true;
      kind = "source";
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  svg.addEventListener("mousemove", (event) => {
    if (event.button != 0) {
      return;
    }
    event.preventDefault();
    if (dragging && kind === "text") {
      const newX = event.clientX - textEditorOffsetX;
      const newY = event.clientY - textEditorOffsetY;
      // Use requestAnimationFrame for smoother dragging. It's still jaggy for some reason
      requestAnimationFrame(() => {
        activeTextEditor.style.left = `${newX}px`;
        activeTextEditor.style.top = `${newY}px`;
      });
      event.stopPropagation();
      return;
    }
    if (dragging && kind === "svg" && clipPathRect) {
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
    if (dragging && kind === "image") {
      requestAnimationFrame(() => {
        // Calculate new translate values relative to the parent SVG element
        const newX =
          event.clientX - svg.getBoundingClientRect().left - offsetX + startX;
        const newY =
          event.clientY - svg.getBoundingClientRect().top - offsetY + startY;
        selected.setAttribute("transform", `translate(${newX}, ${newY})`);
      });
    }
    if (dragging && kind === "source") {
      const newX = event.clientX - offsetX;
      const newY = event.clientY - offsetY;
      // Use requestAnimationFrame for smoother dragging. It's still jaggy for some reason
      requestAnimationFrame(() => {
        selected.style.left = `${newX}px`;
        selected.style.top = `${newY}px`;
      });
      event.stopPropagation();
    }
    if (isDrawing && rect) {
      const width = event.offsetX - startX;
      const height = event.offsetY - startY;
      rect.setAttribute("width", Math.abs(width));
      rect.setAttribute("height", Math.abs(height));
      if (width < 0) {
        rect.setAttribute("x", event.offsetX);
      }
      if (height < 0) {
        rect.setAttribute("y", event.offsetY);
      }
      return;
    }

    if (isDrawing && arrow) {
      arrow.setAttribute("x2", event.clientX);
      arrow.setAttribute("y2", event.clientY);
    }
    if (selected && dragging) {
      if (kind === "rect") {
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;
        selected.setAttribute("x", newX);
        selected.setAttribute("y", newY);
        return;
      }
      if (kind === "line") {
        const newStartX = event.clientX - arrowStartOffsetX;
        const newStartY = event.clientY - arrowStartOffsetY;
        const newEndX = event.clientX - arrowEndOffsetX;
        const newEndY = event.clientY - arrowEndOffsetY;
        selected.setAttribute("x1", newStartX);
        selected.setAttribute("y1", newStartY);
        selected.setAttribute("x2", newEndX);
        selected.setAttribute("y2", newEndY);
        return;
      }
    }
  });

  svg.addEventListener("mouseup", () => {
    if (isDrawing) {
      isDrawing = false;
      rect = null;
      arrow = null;
    }
    dragging = false;
  });
});
