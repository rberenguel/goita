export { filterMemes };

const notSureIf = {
  title: "Fry Not Sure",
  file: "not-sure-if-fry.jpg",
  keywords: ["Futurama", "Fry", "Not sure", "Not sure if"],
};

const memes = [
  notSureIf,
  {
    title: "Distracted Boyfriend Meme",
    file: "distracted-boyfriend.jpg",
    keywords: ["distracted", "boyfriend", "girlfriend", "cheating"],
  },
  {
    title: "'Smarts': Think about it",
    file: "smarts.jpg",
    keywords: ["smarts", "think"],
  },
  {
    title: "Shut up and take my money",
    file: "shut-up-and-take-my-money.jpg",
    keywords: ["Fry", "Futurama", "Money", "Shut up"],
  },
  {
    title: "Woman Yelling at a Cat",
    file: "woman-yelling-cat.jpg",
    keywords: ["woman", "cat", "yelling", "angry"],
  },
  {
    title: "Drakeposting",
    file: "drakeposting.jpg",
    keywords: ["drake", "drakeposting", "like", "dislike"],
  },
  {
    title: "Doge",
    file: "doge.jpg",
    keywords: ["doge", "shiba inu", "dog", "wow"],
  },
  {
    title: "Success Kid",
    file: "success-kid.jpg",
    keywords: ["success", "kid", "baby", "fist"],
  },
  {
    title: "One Does Not Simply",
    file: "one-does-not-simply.jpg",
    keywords: ["one does not simply", "lord of the rings", "boromir"],
  },
  {
    title: "Two Buttons Meme",
    file: "two-buttons.jpg",
    keywords: ["two", "buttons", "choice", "dilemma"],
  },
  {
    title: "Is This a Pigeon?",
    file: "is-this-a-pigeon.jpg",
    keywords: ["pigeon", "butterfly", "confused"],
  },
  {
    title: "American Chopper Argument",
    file: "american-chopper.jpg",
    keywords: ["american chopper", "argument", "family", "yelling", ,],
  },
  {
    title: "Hide the Pain Harold",
    file: "harold.jpg",
    keywords: ["hide the pain", "harold", "smiling", "pain", "awkward"],
  },
  {
    title: "Batman Slapping Robin",
    file: "batman-slapping.jpg",
    keywords: ["batman", "robin", "slapping", "comic"],
  },
  {
    title: "Batman Thinking",
    file: "batman-thinking.jpg",
    keywords: ["batman", "thinking", "comic"],
  },
  {
    title: "Bender Casino in the Moon",
    file: "bender-theme-park.jpg",
    keywords: ["bender", "futurama", "blackjack", "hookers", "casino", "moon"],
  },
  {
    title: "Why can't you just be normal?!",
    file: "be-normal.jpg",
    keywords: [
      "why can't you be normal",
      "screaming child",
      "frustration",
      "mother",
      "son",
    ],
  },
  {
    title: "Spider-Man Pointing",
    file: "spiderman-pointing.jpg",
    keywords: [
      "spiderman",
      "pointing",
      "confusion",
      "accusation",
      "mirror image",
      "spider-man",
    ],
  },
  {
    title: "I Hate This More",
    file: "i-hate-this-more.jpg",
    keywords: [
      "i hate this more",
      "disgusted",
      "annoyed",
      "worse",
      "escalation",
      "reaction",
    ],
  },
  {
    title: "Nathan Fillion Speechless",
    file: "castle-speechless.jpg",
    keywords: [
      "nathan fillion",
      "speechless",
      "shocked",
      "disbelief",
      "reaction",
      "castle",
    ],
  },
  {
    title: "Boardroom Meeting Suggestion",
    file: "boardroom-suggestion.jpg",
    keywords: ["boardroom meeting", "suggestion", "distracted", "office"]
  },
];

const filterTextElement = document.getElementById("filter-text");
const filteredMemesElement = document.getElementById("filtered-memes");

function filterMemes(text) {
  const lowerCaseText = text.toLowerCase();

  const filteredMemes = memes.filter((meme) => {
    return meme.keywords.some((keyword) =>
      keyword.toLowerCase().includes(lowerCaseText),
    );
  });

  // Update filter text display
  if (text) {
    filterTextElement.textContent = text;
    filterTextElement.style.display = "block";
  } else {
    filterTextElement.style.display = "none";
  }
  filteredMemesElement.innerHTML = "";
  filteredMemesElement.style.display = "none";
  filteredMemes.forEach((meme) => {
    const p = document.createElement("p");
    p.textContent = meme.title;
    p.dataset.file = meme.file;
    filteredMemesElement.appendChild(p);
    filteredMemesElement.style.display = "block";
  });
}
