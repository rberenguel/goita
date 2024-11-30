export { setupAllTheThings };

import { colors } from "./common.js";
import { white } from "./white.js";
import { Arrow } from "./arrow.js";
import { Rect } from "./rect.js";
import { Ellipse } from "./ellipse.js";
import { Text } from "./text.js";
import { Image } from "./image.js";
import { ClipPath } from "./clip.js";
import { reverseShortcuts, shortcuts } from "./shortcuts.js";

import { filterMemes } from "../memes/memes.js";
import { createHelpDiv } from "./help.js";

window._elements = {}; // I leak this into window to make testing easier.

let kind = null;
let searchText = "";
let screenshotFlipped = false;
let lastClick = undefined;
let displayMemes = false;
let mainScreenshot;
const svg = document.getElementById("svgOverlay");
const svgImage = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "image",
);

const wants = (ev) => {
  return shortcuts[ev.key];
};

function imgFromClipboard(cb) {
  let data;
  navigator.clipboard.read().then((clipboardItems) => {
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        if (type === "image/png") {
          clipboardItem.getType(type).then((blob) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const pastedImageDataUrl = e.target.result;
              data = pastedImageDataUrl;
              cb(data);
            };
            reader.readAsDataURL(blob);
          });
          break;
        }
      }
    }
  });
}

const loadImage = (flipped) => (data) => {
  if (!data) {
    return;
  }
  const img = document.createElement("img");
  document.body.appendChild(img);
  img.onload = () => {
    svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", data);
    const dpi = window.devicePixelRatio;
    const imgw = img.width / dpi;
    const imgh = img.height / dpi;
    svgImage.setAttribute("width", imgw);
    svgImage.setAttribute("height", imgh);
    if (flipped) {
      const hc = (window.innerHeight / dpi - imgh) / 2;
      const hw = (window.innerWidth / dpi - imgw) / 2;
      svgImage.setAttribute("x", hw);
      svgImage.setAttribute("y", hc);
    } else {
      svgImage.setAttribute("x", 0);
      svgImage.setAttribute("y", 0);
    }
    img.parentNode.removeChild(img);
  };
  img.src = data;
};

const sourceLinkDiv = () => document.getElementById("sourceLink");

const filterText = document.getElementById("filter-text");
const filteredMemes = document.getElementById("filtered-memes");

