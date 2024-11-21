import { colors, toTop } from "./common.js";

export { Ellipse };

class Ellipse {
  constructor(cx, cy, colorName, svg) {
    this.startX = cx; // Store initial cx
    this.startY = cy; // Store initial cy
    this.cx = cx;
    this.cy = cy;
    this.rx = 0; // Initially zero radius in x-direction
    this.ry = 0; // Initially zero radius in y-direction
    this.colorName = colorName;
    this.svg = svg;
    this.element = this.createEllipseElement();
    this.id = `ellipse-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", "ellipse");
    this.isSelected = false;
  }

  is(kind) {
    return kind === "ellipse";
  }

  createEllipseElement() {
    const ellipse = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse",
    );
    ellipse.setAttribute("cx", this.cx);
    ellipse.setAttribute("cy", this.cy);
    ellipse.setAttribute("rx", this.rx);
    ellipse.setAttribute("ry", this.ry);
    ellipse.setAttribute("stroke", colors[this.colorName](1));
    ellipse.setAttribute("stroke-width", "4"); // The ellipse stroke looks chunkier than the rectangle
    ellipse.setAttribute("fill", "rgba(0, 0, 0, 0.0)");

    this.svg.appendChild(ellipse);
    return ellipse;
  }

  updateShape(event) {
    const width = event.pageX - this.startX;
    const height = event.pageY - this.startY;

    this.cx = this.startX + width / 2; // Calculate center x
    this.cy = this.startY + height / 2; // Calculate center y
    this.rx = Math.abs(width / 2);
    this.ry = Math.abs(height / 2);

    requestAnimationFrame(() => {
      this.element.setAttribute("cx", this.cx);
      this.element.setAttribute("cy", this.cy);
      this.element.setAttribute("rx", this.rx);
      this.element.setAttribute("ry", this.ry);
    });
  }

  dragInit(clientX, clientY) {
    this.startOffsetX = clientX - this.cx;
    this.startOffsetY = clientY - this.cy;
    this.dragOn();
  }

  dragOn() {
    this.element.style.cursor = "grab";
  }

  dragOff() {
    this.element.style.cursor = "";
  }

  drag(event) {
    const newCx = event.clientX - this.startOffsetX;
    const newCy = event.clientY - this.startOffsetY;
    requestAnimationFrame(() => {
      this.element.setAttribute("cx", newCx);
      this.element.setAttribute("cy", newCy);
    });
  }

  select() {
    this.element.setAttribute("filter", "url(#drop-shadow)");
    this.isSelected = true;
    toTop(this.element);
  }

  deselect() {
    this.element.removeAttribute("filter");
    this.isSelected = false;
    this.dragOff();
  }

  delete() {
    try {
      delete window._elements[this.id];
      this.svg.removeChild(this.element);
    } catch (err) {
      console.error(err);
    }
  }
}
