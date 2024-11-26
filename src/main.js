import { setupAllTheThings } from "./screenshot.js";
import { white } from "./white.js";

const basepath = window.location.pathname.startsWith("/src") ? "../" : "../"; // TODO(me): remove once paths are fixed

document.addEventListener(
  "DOMContentLoaded",
  setupAllTheThings(white, basepath),
);
