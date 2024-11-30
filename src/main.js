import { setupAllTheThings } from "./screenshot.js";
import { white } from "./white.js";

const basepath = window.location.pathname.startsWith("/src") ? "../" : ""; // TODO(me): This is weird

document.addEventListener(
  "DOMContentLoaded",
  setupAllTheThings(white, basepath),
);
