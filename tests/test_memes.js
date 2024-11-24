import { mev, kev, pev, enter, tab, esc } from "./events.js";

mocha.checkLeaks();
mocha.run();

document.dispatchEvent(mev(700, 500, "mousedown"));

describe("Memes", function () {
  this.slow(1000);
  it("should be triggered by pressing M and should search on type", function (done) {
    const m = kev("m");
    document.dispatchEvent(m);
    "not sure if".split("").map((k) => document.dispatchEvent(kev(k)));
    document.dispatchEvent(enter);
    const shutup = Array.from(
      document.querySelectorAll("#svgOverlay > image"),
    ).filter((i) => i.href.baseVal.includes("not-sure-if"));
    chai.expect(shutup).to.not.be.empty;
    setTimeout(done, 100);
  });
  it("should display thumbnails on tab and filter them, esc dismiss at the end", function (done) {
    const m = kev("m");
    document.dispatchEvent(m);
    document.dispatchEvent(tab);
    const thumbs = () =>
      document.querySelectorAll("#meme-container > .meme-img");
    chai.expect(thumbs()).to.not.be.empty;
    "futurama".split("").map((k) => document.dispatchEvent(kev(k)));
    chai.expect(thumbs().length).to.be.above(2);
    document.dispatchEvent(esc);
    chai.expect(thumbs()).to.be.empty;
    setTimeout(done, 100);
  });
  it("click on thumbnail should show image", function (done) {
    const m = kev("m");
    document.dispatchEvent(m);
    document.dispatchEvent(tab);
    const thumbs = () =>
      document.querySelectorAll("#meme-container > .meme-img");
    chai.expect(thumbs()).to.not.be.empty;
    "go banana".split("").map((k) => document.dispatchEvent(kev(k)));
    chai.expect(thumbs().length).to.be.above(0);
    thumbs()[0].dispatchEvent(mev(0, 0, "click"));
    const goBanana = Array.from(
      document.querySelectorAll("#svgOverlay > image"),
    ).filter((i) => i.href.baseVal.includes("go-banana"));
    chai.expect(goBanana).to.not.be.empty;
    chai.expect(thumbs()).to.be.empty;
    setTimeout(done, 100);
  });
  it("click on row should show image", function (done) {
    const m = kev("m");
    document.dispatchEvent(m);
    const ps = () => document.querySelectorAll("#filtered-memes > p");
    chai.expect(ps()).to.not.be.empty;
    "chuckles".split("").map((k) => document.dispatchEvent(kev(k)));
    chai.expect(ps().length).to.be.above(0);
    ps()[0].dispatchEvent(mev(0, 0, "click"));
    const chuckles = Array.from(
      document.querySelectorAll("#svgOverlay > image"),
    ).filter((i) => i.href.baseVal.includes("ralph-danger"));
    chai.expect(chuckles).to.not.be.empty;
    chai
      .expect(document.querySelector("#filtered-memes").style.display)
      .to.eql("none");
    setTimeout(done, 100);
  });
  it("paste of an URL should work", function (done) {
    const m = kev("m");
    document.dispatchEvent(m);
    const paste = pev(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Kilroy_was_here_%28re-drawn%29.gif/800px-Kilroy_was_here_%28re-drawn%29.gif?20060806104623",
    );
    document.dispatchEvent(paste);
    const kilroy = Array.from(
      document.querySelectorAll("#svgOverlay > image"),
    ).filter((i) => i.href.baseVal.includes("upload.wikimedia.org"));
    chai.expect(kilroy).to.not.be.empty;
    setTimeout(done, 100);
  });
});
