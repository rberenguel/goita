import { SCALE_FACTOR } from "./common.js";

export { Text };

const FONT_CLASSES = ["monoid", "reforma", "inter", "roboto"];
const FONT_FACTORS = [1, 1.5, 1.5, 1.5]; // Kinda hacky, but gets the job done
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
    this._fontSize = 18;
    this._font = 0;
    this.setFont();
    this.fontSize();
    this._scale = 1;
  }

  is(kind) {
    return kind === "text";
  }

  createTextEditorElement() {
    this.isSelected = true;
    const textEditorWrapper = document.createElement("div");
    this._textEditorWrapper = textEditorWrapper;
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

  scaleUp() {
    this._scale *= SCALE_FACTOR;
    if (this._scale > 20) {
      this._scale = 20;
    }
    this.scale();
  }

  scaleDown() {
    this._scale /= SCALE_FACTOR;
    if (this._scale < 0.2) {
      this._scale = 0.2;
    }
    this.scale();
  }

  scale() {
    const rect = this._textEditor.getBoundingClientRect();
    this._textEditor.style.width = this._scale * rect.width + "px";
    this._textEditor.style.height = this._scale * rect.height + "px";
    this._textEditorWrapper.style.width =
      this._textEditor.offsetWidth + 20 + "px";
    this._textEditorWrapper.style.height =
      this._textEditor.offsetHeight + 20 + "px";
  }

  cycleFonts() {
    this._font = (this._font + 1) % FONT_CLASSES.length;
    this.setFont();
  }

  fontName() {
    console.log(FONT_CLASSES[this._font]);
    return FONT_CLASSES[this._font];
  }

  setFont() {
    for (let i = 0; i < FONT_CLASSES.length; i++) {
      const fontClass = FONT_CLASSES[i];
      if (i === this._font) {
        this.element.classList.add(fontClass);
      } else {
        this.element.classList.remove(fontClass);
      }
    }
    this.fontSize(); // To make sure we update the sizing factors
  }

  fontSizeUp() {
    console.log("sizing up");
    console.log(this._fontSize);
    this._fontSize = this._fontSize + 2;
    this.fontSize();
  }

  fontSizeDown() {
    this._fontSize = Math.max(4, this._fontSize - 2);
    this.fontSize();
  }

  fontSize() {
    console.log(this._font, this._fontSize);
    const sizing = `${FONT_FACTORS[this._font] * this._fontSize}px`;
    console.log(sizing);
    this.element.style.fontSize = `${sizing}`;
  }

  center() {
    this.element.classList.toggle("center");
  }

  updateShape() {
    // Just a placeholder
  }

  dragInit(clientX, clientY) {
    this.startOffsetX = clientX - this.element.offsetLeft;
    this.startOffsetY = clientY - this.element.offsetTop;
    this.dragOn();
  }

  dragOn() {
    this.element.style.cursor = "grab";
  }

  dragOff() {
    this.element.style.cursor = "";
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
      this.dragOff();
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
      console.error(err);
    }
  }
}
