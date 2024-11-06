export { Image };

class Image {
  constructor(x, y, dataUrl, svg) {
    this.x = x;
    this.y = y;
    this.dataUrl = dataUrl;
    this.svg = svg;
    this.element = this.createImageElement();
    this.isSelected = false;
    this.id = `pasted-image-${Date.now()}-${Math.floor(
      Math.random() * 1000000,
    )}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", "image");
  }

  is(kind) {
    return kind === "image";
  }

  createImageElement() {
    const pastedImage = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image",
    );
    pastedImage.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      this.dataUrl,
    );
    pastedImage.setAttribute("x", this.x);
    pastedImage.setAttribute("y", this.y);
    this.svg.appendChild(pastedImage);
    return pastedImage;
  }

  dragInit() {
    this.isSelected = true;
    this.select();
  }

  drag(event) {
    if (this.isSelected) {
      const bbox = this.element.getBoundingClientRect();
      const w = bbox.width;
      const h = bbox.height;
      requestAnimationFrame(() => {
        const newX = event.clientX - w / 2;
        const newY = event.clientY - h / 2;
        this.element.setAttribute("x", newX);
        this.element.setAttribute("y", newY);
      });
    }
  }
  dragEnd() {
    this.isSelected = false;
    this.deselect();
  }

  select() {
    this.isSelected = true;
    this.element.setAttribute("filter", "url(#drop-shadow)");

    // Add shadow for clipped image
    const clipPathUrl = this.element.getAttribute("clip-path");
    if (clipPathUrl) {
      const clipPathId = clipPathUrl.substring(5, clipPathUrl.length - 1);
      const clipPath = document.getElementById(clipPathId);
      const clipPathRect = clipPath.querySelector("rect");
      if (clipPathRect) {
        const shadowRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        shadowRect.setAttribute("x", clipPathRect.getAttribute("x"));
        shadowRect.setAttribute("y", clipPathRect.getAttribute("y"));
        shadowRect.setAttribute("width", clipPathRect.getAttribute("width"));
        shadowRect.setAttribute("height", clipPathRect.getAttribute("height"));
        shadowRect.setAttribute("fill", "rgba(0, 0, 0, 0.5)");
        shadowRect.setAttribute("stroke", "black");
        shadowRect.setAttribute("stroke-width", "3");
        shadowRect.setAttribute("filter", "url(#drop-shadow)");
        this.svg.insertBefore(shadowRect, this.element);
      }
    }
  }

  deselect() {
    this.isSelected = false;
    this.element.removeAttribute("filter");
  }

  delete() {
    this.svg.removeChild(this.element);
  }
}
