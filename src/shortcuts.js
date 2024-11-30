export { shortcuts, reverseShortcuts };

const shortcuts = {
  r: "rect",
  s: "highlight",
  t: "text",
  a: "arrow",
  v: "paste",
  p: "ellipse",
  q: "clipboard",
  m: "memes",
  k: "clip",
  c: "color",
  z: "empty",
};

const reverseShortcuts = {};

for (const key in shortcuts) {
  const value = shortcuts[key];
  reverseShortcuts[value] = key;
}