const setupAllTheThings = (testImage, basepath) => () => {
  try {
    chrome.storage.local.set({ linkback: true });
    chrome.storage.local.get(["screenshot", "url"], screenshotHandler);
  } catch (err) {
    // Let's assume we are in test mode. testImage then exists by global import
    screenshotHandler({
      screenshot: testImage,
      url: "https://mostlymaths.net/goita/",
    });
  }

  function screenshotHandler(result) {
    const img = document.getElementById("screenshotImg");
    img.src = result.screenshot;
    mainScreenshot = result.screenshot;

    const linkElement = document.createElement("a");
    linkElement.href = result.url; // Set the URL
    linkElement.textContent = result.url; // Set the link text
    linkElement.target = "_blank"; // Open link in a new tab
    sourceLinkDiv().appendChild(linkElement);

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
    };
  }

  const svg = document.getElementById("svgOverlay");

  createHelpDiv({ basepath: basepath });

  const help = document.getElementById("help");

  // the useful globals;
  let selected = null;
  let dragging = false;
  let isDrawing = false;
  let fromMenu = false;
  let colorName = "red";
  let color = colors[colorName];

  function setBadge(kind) {
    const kindMap = {
      arrow: "↗",
      clip: "✂",
      rect: "▭",
      ellipse: "⬭",
      highlight: "░",
      memes: " ͡° ͜ʖ ͡°",
      text: "|",
      paste: "↧",
      color: "c?",
    };
    try {
      if (kind === "empty") {
        chrome.action.setTitle({ title: "" });
        chrome.action.setBadgeText({ text: "" });
        return;
      }
    } catch (err) {}
    try {
      const title = kindMap[kind] ?? kind.slice(0, 3);
      if (kind === "paste" || kind === "memes") {
        chrome.action.setBadgeBackgroundColor({ color: "black" });
      } else {
        chrome.action.setBadgeBackgroundColor({ color: colors[colorName](1) });
      }

      chrome.action.setTitle({ title: title });
      chrome.action.setBadgeText({ text: title });
    } catch (err) {
      if (typeof chrome === "undefined" || chrome.action === undefined) {
        // This is expected while on other browsers, or just browser mode
        return;
      }
      console.info(err);
    }
  }
  setBadge("empty");

  /** WIP */

  const radialMenu = document.getElementById("radial-menu");
  const hiddenInput = document.getElementById("hidden-input");

  hiddenInput.addEventListener("focus", (e) => console.log("got focus"));
  hiddenInput.addEventListener("blur", (e) => console.log("lost focus"));

  const kev = (letter) =>
    new KeyboardEvent("keydown", {
      key: letter,
      code: "Key" + letter.toUpperCase(),
    });

  const menuItems = document.querySelectorAll(".radial i");

  for (var i = 0, l = menuItems.length; i < l; i++) {
    const item = menuItems[i];
    item.style.left =
      (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(
        4,
      ) + "%";
    item.style.top =
      (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(
        4,
      ) + "%";
    const transform = `rotate(${(i * 360) / menuItems.length}deg)`;
    item.style.transform = transform;
    item.addEventListener("mouseover", () => {
      item.style.transform = `${transform} scale(1.2)`;
    });

    item.addEventListener("mouseout", () => {
      item.style.transform = transform;
    });

    item.addEventListener("mouseup", (ev) => {
      fromMenu = true;
      radialMenu.classList.remove("show");
      document.querySelector(".radial").classList.remove("open");
      document.dispatchEvent(
        kev(reverseShortcuts[item.dataset["handler"].trim()]),
      );
    });
  }

  interact(document.body)
    //.pointerEvents({ ignoreFrom: ".body-container" })
    .on("hold", (ev) => {
      if (ev.button != 0) {
        // Want to avoid right-click-menu counting as hold, very annoying
        return;
      }
      const bbox = radialMenu.getBoundingClientRect();
      const x = ev.clientX;
      const y = ev.clientY;

      // Position the radial menu
      radialMenu.style.left = x - bbox.width / 2 + "px";
      radialMenu.style.top = y - bbox.height / 2 + "px";

      if (radialMenu.classList.contains("show")) {
        return;
      }
      radialMenu.classList.add("show");
      document.querySelector(".radial").classList.add("open");
    });

  /** End WIP */

  document.addEventListener("paste", (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData("text");
      if (pastedText && kind === "memes") {
        // Can I take this out? It's the same as the callback-meme, and repeated below
        const container = document.getElementById("meme-container");

        if (container) {
          container.remove();
        }
        let x = 0,
          y = 0;
        if (lastClick) {
          x = lastClick.offsetX;
          y = lastClick.offsetY;
        }
        const pastedMeme = new Image(x, y, pastedText, svg);
        kind = null;
        searchText = "";
        filterText.style.display = "none";
        filteredMemes.style.display = "none";
        setBadge("empty");
        window._elements[pastedMeme.id] = pastedMeme;
        selected = pastedMeme;
        displayMemes = false;
        isDrawing = false;
      }
      const pastedImage = clipboardData.files && clipboardData.files[0];
      if (pastedImage && pastedImage.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result;

          const container = document.getElementById("meme-container");

          if (container) {
            container.remove();
          }
          let x = 0,
            y = 0;
          if (lastClick) {
            x = lastClick.offsetX;
            y = lastClick.offsetY;
          }
          const pastedMeme = new Image(x, y, base64Image, svg);
          kind = null;
          searchText = "";
          filterText.style.display = "none";
          filteredMemes.style.display = "none";
          setBadge("empty");
          window._elements[pastedMeme.id] = pastedMeme;
          selected = pastedMeme;
          displayMemes = false;
          isDrawing = false;
        };

        reader.readAsDataURL(pastedImage);
      }
    }
  });

  document.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) {
        event.stopPropagation();
        event.preventDefault();
        if (selected && (selected.is("image") || selected.is("text"))) {
          if (event.deltaY > 0) {
            selected.scaleUp();
          }
          if (event.deltaY < 0) {
            selected.scaleDown();
          }
        }
      }
    },
    {
      passive: false, // To allow preventing the default
    },
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isDrawing) {
      isDrawing = false;
      if (selected) {
        selected.delete();
      }
    }
    if (event.key === "Escape" && selected) {
      if (selected.is) {
        selected.deselect();
      } else {
        selected.removeAttribute("filter");
      }
      selected = null;
    }
    if (event.key === "Escape" && kind === "text") {
      return;
    }
    if (kind === "memes") {
      const currentClick = lastClick;
      const memeCallback = (memePath) => () => {
        const container = document.getElementById("meme-container");

        if (container) {
          container.remove();
        }
        let x = 0,
          y = 0;
        if (currentClick) {
          x = currentClick.offsetX;
          y = currentClick.offsetY;
        }
        const pastedMeme = new Image(x, y, memePath, svg);
        kind = null;
        searchText = "";
        filterText.style.display = "none";
        filteredMemes.style.display = "none";
        setBadge("empty");
        window._elements[pastedMeme.id] = pastedMeme;
        selected = pastedMeme;
        displayMemes = false;
        isDrawing = false;
      };
      if (event.metaKey || event.ctrlKey) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (event.key === "Backspace") {
        searchText = searchText.slice(0, -1);
        filterMemes(searchText, {
          display: displayMemes,
          callback: memeCallback,
          basepath: basepath,
        });
      } else if (event.key === "Tab") {
        displayMemes = !displayMemes;
        filterMemes(searchText, {
          display: displayMemes,
          callback: memeCallback,
          basepath: basepath,
        });
      } else if (event.key === "Escape") {
        kind = null;
        searchText = "";
        filterText.style.display = "none";
        filteredMemes.style.display = "none";
        setBadge("empty");
        displayMemes = false;
        const container = document.getElementById("meme-container");
        if (container) {
          container.remove();
        }
        return;
      } else if (event.key === "Enter") {
        const container = document.getElementById("meme-container");
        if (container) {
          container.remove();
        }
        const meme = filteredMemes.querySelector("p");
        if (meme) {
          memeCallback(basepath + "memes/" + meme.dataset["file"])();
          return;
        }
      } else if (event.key.length === 1) {
        searchText += event.key;
        filterMemes(searchText, {
          display: displayMemes,
          callback: memeCallback,
          basepath: basepath,
        });
      }
      return;
    }
    // Finding a shortcut that is reasonable for this is hard, so
    // I'm not making it configurable.
    if (event.key === "." && event.ctrlKey && kind === "text") {
      // Size control needs to happen before we stop propagation
      // and short-circuit
      selected.fontSizeUp();
      setBadge(selected.fontSize());
      return;
    }
    if (event.key === "," && event.ctrlKey && kind === "text") {
      // Size control needs to happen before we stop propagation
      // and short-circuit
      selected.fontSizeDown();
      setBadge(selected.fontSize());
      return;
    }
    if (event.key === "c" && event.ctrlKey && kind === "text") {
      // Centering needs to happen before stopping propagation, too.
      selected.center();
      return;
    }
    if (event.key === "/" && event.ctrlKey && kind === "text") {
      // Centering needs to happen before stopping propagation, too.
      selected.cycleFonts();
      setBadge(selected.fontName());
      return;
    }
    if (selected && selected.is && selected.is("text") && selected.focused()) {
      // Texting, stop any propagation
      event.stopPropagation();
      return;
    }
    if (wants(event) === "clipboard" && kind !== "memes") {
      isDrawing = false;
      if (!screenshotFlipped) {
        imgFromClipboard(loadImage(true));
        try {
          sourceLinkDiv().classList.add("hide");
        } catch (e) {}
        screenshotFlipped = true;
      } else {
        loadImage(false)(mainScreenshot);
        try {
          sourceLinkDiv().classList.remove("hide");
        } catch (e) {}
        screenshotFlipped = false;
      }
    }
    if (wants(event) === "empty") {
      // This should only work when going back to a screenshot.
      isDrawing = false;
      if (!screenshotFlipped) {
        try {
          sourceLinkDiv().classList.add("hide");
        } catch (e) {}
        screenshotFlipped = true;
        loadImage(false)(white);
      } else {
        loadImage(false)(mainScreenshot);
        try {
          sourceLinkDiv().classList.remove("hide");
        } catch (e) {}
        screenshotFlipped = false;
      }
    }
    if (wants(event) == "color") {
      // Set up colors
      if (kind === "colorSettings") {
        kind = null;
      } else {
        kind = "colorSettings";
      }
      // Can't deselect if we want to change colors
      //if (selected && selected.is) {
      //  selected.deselect();
      //}
      setBadge("color");
      //selected = null;
      return;
    }
    if (kind === "colorSettings") {
      if (event.key === "r") {
        colorName = "red";
        color = colors["red"];
      }
      if (event.key === "o") {
        colorName = "orange";
        color = colors["orange"];
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

      if (event.key === "s") {
        colors["solid"]()();
        color = colors[colorName];
        console.info("Setting alpha to solid");
      }
      if (selected && selected.setColor) {
        if (selected.is("arrow")) {
          // Arrow heads are identified by colour, as an id
          selected.setColor(colorName);
        } else {
          selected.setColor(color);
        }
      }
      kind = null;
      setBadge("empty");
      return;
    }
    if (event.key === "h") {
      for (const [key, entity] of Object.entries(shortcuts)) {
        help.innerHTML = help.innerHTML.replace(`{${entity}}`, `${key}`);
      }
      if (help.classList.contains("hide")) {
        help.classList.remove("hide");
      } else {
        help.classList.add("hide");
      }
    }
    if (wants(event) == "rect") {
      isDrawing = true;
      kind = "rect";
      setBadge("rect");
    }
    if (wants(event) == "ellipse") {
      isDrawing = true;
      kind = "ellipse";
      setBadge("ellipse");
    }
    if (wants(event) == "clip") {
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
    if (wants(event) == "highlight") {
      setBadge("highlight");
      isDrawing = true;
      kind = "highlight";
    }
    if (wants(event) == "arrow") {
      setBadge("arrow");
      isDrawing = true;
      kind = "arrow";
    }
    if (wants(event) == "paste") {
      kind = "paste";
      isDrawing = true;
      event.stopPropagation();
      setBadge("paste");
    }
    if (wants(event) == "text") {
      setBadge("text");
      isDrawing = true;
      kind = "text";
      event.stopPropagation();
    }
    if (wants(event) == "memes") {
      setBadge("memes");
      isDrawing = true;
      kind = "memes";
      hiddenInput.focus();
      event.stopPropagation();
      return;
    }
    if (isDrawing) {
      document.body.style.cursor = "crosshair";
    } else {
      document.body.style.cursor = "";
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

    if (radialMenu.classList.contains("show")) {
      radialMenu.classList.remove("show");
      document.querySelector(".radial").classList.remove("open");
    }

    lastClick = event;
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
                    kind = null; // This fixes Safari. For some reason it works on Chrome, but it shouldn't
                    event.stopPropagation();
                    event.preventDefault();
                  };
                  reader.readAsDataURL(blob);
                });
                break;
              }
              if (type === "text/html" || type === "text/plain") {
                clipboardItem
                  .getType(type)
                  .then((blob) => blob.text())
                  .then((html) => {
                    const text = new Text(
                      event.offsetX,
                      event.offsetY,
                      color,
                      document.getElementById("screenshotContainer"),
                      html,
                    );
                    window._elements[text.id] = text;
                    selected = text;
                    kind = null; // This fixes Safari. For some reason it works on Chrome, but it shouldn't
                    event.stopPropagation();
                    event.preventDefault();
                  });
              }
            }
          }
        });
        return;
      }
      let startX = event.offsetX;
      let startY = event.offsetY;
      if (kind === "rect" || kind === "highlight") {
        const rect = new Rect(startX, startY, color, svg, kind);
        window._elements[rect.id] = rect;
        selected = rect;
        event.preventDefault();
        return;
      }
      if (kind === "ellipse") {
        const ellipse = new Ellipse(startX, startY, color, svg);
        window._elements[ellipse.id] = ellipse;
        selected = ellipse;
        event.preventDefault();
        return;
      }
      if (kind === "clipping") {
        const newClipPath = new ClipPath(startX, startY, svg, svgImage);
        window._elements[newClipPath.id] = newClipPath;
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
          undefined,
        );
        window._elements[text.id] = text;
        selected = text;
        event.stopPropagation(); // Otherwise it will blur itself
        event.preventDefault();
        return;
      }
      if (kind === "arrow") {
        const arrow = new Arrow(startX, startY, colorName, svg);
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
      dragging = true;
      kind = "source";
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    let _kind =
      event.target &&
      event.target.getAttribute &&
      event.target.getAttribute("_kind");

    // This strange-looking block of ifs and fallthrough is to prevent click-on-text-and-type
    // to be interpreted as commands (passing kind="text" is not enough, but needed).
    if (
      event.target &&
      event.target.closest &&
      event.target.closest(".text-editor-wrapper")
    ) {
      selected = event.target.closest(".text-editor-wrapper");
      _kind = "text";
    } else {
      if (!_kind) {
        console.info("Clicked on something useless (unexpectedly?)");
        if (selected) {
          selected.deselect();
        }
        return;
      } else {
        selected = event.target;
      }
    }
    kind = _kind;
    dragging = true;

    selected = window._elements[selected.getAttribute("id")];
    selected.select();
    selected.dragInit(event.clientX, event.clientY);
    if (kind != "text") {
      event.preventDefault();
      event.stopPropagation();
    }
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
    if (fromMenu) {
      fromMenu = false;
      return;
    }
    if (isDrawing) {
      setBadge("empty");
      isDrawing = false;
      document.body.style.cursor = "";
      if (selected && selected.is) {
        if (!selected.is("text")) {
          selected.deselect();
          selected = null;
        }
      }
    }
    dragging = false;
  });
};
