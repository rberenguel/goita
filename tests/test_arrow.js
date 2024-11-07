mocha.checkLeaks();
mocha.run();
import { kev, mev, del, esc } from "./events.js";

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Arrow", function () {
  this.slow(1000);
  let _arr;
  it("should be created by pressing A", function (done) {
    const a = kev("a");
    document.dispatchEvent(a);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(800, 500, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const arrows = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "arrow",
    );
    chai.expect(arrows.length).to.eql(1);
    _arr = arrows[0];
    const arr = window._elements[_arr.getAttribute("id")];
    chai.expect(arr.is("arrow")).to.be.true;
    setTimeout(done, 100);
  });
  it("should be selected by clicking on it", function (done) {
    console.log("clicking on it");
    _arr.dispatchEvent(mev(710, 500, "mousedown"));
    _arr.dispatchEvent(mev(710, 500, "mouseup"));
    const arr = window._elements[_arr.getAttribute("id")];
    chai.expect(arr.is("arrow"));
    chai.expect(arr.isSelected).to.be.true;
    setTimeout(done, 100);
  });

  it("should be draggable once selected", function (done) {
    console.log("clicking on it");
    _arr.dispatchEvent(mev(710, 500, "mousedown"));
    _arr.dispatchEvent(mev(1010, 600, "mousemove"));
    _arr.dispatchEvent(mev(0, 0, "mouseup"));
    const arr = window._elements[_arr.getAttribute("id")];
    chai.expect(arr.is("arrow"));
    chai.expect(arr.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  it("should have dragged", function (done) {
    chai.expect(_arr.getAttribute("x1")).to.eql("1000");
    chai.expect(_arr.getAttribute("y1")).to.eql("600");
    setTimeout(done, 100);
  });
  it("should be unselectable", function (done) {
    document.dispatchEvent(mev(0, 0, "mousedown"));
    const arr = window._elements[_arr.getAttribute("id")];
    chai.expect(arr.isSelected).to.be.false;
    _arr.dispatchEvent(mev(1010, 600, "mousedown")); // reselectiong for deletion
    setTimeout(done, 100);
  });
  it("should be deletable", function (done) {
    document.dispatchEvent(del);
    const arr = window._elements[_arr.getAttribute("id")];
    const all = Array.from(document.querySelectorAll("*"));
    const arrows = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "arrow",
    );
    chai.expect(arrows.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
  it("too small arrows vanish", function (done) {
    const a = kev("a");
    document.dispatchEvent(a);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(705, 500, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const arrows = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "arrow",
    );
    chai.expect(arrows.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
  it("should cancel by pressing ESC", function (done) {
    console.info("Cancel on ESC");
    const a = kev("a");
    document.dispatchEvent(a);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(800, 600, "mousemove"));
    document.dispatchEvent(esc);
    document.dispatchEvent(mev(0, 0, "mouseup"));
    document.dispatchEvent(mev(700, 500, "mousedown"));
    const all = Array.from(document.querySelectorAll("*"));
    const arrows = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "arrow",
    );
    chai.expect(arrows.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
});
