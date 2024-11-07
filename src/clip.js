export { ClipPath };

class ClipPath {
  constructor(x, y, svg, image) {
    this.x = x;
    this.y = y;
    this.svg = svg;
    this.image = image;
    this.width = 0; // Initially zero width
    this.height = 0; // Initially zero height
    this.element = this.createClipPathElement();
    this.isSelected = false;
    this.kind = "clip";
    this.id = `clip-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", "clip");
  }

  is(kind) {
    return kind === this.kind;
  }

  createClipPathElement() {
    const clipPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "clipPath",
    );
    clipPath.setAttribute("id", this.id);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", this.x);
    rect.setAttribute("y", this.y);
    rect.setAttribute("width", this.width);
    rect.setAttribute("height", this.height);
    clipPath.appendChild(rect);
    this.svg.appendChild(clipPath);

    return clipPath;
  }

  updateShape(event) {
    const width = event.offsetX - this.x;
    const height = event.offsetY - this.y;

    // Calculate x and y based on width and height
    const x = width < 0 ? event.offsetX : this.x;
    const y = height < 0 ? event.offsetY : this.y;

    this.x = x;
    this.y = y;
    this.width = Math.abs(width);
    this.height = Math.abs(height);

    const rect = this.element.querySelector("rect"); // Get the rect within the clipPath
    requestAnimationFrame(() => {
      rect.setAttribute("x", this.x);
      rect.setAttribute("y", this.y);
      rect.setAttribute("width", this.width);
      rect.setAttribute("height", this.height);
    });
  }

  applyToImage() {
    this.image.setAttribute("clip-path", `url(#${this.id})`);
  }

  dragInit(clientX, clientY) {
    this.isSelected = true;
    this.select();

    const rect = this.element.querySelector("rect"); // Get the rect within the clipPath
    const imgx = parseFloat(this.image.getAttribute("x") ?? 0);
    const imgy = parseFloat(this.image.getAttribute("y") ?? 0);
    console.log(imgx, imgy);
    this.initialX = parseFloat(rect.getAttribute("x")) - imgx;
    this.initialY = parseFloat(rect.getAttribute("y")) - imgy;
    // TODO(me) This is not completely correct. Once we have moved the whole container (in the no-shift
    // case below), moving it again will be off by the first movement deltas.
    this.offsetX = clientX - this.initialX;
    this.offsetY = clientY - this.initialY;
  }

  drag(event) {
    if (this.isSelected) {
      requestAnimationFrame(() => {
        if (event.shiftKey) {
          // Check if Shift key is pressed
          const newX = event.clientX - this.offsetX;
          const newY = event.clientY - this.offsetY;
          const rect = this.element.querySelector("rect");
          rect.setAttribute("x", newX);
          rect.setAttribute("y", newY);
          if (this.highlightRect) {
            this.highlightRect.setAttribute("x", newX);
            this.highlightRect.setAttribute("y", newY);
          }
        } else {
          // If Shift key is not pressed, delegate dragging to the image
          const rect = this.element.querySelector("rect");
          const w = rect.getAttribute("width");
          const h = rect.getAttribute("height");
          const newX = event.clientX - this.initialX - w / 2;
          const newY = event.clientY - this.initialY - h / 2;
          this.image.setAttribute("x", newX);
          this.image.setAttribute("y", newY);
          rect.setAttribute("x", this.initialX + newX);
          rect.setAttribute("y", this.initialY + newY);
          if (this.highlightRect) {
            this.highlightRect.setAttribute("x", this.initialX + newX);
            this.highlightRect.setAttribute("y", this.initialY + newY);
          }
        }
      });
    }
  }

  dragEnd() {
    this.isSelected = false;
    this.deselect();
  }
  select() {
    this.isSelected = true;
    if (this.highlightRect) {
      return;
    }

    this.highlightRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    const rect = this.element.querySelector("rect");
    this.highlightRect.setAttribute("x", rect.getAttribute("x"));
    this.highlightRect.setAttribute("y", rect.getAttribute("y"));
    this.highlightRect.setAttribute("width", rect.getAttribute("width"));
    this.highlightRect.setAttribute("height", rect.getAttribute("height"));
    this.highlightRect.setAttribute("stroke-width", 2);
    this.highlightRect.setAttribute("stroke", "black");
    this.highlightRect.setAttribute("filter", "url(#drop-shadow)");
    this.highlightRect.setAttribute("fill", "none");
    this.svg.insertBefore(this.highlightRect, this.image);
  }

  deselect() {
    this.isSelected = false;

    // Remove the highlight rect
    if (this.highlightRect) {
      this.svg.removeChild(this.highlightRect);
      this.highlightRect = null;
    }

    // Remove any existing highlight rects for this clip path
    const existingHighlights = this.svg.querySelectorAll(
      `[clip-highlight-for="${this.id}"]`,
    );
    existingHighlights.forEach((highlight) => this.svg.removeChild(highlight));
  }

  delete() {
    this.deselect(); // To ensure highlights go away
    this.image.removeAttribute("clip-path"); // Remove the clip-path from the image
    this.image.setAttribute("x", 0);
    this.image.setAttribute("y", 0);
    try {
      delete window._elements[this.id];
      this.svg.removeChild(this.element);
    } catch (err) {
      console.log(err);
    }
  }
}
