export { Text };

class Text {
  constructor(x, y, color, container) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.container = container;
    this.element = this.createTextEditorElement();
    this.isSelected = false;
    this.id = `text-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", "text");
  }

  is(kind) {
    return kind === "text";
  }

  createTextEditorElement() {
    const textEditorWrapper = document.createElement("div");
    textEditorWrapper.classList.add("text-editor-wrapper");
    textEditorWrapper.style.left = `calc(${this.x}px - 2em)`;
    textEditorWrapper.style.top = `calc(${this.y}px - 2em)`;

    const textEditor = document.createElement("div");
    textEditor.classList.add("text-editor");
    textEditor.style.color = this.color(1);
    textEditor.contentEditable = true;
    textEditorWrapper.appendChild(textEditor);

    this.container.appendChild(textEditorWrapper);

    textEditor.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        textEditor.blur();
      }
    });

    textEditor.addEventListener("input", () => {
      textEditor.style.width = "auto";
      textEditor.style.height = "auto";

      const rect = textEditor.getBoundingClientRect();
      textEditor.style.width = rect.width + "px";
      textEditor.style.height = rect.height + "px";

      textEditorWrapper.style.width = textEditor.offsetWidth + 20 + "px";
      textEditorWrapper.style.height = textEditor.offsetHeight + 20 + "px";
    });

    textEditor.addEventListener("focus", () => {
      textEditorWrapper.classList.add("selected");
    });

    textEditor.addEventListener("blur", () => {
      textEditorWrapper.classList.remove("selected");
      if (textEditor.textContent.trim().length === 0) {
        textEditorWrapper.parentElement.removeChild(textEditorWrapper);
      }
    });

    textEditor.focus();

    return textEditorWrapper;
  }

  dragInit(clientX, clientY) {
    this.startOffsetX = clientX - this.element.offsetLeft;
    this.startOffsetY = clientY - this.element.offsetTop;
  }

  drag(event) {
    const newX = event.clientX - this.startOffsetX;
    const newY = event.clientY - this.startOffsetY;
    requestAnimationFrame(() => {
      this.element.style.left = `${newX}px`;
      this.element.style.top = `${newY}px`;
    });
  }

  focused() {
    const fsed =
      document.activeElement === this.element.querySelector(".text-editor");
    console.log(fsed);
    return fsed;
  }

  select() {
    this.isSelected = true;
    this.element.classList.add("selected");
  }

  deselect() {
    this.isSelected = false;
    this.element.classList.remove("selected");
  }

  delete() {
    this.container.removeChild(this.element);
  }
}
