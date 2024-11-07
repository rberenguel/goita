export { kev, mev, del, esc };

const kev = (letter) =>
  new KeyboardEvent("keydown", {
    key: letter,
    code: "Key" + letter.toUpperCase(), // The code for the "a" key
  });

const del = new KeyboardEvent("keydown", {
  key: "Backspace",
});

const esc = new KeyboardEvent("keydown", {
  key: "Escape",
});

const mev = (_clientX, _clientY, kind) => {
  let clientX = _clientX;
  let clientY = _clientY;

  let ev = new MouseEvent(kind, {
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
  });
  return ev;
};
