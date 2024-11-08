# Goita

> guaitar (first-person singular present guaito, first-person singular preterite guaití, past participle guaitat)

> to observe, look
> to pay attention

> Borrowed from Frankish *wahtōn, *wahtjan (“to watch, guard”), derivative of *wahta (“guard, watch”), from Proto-Germanic *wahtwō (“guard, watch”), from Proto-Indo-European \*weǵ- (“to be fresh, cheerful, awake”).

---

An extension to take and annotate screenshots.

## Demo video

Click the image to open the video (youtube). If you don't want to do that, you can find the video in `media/goita-demo-v09.mov`.

[![](https://raw.githubusercontent.com/rberenguel/goita/refs/heads/gh-pages/media/goita-demo-v09.jpeg)](https://youtu.be/FFXH2IKZ_Vw&mode=theatre)

## Why? Aren't there a million like this?

Yes, but this is mine.

Also, two features I have wanted for a while:

1. Adds (visible, draggable) the URL the screenshot has been taken from. On a Mac, that is enough to go back to the source.

![](media/goita.jpg)

2. In addition to an image, **it can export the screenshot as a `data:base64` encoded URL**, where the image is clickable (combines with point 1). I can't embed an example in a README (github seems to throw such a long URL away) but you can find it in [`media/data-url-example`](https://raw.githubusercontent.com/rberenguel/goita/refs/heads/gh-pages/media/data-url-example), copy that blob of text in the URL of your browser (tested in Chrome and Safari) and you should see a screenshot as the one above, clickable.

## Annotation features

For all these, creation and deletion (click the element and press backspace) should be possible.

- [x] Choose color: press `c` and then one of:
  - `r`: Red (this is the default).
  - `y`: Yellow.
  - `b`: Blue.
  - `g`: Green.
  - `w`: White.
  - `x`: Redact (will use solid black in everything).
  - `c`: To cancel the "choose color" mode.
- [x] Rectangles: press `r` and drag to create.
- [x] Arrows: press `a` and drag to create from source to destination.
- [x] Text: press `t` and click to place.
- [x] Highlight: press `s` and drag to create. Use color `x` to redact. (why `s` and not `h`? Because all other shape/tool letters are on the left hand)
- [x] Redact: Use highlighting with color "redact".
- [x] Clip-on-drag the initial screenshot: press `k` at any time.
  - The resulting clipped block is draggable after clicking on it to select it.
  - Shift-dragging drags the clip.
  - Select the clipped image and press `k` again to restore the viewframe.
- [x] Paste images from the clipboard: press `v` and then click somewhere.
  - The pasted image is draggable.
  - The pasted image can be deleted by pressing backspace (like any other element after selection).
- [x] Paste HTML text from the clipboard: press `v` and then click somewhere.
  - The pasted text is draggable.
  - The pasted text is contenteditable.
  - The pasted image can be deleted by pressing backspace (like any other element after selection).
  - [ ] Handle `text/plain`
- [ ] Circles/ellipses
- [x] The current mode and color (when drawing) is showed in the extension badge. Make sure to pin it.

I think there is an interaction mode I forgot to set up/clear up. More later.

## Installation

Download/clone this repository somewhere and load the extension in Chrome via `Extensions -> Load unpacked`. I only could get it to fully work once I enabled "enable in Incognito". If you don't feel like doing that, that's okay. I wrote this for my own use anyway…

## Tests?

It is kind of tested, at least the editing functionality, which is the "easiest" to test. I took a leaf out of the development of Weave and added Chai/Mocha in-browser tests. They try to reproduce human behavior by sending browser events. I think it is neat, because I need no headless browser or anything.

You can see them (in separate iframes) [here](https://mostlymaths.net/goita/tests/).

If you want to run them locally, start a local web server of some sort in the root folder of the repository (like running `python3 -m http.server 8000`) and open the `tests/` link there. The main index holds several iframes with the individual suites per "functionality" (`arrow`, `rect`, `etc`), you can also open the individual pages instead, or add new ones.

The way the tests work is:

- They "run" in a webpage that is pretty much like the one the extension presents, but with chai/mocha in-browser running.
- The div where the screenshot is shown is hidden behind a div, or just `display: none` (depends on the test).
- If you are changing stuff or developing a new test/functionality, you can display that and explore what is added and what not,
  confirming stuff works as expected "live", in the test page itself.

There is no testing of the Chrome specific APIs, because there is little of them, and it's kind of untestable.

- Generating images in `popup.js` when pressing the extension button.
- Changing the extension and badge title in `screenshot.js` (behind a try with no catch to let this run in tests out of extension sandboxing).

## Local development, contributing

The most straightforward route if you want a feature or change stuff:

- Clone this somewhere.
- Load unpacked, as if you were to use it (it's assumed you want to).
- Make sure you can run the tests as in the previous section.
- Start changing code and trying changes. If you have a screenshot page (i.e. the one you can draw in after pressing the extension) open, refreshing it loads the most current version of your edited code.

As for contributing, this is one of my personal projects, and like many others I have, I have a clear idea of what I want (or a clear idea of what I don't). So this is likely to follow whatever my whim is (in other words, I may reject pull requests for no good reason), but as an open source project, please fork, play with this _and make it your own_.

## Credits

- Icon: Gemini via Imagen 3.
- Gemini helped fight with Chrome permissions, but I ended up having to read (again) too much of its documentation.
