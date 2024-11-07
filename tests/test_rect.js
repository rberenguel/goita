import { mev, kev, del } from "./events.js";

mocha.checkLeaks();
mocha.run();

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Rect", function () {
  this.slow(1000);
  let _rect;
  it("should be created by pressing R", function (done) {
    const r = kev("r");
    document.dispatchEvent(r);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(800, 600, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const arrows = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "rect",
    );
    chai.expect(arrows.length).to.eql(1);
    _rect = arrows[0];
    const rect = window._elements[_rect.getAttribute("id")];
    chai.expect(rect.is("rect")).to.be.true;
    setTimeout(done, 100);
  });
  it("should be selected by clicking on it", function (done) {
    console.log("clicking on it");
    _rect.dispatchEvent(mev(710, 500, "mousedown"));
    _rect.dispatchEvent(mev(710, 500, "mouseup"));
    const rect = window._elements[_rect.getAttribute("id")];
    chai.expect(rect.is("rect")).to.be.true;
    chai.expect(rect.isSelected).to.be.true;
    setTimeout(done, 100);
  });

  it("should be draggable once selected", function (done) {
    console.log("clicking on it");
    _rect.dispatchEvent(mev(710, 500, "mousedown"));
    _rect.dispatchEvent(mev(1010, 600, "mousemove"));
    _rect.dispatchEvent(mev(0, 0, "mouseup"));
    const rect = window._elements[_rect.getAttribute("id")];
    chai.expect(rect.is("rect")).to.be.true;
    chai.expect(rect.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  it("should have dragged", function (done) {
    chai.expect(_rect.getAttribute("x")).to.eql("1000");
    chai.expect(_rect.getAttribute("y")).to.eql("600");
    setTimeout(done, 100);
  });
  it("should be unselectable", function (done) {
    document.dispatchEvent(mev(0, 0, "mousedown"));
    const rect = window._elements[_rect.getAttribute("id")];
    chai.expect(rect.isSelected).to.be.false;
    _rect.dispatchEvent(mev(1010, 600, "mousedown")); // reselectiong for deletion
    setTimeout(done, 100);
  });
  it("should be deletable", function (done) {
    document.dispatchEvent(del);
    const all = Array.from(document.querySelectorAll("*"));
    const rects = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "rect",
    );
    chai.expect(rects.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
});
