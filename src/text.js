export { Text };

class Text {
  constructor(x, y, color, container, text) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.container = container;
    this.text = text;
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

    textEditor.classList.add("text-editor");
    textEditor.style.color = this.color(1);
    textEditor.contentEditable = true;
    textEditorWrapper.appendChild(textEditor);

    if (this.text) {
      console.log(this.text);
      this._textEditor.innerHTML = this.text;
    }

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

    if (this.text) {
      const ev = new InputEvent("input", {
        inputType: "",
        bubbles: true,
        cancelable: true,
      });
      textEditor.dispatchEvent(ev);
    }

    textEditor.addEventListener("focus", () => {
      textEditorWrapper.classList.add("selected");
    });

    textEditor.addEventListener("blur", () => {
      textEditorWrapper.classList.remove("selected");
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

      const te = this.element.querySelector(".text-editor");
      console.info(`Deselected text: '${te.textContent}'`);
      this.element.classList.remove("selected");
      if (te.textContent.trim().length === 0) {
        console.info("Purging empty text");
        this.element.parentElement &&
          this.element.parentElement.removeChild(this.element);
      }
    }
  }

  delete() {
    try {
      delete window._elements[this.id];
      this.container.removeChild(this.element);
    } catch (err) {
      console.log(err);
    }
  }
}
