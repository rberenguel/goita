import { mev, kev, del } from "./events.js";

mocha.checkLeaks();
mocha.run();

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Text", function () {
  this.slow(1000);
  let _text, _x, _y;
  it("should be created by pressing T", function (done) {
    const t = kev("t");
    document.dispatchEvent(t);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(800, 600, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const texts = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "text",
    );
    chai.expect(texts.length).to.eql(1);
    _text = texts[0];
    const text = window._elements[_text.getAttribute("id")];
    chai.expect(text.is("text")).to.be.true;

    _text.querySelector(".text-editor").textContent = "hello";

    setTimeout(done, 100);
  });
  it("should be selected by clicking on it", function (done) {
    _text.dispatchEvent(mev(710, 500, "mousedown"));
    _text.dispatchEvent(mev(710, 500, "mouseup"));
    const text = window._elements[_text.getAttribute("id")];
    chai.expect(text.is("text")).to.be.true;
    chai.expect(text.isSelected).to.be.true;
    setTimeout(done, 100);
  });

  it("should be draggable once selected", function (done) {
    const bb = _text.getBoundingClientRect();
    _x = bb.x;
    _y = bb.y;
    _text.dispatchEvent(mev(710, 500, "mousedown"));
    _text.dispatchEvent(mev(1010, 600, "mousemove"));
    _text.dispatchEvent(mev(0, 0, "mouseup"));
    const text = window._elements[_text.getAttribute("id")];
    chai.expect(text.is("text")).to.be.true;
    chai.expect(text.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  it("should have dragged (weak test due to flakiness;", function (done) {
    const bb = _text.getBoundingClientRect();

    chai.expect(bb.x).to.be.above(_x);
    chai.expect(bb.y).to.be.above(_y);
    setTimeout(done, 100);
  });
  it("should be unselectable", function (done) {
    document.dispatchEvent(mev(0, 0, "mousedown"));
    const text = window._elements[_text.getAttribute("id")];
    chai.expect(text.isSelected).to.be.false;
    _text.dispatchEvent(mev(1010, 600, "mousedown")); // reselectiong for deletion
    setTimeout(done, 100);
  });
  it("should be deletable", function (done) {
    document.dispatchEvent(del);
    const all = Array.from(document.querySelectorAll("*"));
    const texts = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "text",
    );
    chai.expect(texts.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
  it("no text vanishes", function () {
    const t = kev("t");
    document.dispatchEvent(t);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    document.dispatchEvent(mev(0, 0, "mousedown"));
    const all = Array.from(document.querySelectorAll("*"));
    const texts = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "text",
    );
    chai.expect(texts.length).to.eql(0);
  });
});
