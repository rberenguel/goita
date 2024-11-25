import { memes, displayMemes } from "./memes.js";

const cb = (a) => () => {};

displayMemes(memes, { basepath: "../", callback: cb });

const enlarged = document.getElementById("enlarged");
const container = document.getElementById("meme-container");

document.addEventListener("click", (ev) => {
  if (
    ev.target.nodeName === "IMG" &&
    ev.target.closest(".meme-img") &&
    enlarged.classList.contains("hidden")
  ) {
    enlarged.innerHTML = "";
    const img = document.createElement("IMG");
    const closer = document.createElement("DIV");
    closer.classList.add("close");
    closer.innerHTML = "&#x274C;";
    const title = document.createElement("DIV");
    title.classList.add("meme-title");
    title.innerHTML = ev.target.closest(".meme-img").dataset["title"];
    img.src = ev.target.src;
    enlarged.appendChild(img);
    enlarged.appendChild(closer);
    enlarged.appendChild(title);
    enlarged.classList.remove("hidden");
    container.classList.add("blur");
  } else {
    enlarged.classList.add("hidden");
    container.classList.remove("blur");
  }
});
