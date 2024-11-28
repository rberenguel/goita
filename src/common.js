export { colors, toTop, SCALE_FACTOR };

let solid = false;

const colors = {
  red: (a) => `rgba(220, 20, 20, ${solid ? 1 : a})`,
  yellow: (a) => `rgba(220, 220, 10, ${solid ? 1 : a})`,
  blue: (a) => `rgba(20, 20, 200, ${solid ? 1 : a})`,
  green: (a) => `rgba(20, 200, 20, ${solid ? 1 : a})`,
  orange: (a) => `rgba(240, 120, 10, ${solid ? 1 : a})`,
  redact: (a) => `rgba(0, 0, 0, ${solid ? a : 1})`, // By default black redacts
  white: (a) => `rgba(250, 250, 250, ${solid ? a : 1})`, // By default white redacts too
  solid: () => () => {
    solid = !solid;
  },
};

const SCALE_FACTOR = 1.05;

const toTop = (elt) => {
  const parent = elt.parentNode;
  parent.appendChild(elt);
};
