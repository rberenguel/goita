export { Text };

class Text {
  constructor(x, y, color, container) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.container = container;
    this.element = this.createTextEditorElement();
    this.isSelected = true;
    this.id = `text-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    this.element.setAttribute("id", this.id);
    this.element.setAttribute("_kind", "text");
  }

  is(kind) {
    return kind === "text";
  }

  createTextEditorElement() {
    this.isSelected = true;
    const textEditorWrapper = document.createElement("div");
    textEditorWrapper.classList.add("text-editor-wrapper");
    textEditorWrapper.style.left = `calc(${this.x}px - 2em)`;
    textEditorWrapper.style.top = `calc(${this.y}px - 2em)`;

    const textEditor = document.createElement("div");
    this._textEditor = textEditor;
    console.log(this._textEditor);
    textEditor.classList.add("text-editor");
    textEditor.style.color = this.color(1);
    textEditor.contentEditable = true;
    textEditorWrapper.appendChild(textEditor);

    this.container.appendChild(textEditorWrapper);
    console.log(this.container);
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
      console.info("Text editor has blurred");
      console.log(this.isSelected);
      this.deselect();
    });

    textEditor.focus();

    return textEditorWrapper;
  }

  updateShape() {
    // Just a placeholder
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
    return fsed;
  }

  select() {
    this.isSelected = true;
    this.element.classList.add("selected");
  }

  deselect() {
    if (this.isSelected) {
      this.isSelected = false;
      console.info("Deselected text");
      const te = this.element.querySelector(".text-editor");
      console.info(te.textContent);
      this.element.classList.remove("selected");
      if (te.textContent.trim().length === 0) {
        console.info("Purging empty text");
        console.log(this.element);
        this.element.parentElement &&
          this.element.parentElement.removeChild(this.element);
      }
    }
  }

  delete() {
    this.container.removeChild(this.element);
  }
}
