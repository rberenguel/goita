import { setupAllTheThings } from "./screenshot.js";
import { white } from "./white.js";

const basepath = "../" // This is working weirdly now, for some reason

document.addEventListener(
  "DOMContentLoaded",
  setupAllTheThings(white, basepath),
);
