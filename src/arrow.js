export { Arrow };

import { colors } from "./common.js";

class Arrow {
  constructor(x1, y1, colorName, svg) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x1; // Initially, the arrowhead is at the same point
    this.y2 = y1;
    this.colorName = colorName;
    this.svg = svg;
    this.element = this.createArrowElement();
    this.isSelected = false;
    this.kind = "arrow";
    this.id = `arrow-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", "arrow");
  }

  is(kind) {
    return kind === this.kind;
  }

  createArrowElement() {
    const arrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    arrow.setAttribute("x1", this.x1);
    arrow.setAttribute("y1", this.y1);
    arrow.setAttribute("x2", this.x2);
    arrow.setAttribute("y2", this.y2);
    arrow.setAttribute("stroke", colors[this.colorName](1));
    arrow.setAttribute("stroke-width", "5");
    arrow.setAttribute("marker-end", `url(#arrowhead-${this.colorName})`);
    this.svg.appendChild(arrow);
    return arrow;
  }
  updateShape(event) {
    this.x2 = event.clientX;
    this.y2 = event.clientY;
    requestAnimationFrame(() => {
      this.element.setAttribute("x2", this.x2);
      this.element.setAttribute("y2", this.y2);
    });
  }

  _length() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  dragInit(clientX, clientY) {
    const startX = this.element.x1.baseVal.value;
    const startY = this.element.y1.baseVal.value;
    const endX = this.element.x2.baseVal.value;
    const endY = this.element.y2.baseVal.value;
    console.table({ clientX, clientY, startX, startY, endX, endY });
    this.startOffsetX = clientX - startX;
    this.startOffsetY = clientY - startY;
    this.endOffsetX = clientX - endX;
    this.endOffsetY = clientY - endY;
    console.debug("Ref: started drag on arrow");
    console.table({ eofx: this.endOffsetX, eofy: this.endOffsetY });
  }

  drag(event) {
    // Calculate new positions for start and end points
    const newStartX = event.clientX - this.startOffsetX;
    const newStartY = event.clientY - this.startOffsetY;
    const newEndX = event.clientX - this.endOffsetX;
    const newEndY = event.clientY - this.endOffsetY;

    // Update the arrow's position
    requestAnimationFrame(() => {
      this.element.setAttribute("x1", newStartX);
      this.element.setAttribute("y1", newStartY);
      this.element.setAttribute("x2", newEndX);
      this.element.setAttribute("y2", newEndY);
    });
  }

  select() {
    this.isSelected = true;
    this.element.setAttribute("filter", "url(#drop-shadow)");
  }

  deselect() {
    this.element.removeAttribute("filter");
    // Arrows of very small length will be autodeleted.
    // Same will happen with any element, to be fair.
    if (this._length() < 10) {
      this.delete();
    }
  }

  delete() {
    this.svg.removeChild(this.element);
  }
}
