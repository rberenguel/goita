export { colors };

const colors = {
  red: (a) => `rgba(220, 20, 20, ${a})`,
  yellow: (a) => `rgba(220, 220, 10, ${a})`,
  blue: (a) => `rgba(20, 20, 200, ${a})`,
  green: (a) => `rgba(20, 200, 20, ${a})`,
  redact: (a) => `rgba(0, 0, 0, 1.0)`,
  white: (a) => `rgba(250, 250, 250, ${a})`,
};
