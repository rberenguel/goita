import { setupAllTheThings } from "./screenshot.js";
import { white } from "./white.js";

const basepath = window.location.pathname.startsWith("/src") ? "../" : "";

document.addEventListener(
  "DOMContentLoaded",
  setupAllTheThings(white, basepath),
);
