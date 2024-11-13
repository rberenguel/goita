import { mev, kev, del } from "./events.js";

mocha.checkLeaks();
mocha.run();

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Ellipse", function () {
  this.slow(1000);
  let _ellipse;
  it("should be created by pressing W", function (done) {
    const r = kev("w");
    document.dispatchEvent(r);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(800, 600, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const ellipses = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "ellipse",
    );
    chai.expect(ellipses.length).to.eql(1);
    _ellipse = ellipses[0];
    const ellipse = window._elements[_ellipse.getAttribute("id")];
    chai.expect(ellipse.is("ellipse")).to.be.true;
    setTimeout(done, 100);
  });
  it("should be selected by clicking on it", function (done) {
    _ellipse.dispatchEvent(mev(710, 500, "mousedown"));
    _ellipse.dispatchEvent(mev(710, 500, "mouseup"));
    const ellipse = window._elements[_ellipse.getAttribute("id")];
    chai.expect(ellipse.is("ellipse")).to.be.true;
    chai.expect(ellipse.isSelected).to.be.true;
    setTimeout(done, 100);
  });

  it("should be draggable once selected", function (done) {
    _ellipse.dispatchEvent(mev(710, 500, "mousedown"));
    _ellipse.dispatchEvent(mev(1010, 600, "mousemove"));
    _ellipse.dispatchEvent(mev(0, 0, "mouseup"));
    const ellipse = window._elements[_ellipse.getAttribute("id")];
    chai.expect(ellipse.is("ellipse")).to.be.true;
    chai.expect(ellipse.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  it("should have dragged", function (done) {
    chai.expect(_ellipse.getAttribute("cx")).to.eql("1050");
    chai.expect(_ellipse.getAttribute("cy")).to.eql("650");
    setTimeout(done, 100);
  });
  it("should be unselectable", function (done) {
    document.dispatchEvent(mev(0, 0, "mousedown"));
    const ellipse = window._elements[_ellipse.getAttribute("id")];
    chai.expect(ellipse.isSelected).to.be.false;
    _ellipse.dispatchEvent(mev(1010, 600, "mousedown")); // reselectiong for deletion
    setTimeout(done, 100);
  });
  it("should be deletable", function (done) {
    document.dispatchEvent(del);
    const all = Array.from(document.querySelectorAll("*"));
    const ellipses = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "ellipse",
    );
    chai.expect(ellipses.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
});
