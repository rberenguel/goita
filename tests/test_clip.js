import { mev, kev, del } from "./events.js";

mocha.checkLeaks();
mocha.run();

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Clip", function () {
  this.slow(1000);
  let _clip;
  it("should be created by pressing K", function (done) {
    const k = kev("k");
    document.dispatchEvent(k);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(900, 700, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const clips = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "clip",
    );
    chai.expect(clips.length).to.eql(1);
    _clip = clips[0];
    const clip = window._elements[_clip.getAttribute("id")];
    chai.expect(clip.is("clip")).to.be.true;
    setTimeout(done, 100);
  });
  it("should be selected by clicking on it", function (done) {
    console.log("clicking on it");
    _clip.dispatchEvent(mev(710, 500, "mousedown"));
    _clip.dispatchEvent(mev(710, 500, "mouseup"));
    const clip = window._elements[_clip.getAttribute("id")];
    chai.expect(clip.is("clip")).to.be.true;
    chai.expect(clip.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  // These dragging tests are just fixing the current behaviour,
  // I haven't checked if these numbers are really what they should be in practice
  it("should be draggable once selected", function (done) {
    console.log("clicking on it");
    _clip.dispatchEvent(mev(710, 500, "mousedown"));
    _clip.dispatchEvent(mev(1010, 600, "mousemove"));
    _clip.dispatchEvent(mev(0, 0, "mouseup"));
    const clip = window._elements[_clip.getAttribute("id")];
    chai.expect(clip.is("clip")).to.be.true;
    chai.expect(clip.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  it("should have dragged", function (done) {
    chai.expect(_clip.querySelector("rect").getAttribute("x")).to.eql("910"); // Center-moving
    chai.expect(_clip.querySelector("rect").getAttribute("y")).to.eql("500"); // Center-moving
    setTimeout(done, 100);
  });
  it("should be shift-draggable once selected", function (done) {
    console.log("clicking on it");
    _clip.dispatchEvent(mev(710, 500, "mousedown"));
    const mv = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 100,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    _clip.dispatchEvent(mv);
    _clip.dispatchEvent(mev(0, 0, "mouseup"));
    const clip = window._elements[_clip.getAttribute("id")];
    chai.expect(clip.is("clip")).to.be.true;
    chai.expect(clip.isSelected).to.be.true;
    setTimeout(done, 100);
  });
  it("should have shift-dragged", function (done) {
    chai.expect(_clip.querySelector("rect").getAttribute("x")).to.eql("90"); // Center-moving
    chai.expect(_clip.querySelector("rect").getAttribute("y")).to.eql("100"); // Center-moving
    const clip = window._elements[_clip.getAttribute("id")];
    const img = clip.image;
    chai.expect(img.getAttribute("x")).to.eql("210");
    chai.expect(img.getAttribute("y")).to.eql("0");
    setTimeout(done, 100);
  });
  it("should be undone by pressing K", function (done) {
    const k = kev("k");
    document.dispatchEvent(k);
    const all = Array.from(document.querySelectorAll("*"));
    const clips = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "clip",
    );
    chai.expect(clips.length).to.eql(0);

    setTimeout(done, 100);
  });
  it("should be unselectable", function (done) {
    // Here I recreate and reselect
    const k = kev("k");
    document.dispatchEvent(k);
    document.dispatchEvent(mev(700, 500, "mousedown"));
    document.dispatchEvent(mev(900, 700, "mousemove"));
    document.dispatchEvent(mev(0, 0, "mouseup"));
    const all = Array.from(document.querySelectorAll("*"));
    const clips = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "clip",
    );
    chai.expect(clips.length).to.eql(1);
    _clip = clips[0];
    _clip.dispatchEvent(mev(710, 500, "mousedown"));
    _clip.dispatchEvent(mev(710, 500, "mouseup"));
    document.dispatchEvent(mev(0, 0, "mousedown"));
    const clip = window._elements[_clip.getAttribute("id")];
    chai.expect(clip.isSelected).to.be.false;
    _clip.dispatchEvent(mev(1010, 600, "mousedown")); // reselectiong for deletion
    setTimeout(done, 100);
  });
  it("should be deletable", function (done) {
    document.dispatchEvent(del);
    const all = Array.from(document.querySelectorAll("*"));
    const texts = all.filter(
      (a) => a.getAttribute("_kind") && a.getAttribute("_kind") === "text",
    );
    console.log(texts);
    chai.expect(texts.length).to.eql(0);
    chai.expect(Object.keys(window._elements).length).to.eql(0);
    setTimeout(done, 100);
  });
});
