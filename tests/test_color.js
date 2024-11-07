import { mev, kev } from "./events.js";

mocha.checkLeaks();
mocha.run();

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Color", function () {
  this.slow(1000);
  for (const color of [
    "bblue",
    "yyellow",
    "rred",
    "wwhite",
    "ggreen",
    "xredact",
  ]) {
    it(`should be switched on by pressing C (${color.slice(1)})`, function (done) {
      const c = kev("c");
      document.dispatchEvent(c);
      const cc = kev(color[0]);
      document.dispatchEvent(cc);
      const a = kev("a");
      document.dispatchEvent(a);
      document.dispatchEvent(mev(700, 500, "mousedown"));
      document.dispatchEvent(mev(900, 700, "mousemove"));
      document.dispatchEvent(mev(0, 0, "mouseup"));
      const all = Array.from(document.querySelectorAll("*"));
      const arrs = all.filter(
        (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "arrow",
      );
      chai.expect(arrs.length).to.eql(1);
      const arr = window._elements[arrs[0].getAttribute("id")];
      chai.expect(arr.is("arrow")).to.be.true;
      chai
        .expect(arrs[0].getAttribute("marker-end"))
        .to.include(color.slice(1)); // I'm lazy yes
      arr.delete();
      setTimeout(done, 100);
    });
  }
  it(`should cancel by pressing C`, function (done) {
    const c = kev("c");
    document.dispatchEvent(c);
    document.dispatchEvent(kev("b"));
    document.dispatchEvent(c);
    document.dispatchEvent(c);
    const a = kev("a");
    document.dispatchEvent(a);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(900, 700, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const arrs = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "arrow",
    );
    chai.expect(arrs.length).to.eql(1);
    const arr = window._elements[arrs[0].getAttribute("id")];
    chai.expect(arr.is("arrow")).to.be.true;
    chai.expect(arrs[0].getAttribute("marker-end")).to.include("blue");
    setTimeout(done, 100);
  });
});
