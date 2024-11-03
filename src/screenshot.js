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
      const svg = document.getElementById("svgOverlay");
      svg.setAttribute("viewBox", `0 0 ${img.width} ${img.height}`);
      svg.setAttribute("width", img.width);
      svg.setAttribute("height", img.height);
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter",
      );
      filter.setAttribute("id", "drop-shadow");
      filter.innerHTML = `
        <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="red" flood-opacity="0.5" />
      `;
      svg.appendChild(filter);
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs",
      );
      const marker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker",
      );
      marker.setAttribute("id", "arrowhead");

      marker.setAttribute("markerWidth", "10");
      marker.setAttribute("markerHeight", "7");
      marker.setAttribute("refX", "0"); // Increased refX to position arrowhead further ahead
      marker.setAttribute("refY", "2");
      marker.setAttribute("orient", "auto");
      marker.innerHTML = '<polygon points="0 0, 5 2, 0 4" fill="red" />'; // Set fill to red
      defs.appendChild(marker);
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
  let startX, startY;
  let rect;
  let arrow;
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
    if (event.key === "r") {
      console.log("drawing");
      isDrawing = true;
      kind = "rect";
    }
    if (event.key === "a") {
      isDrawing = true;
      kind = "arrow";
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
    if (isDrawing) {
      if (kind === "rect") {
        event.preventDefault();
        startX = event.offsetX;
        startY = event.offsetY;
        rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", startX);
        rect.setAttribute("y", startY);
        rect.setAttribute("fill", "none");
        rect.setAttribute("stroke", "red");
        rect.setAttribute("stroke-width", "5");
        rect.setAttribute("rx", "5");
        rect.setAttribute("fill", "rgba(0, 0, 0, 0.0)"); // This is to make it easier to select
        svg.appendChild(rect);
        event.preventDefault();
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
        arrow.setAttribute("stroke", "red");
        arrow.setAttribute("stroke-width", "5");
        arrow.setAttribute("marker-end", "url(#arrowhead)");
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
    activeTextEditor = null;
    kind = null;
    if (selected) {
      selected.removeAttribute("filter");
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