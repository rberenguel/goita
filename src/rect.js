import { colors } from "./common.js";

export { Rect };

class Rect {
  constructor(x, y, colorName, svg, kind) {
    this.startX = x; // Store initial x
    this.startY = y; // Store initial y
    this.x = x;
    this.y = y;
    this.width = 0; // Initially zero width
    this.height = 0; // Initially zero height
    this.colorName = colorName;
    this.svg = svg;
    this.kind = kind; // 'rect' or 'highlight'
    this.element = this.createRectElement();
    this.id = `rect-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", this.kind);
    this.isSelected = false;
  }

  is(kind) {
    return kind === this.kind;
  }

  createRectElement() {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", this.x);
    rect.setAttribute("y", this.y);
    rect.setAttribute("width", this.width);
    rect.setAttribute("height", this.height);
    if (this.kind === "rect") {
      rect.setAttribute("stroke", colors[this.colorName](1));
      rect.setAttribute("stroke-width", "5");
      rect.setAttribute("fill", "rgba(0, 0, 0, 0.0)");
      rect.setAttribute("rx", "5");
    } else if (this.kind === "highlight") {
      rect.setAttribute("stroke-width", "0");
      rect.setAttribute("fill", colors[this.colorName](0.2));
    }
    this.svg.appendChild(rect);
    return rect;
  }

  updateShape(event) {
    const width = event.offsetX - this.startX;
    const height = event.offsetY - this.startY;

    // Calculate x and y based on width and height
    const x = width < 0 ? event.offsetX : this.startX;
    const y = height < 0 ? event.offsetY : this.startY;

    this.x = x;
    this.y = y;
    this.width = Math.abs(width);
    this.height = Math.abs(height);

    requestAnimationFrame(() => {
      this.element.setAttribute("x", this.x);
      this.element.setAttribute("y", this.y);
      this.element.setAttribute("width", this.width);
      this.element.setAttribute("height", this.height);
    });
  }

  dragInit(clientX, clientY) {
    this.startOffsetX = clientX - this.x;
    this.startOffsetY = clientY - this.y;
  }

  drag(event) {
    const newX = event.clientX - this.startOffsetX;
    const newY = event.clientY - this.startOffsetY;
    requestAnimationFrame(() => {
      this.element.setAttribute("x", newX);
      this.element.setAttribute("y", newY);
    });
  }

  select() {
    this.element.setAttribute("filter", "url(#drop-shadow)");
    this.isSelected = true;
  }

  deselect() {
    this.element.removeAttribute("filter");
    this.isSelected = false;
  }

  delete() {
    this.svg.removeChild(this.element);
  }
}
