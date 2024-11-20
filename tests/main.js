import { setupAllTheThings } from "../src/screenshot.js";
import { testImage } from "./testImage.js";

document.addEventListener("DOMContentLoaded", setupAllTheThings(testImage));
