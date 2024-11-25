export { createHelpDiv };

function createHelpDiv(settings = {}) {
  if (document.getElementById("help")) {
    return;
  }
  const helpDiv = document.createElement("div");
  helpDiv.id = "help";
  helpDiv.classList.add("hide");

  helpDiv.innerHTML = `
      <p style="text-align: center"><code>Goita!</code> Ruben Berenguel 2024</p>
      <hr />
      <ul>
        <li>Everything you can create can be dragged around and deleted.</li>
        <li>Click to select things.</li>
        <li>Drag to move them.</li>
        <li>
          If you prefer other shortcuts, change them in
          <code>shortcuts.js</code> (only those
          <span class="u">underlined</span> are configurable).
        </li>
      </ul>
      <p><code>h</code> show and hide this help</p>
      <p><code class="u">{arrow}</code> draw an arrow</p>
      <p><code class="u">{rect}</code>: draw a rectangle</p>
      <p><code class="u">{ellipse}</code> draw an ellipse</p>
      <p><code class="u">{highlight}</code> highlight an area</p>
      <p><code class="u">{text}</code> write text</p>
      <p><code> ctrl .</code> Make text larger (for this text block)</p>
      <p><code> ctrl ,</code> Make text smaller (for this text block)</p>
      <p>
        <code> ctrl /</code> Cycle through fonts (Monoid, Reforma, Inter,
        Roboto)
      </p>
      <p><code> ctrl + scrollwheel</code> Resize the text bounding box</p>
      <p><code> ctrl + c</code> Center the text</p>
      <p><code class="u">{paste}</code> paste images or text from the clipboard</p>
      <p><code> ctrl + scrollwheel</code> Resize the pasted image</p>
      <p><code class="u">{clip}</code> clip the screenshot</p>
      <p><code> drag</code> dragging moves the clipped image</p>
      <p><code> shift+drag</code> dragging moves the clipping rectangle</p>
      <p><code class="u">{clipboard}</code> swap the screenshot for whatever
        image there is on the clipboard (or go back to the screenshot)</p>
      <p><code class="u">{color}</code> choose color for the next operations</p>
      <p><code> r</code> red (default)</p>
      <p><code> y</code> yellow</p>
      <p><code> b</code> blue</p>
      <p><code> g</code> green</p>
      <p><code> o</code> orange</p>
      <p><code> w</code> white</p>
      <p><code> x</code> black (and highlight then redacts)</p>
      <p><code>{memes}</code>: enter meme selection, it will be placed on the last click</p>
      <p><code> type</code> to dynamically search through the list of memes</p>
      <p><code> tab</code> to display meme thumbnails</p>
      <p><code> enter</code> to select the topmost meme</p>
      <p><code> click</code> on the image or name to select it</p>
      <p><code> paste</code> an external meme URL (should be valid) to use that instead</p>
      <p><code>      </code> see all memes <a href="${settings.basepath}/memes/index.html">here</a></p>
      <p><code> esc</code> to dismiss</p>
      <p><code>{empty}</code>: switch between the screenshot and a white canvas (better for tweaking memes or diagrams)</p>
      <p><code>backspace</code>: delete anything selected</p>
    `;

  document.body.insertBefore(helpDiv, document.body.firstChild);
}
