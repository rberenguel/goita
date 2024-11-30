export { memes, filterMemes, displayMemes };

const memes = [
  {
    title: "Fry Not Sure",
    file: "not-sure-if-fry.jpg",
    keywords: ["Futurama", "Fry", "Not sure", "Not sure if"],
  },
  {
    title: "Distracted Boyfriend Meme",
    file: "distracted-boyfriend.jpg",
    keywords: ["distracted", "boyfriend", "girlfriend", "cheating"],
  },
  {
    title: "Confused Travolta",
    file: "confused-travolta.jpg",
    keywords: ["confused travolta", "pulp fiction"],
  },
  {
    title: "Homer Terminator",
    file: "homer-terminator.jpg",
    keywords: ["terminator homer", "rod tod", "simpsons"],
  },
  {
    title: "Homer Hiding in the Bush",
    file: "homer-bush.jpg",
    keywords: ["Homer Hiding in the Bush", "simpsons"],
  },
  {
    title: "Ralph: Go Banana",
    file: "go-banana.jpg",
    keywords: ["go banana", "ralph", "simpsons"],
  },
  {
    title: "Ralph (Chuckles): I'm in Danger",
    file: "ralph-danger.jpg",
    keywords: [
      "Ralph (Chuckles): I'm in Danger",
      "ralph chuckle in danger",
      "ralph",
      "simpsons",
    ],
  },
  {
    title: "Skinner Out of Touch",
    file: "skinner-idea.jpg",
    keywords: ["principal skinner out of touch", "simpsons"],
  },
  {
    title: "Skinner Steamed Hams",
    file: "steamed-hams.jpg",
    keywords: ["principal skinner steamed hams", "simpsons", "aurora borealis"],
  },
  {
    title: "(Chief Wiggum) Wink, wink",
    file: "wink-wink.jpg",
    keywords: ["(Chief Wiggum) Wink, wink", "simpsons", "wiggum"],
  },
  {
    title: "Chief Wiggum: invisible typewriter",
    file: "invisible-typewriter.jpg",
    keywords: ["Chief Wiggum: invisible typewriter", "simpsons", "wiggum"],
  },
  {
    title: "Old Man Yells",
    file: "old-man-yells.jpg",
    keywords: ["old man yells", "simpsons", "cloud"],
  },
  {
    title: "Stop! He's already dead",
    file: "stop-already.jpg",
    keywords: ["stop he's already dead", "simpsons", "kicking"],
  },
  {
    title: "Pepe Silvia",
    file: "pepe-silvia.jpg",
    keywords: [
      "pepe silvia",
      "it's always sunny in philadelphia",
      "conspiracy",
    ],
  },
  {
    title: "Cadaver? Qué cadaver?",
    file: "cadaver.jpg",
    keywords: ["cadaver", "bricomania"],
  },
  {
    title: "Flex Tape Fix",
    file: "flex-tape.jpg",
    keywords: ["fix a leak", "duct tape", "fix leaking water tank"],
  },
  {
    title: "PTSD Dog",
    file: "ptsdog.jpg",
    keywords: ["PTSD dog", "vietnam", "muffins"],
  },
  {
    title: "Side Eye Monkey",
    file: "side-eye-monkey.jpg",
    keywords: ["side eye monkey"],
  },
  {
    title: "Worst Day So Far",
    file: "so-far.jpg",
    keywords: ["bart", "homer", "worst day so far", "worst", "simpsons"],
  },
  {
    title: "Say It Bart",
    file: "say-it-bart.jpg",
    keywords: ["bart", "say it bart", "simpsons"],
  },
  {
    title: "One of Us",
    file: "one-of-us.jpg",
    keywords: ["homer", "bart", "lisa", "one of us", "simpsons"],
  },
  {
    title: "Lisa Presenting",
    file: "lisa-present.jpg",
    keywords: [
      "presentation",
      "lisa presenting",
      "hard truths",
      "hard to swallow",
    ],
  },
  {
    title: "Moe Kicking Out Barney",
    file: "kick-barney.jpg",
    keywords: ["Moe", "Barney", "kick", "back", "simpsons"],
  },
  {
    title: "Inanimated Carbon Rod",
    file: "carbon-rod.jpg",
    keywords: ["homer", "simpsons", "carbon", "rod inanimated"],
  },
  {
    title: "Pingu toot",
    file: "pingu-toot.jpg",
    keywords: ["pingu", "toot", "annoyed", "scream"],
  },
  {
    title: "Pingu don't want to",
    file: "pingu-dont-want-to.jpg",
    keywords: ["pingu", "don't", "want", "now"],
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
    keywords: ["Batman Thinking", "batman", "thinking", "comic"],
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
    title: "Ancient aliens, you know",
    file: "ancient-aliens.jpg",
    keywords: ["Ancient aliens, you know", "conspiracy"],
  },
  {
    title: "Left Exit 12 Off Ramp",
    file: "left-exit-12.jpg",
    keywords: ["left exit 12 off ramp", "change of mind"],
  },
  {
    title: "Boardroom Meeting Suggestion",
    file: "boardroom-suggestion.jpg",
    keywords: ["boardroom meeting", "suggestion", "distracted", "office"],
  },
  {
    title: "Change My Mind",
    file: "change-my-mind.jpg",
    keywords: ["change my mind", "change"],
  },
  {
    title: "Spice Adams Hiding Behind Tree",
    file: "spice-adams.jpg",
    keywords: ["spice adams hiding behind tree", "rubbing hands"],
  },
  {
    title: "Raccoon Praising the Gods",
    file: "raccoon-praise.jpg",
    keywords: ["Raccoon Praising the Gods", "praying", "begging", "sorry"],
  },
  {
    title: "Raccoon Painting or Planning",
    file: "raccoon-plan.jpg",
    keywords: ["Raccoon Painting or Planning", "plan", "plot"],
  },
  {
    title: "Nothing to See Here",
    file: "nothing-to-see-here.jpg",
    keywords: [
      "Nothing to See Here",
      "leslie nielsen",
      "naked gun",
      "move along",
    ],
  },

  {
    title: "Make It So",
    file: "make-it-so.jpg",
    keywords: [
      "Make It So",
      "jean-luc picard",
      "star trek",
      "command",
      "order",
    ],
  },

  {
    title: "Picard Facepalm",
    file: "facepalm.jpg",
    keywords: ["Picard facepalm", "facepalm", "jean-luc picard", "star trek"],
  },

  {
    title: "Khaaan!",
    file: "khaaan.jpg",
    keywords: [
      "Khaaan!",
      "william shatner",
      "star trek",
      "khan",
      "yelling",
      "anger",
    ],
  },

  {
    title: "Always Has Been",
    file: "always-been.jpg",
    keywords: [
      "Always Has Been",
      "astronaut",
      "space",
      "earth",
      "always has been",
      "meme",
    ],
  },
  {
    title: "Calvin and Hobbes Thought Police",
    file: "thought-police.jpg",
    keywords: [
      "Calvin and Hobbes Thought Police",
      "Calvin and Hobbes",
      "thought police",
      "censorship",
      "control",
    ],
  },
  {
    title: "Welcome to Science Hell",
    file: "tom-gauld-science-hell.jpg",
    keywords: [
      "Welcome to Science Hell",
      "Tom Gauld",
      "science",
      "hell",
      "scientists",
      "experiment",
      "punishment",
      "cartoon",
      "New Scientist",
    ],
  },
  {
    title: "Hank Scorpio Hammocks",
    file: "hammocks.jpg",
    keywords: [
      "Hank Scorpio Hammocks",
      "Hank Scorpio",
      "The Simpsons",
      "hammock",
      "office",
      "villain",
      "supervillain",
      "globex",
    ],
  },

  {
    title: "Hank Scorpio Kill It With Fire",
    file: "kill-it-with-fire.jpg",
    keywords: [
      "Hank Scorpio Kill It With Fire",
      "Hank Scorpio",
      "The Simpsons",
      "kill it with fire",
      "flamethrower",
      "villain",
      "supervillain",
      "globex",
    ],
  },
  {
    title: "Phineas: I Know What We're Gonna Do Today",
    file: "do-today.jpg",
    keywords: [
      "Phineas: I Know What We're Gonna Do Today",
      "Phineas and Ferb",
      "Phineas",
      "Ferb",
      "summer",
      "adventure",
      "invention",
      "Candace",
    ],
  },
  {
    title: "Oh no: I will do these things today",
    file: "to-do-webcomicname-dot-com.jpg",
    keywords: [
      "Oh no: I will do these things today",
      "todo",
      "priority",
      "webcomicname",
    ],
  },
  {
    title: "XKCD: compiling",
    file: "xkcd-compiling.jpg",
    keywords: ["xkcd compiling", "developer", "xkcd"],
  },
  {
    title: "XKCD: dependency",
    file: "xkcd-dependency.jpg",
    keywords: ["xkcd dependency", "developer", "xkcd"],
  },
  {
    title: "I have no idea what I'm doing",
    file: "no-idea.jpg",
    keywords: ["I have no idea what I'm doing", "dog", "confused"],
  },
  {
    title: "Djokovic screaming",
    file: "djokovic.jpg",
    keywords: ["Djokovic screaming", "angry", "tennis", "ffs"],
  },
  {
    title: "Bike self-fail",
    file: "bike-self-fail.jpg",
    keywords: ["Bike self-fail", "stupid", "bike"],
  },
  {
    title: "Anakin and Padme, right?",
    file: "anakin-padme.jpg",
    keywords: ["Anakin and Padme, right?", "disbelief", "confusion"],
  },
  {
    title: "Trolley problem",
    file: "trolley.jpg",
    keywords: ["trolley problem", "choice", "death"],
  },
  {
    title: "Gentleman frog",
    file: "gentleman-frog.jpg",
    keywords: ["Gentleman frog", "frog", "elegant"],
  },
  {
    title: "What a week, Captain",
    file: "what-a-week.jpg",
    keywords: ["What a week, Captain", "Haddock", "Tintin", "Wednesday"],
  },
  {
    title: "Won't somebody think of the children?",
    file: "wont-somebody.jpg",
    keywords: ["Won't somebody think of the children?", "Maude", "Simpsons"],
  },
  {
    title: "Who killed Hannibal?",
    file: "who-killed-hannibal.jpg",
    keywords: ["Who killed Hannibal?", "Who did that"],
  },
  {
    title: "Gru's plan",
    file: "grus-plan.jpg",
    keywords: ["Gru's plan", "confusion", "backfire"],
  },
  {
    title: "Rickroll",
    file: "rickroll.jpg",
    keywords: ["Rickroll", "Astley", "Never gonna"],
  },
  {
    title: "IT Crowd: have you tried restarting it?",
    file: "it-crowd-restarting.jpg",
    keywords: ["IT Crowd: have you tried restarting it?"],
  },
  {
    title: "Running away balloon",
    file: "running-balloon.jpg",
    keywords: ["Running away balloon", "obligations"],
  },
  {
    title: "Pager",
    file: "pager.png",
    keywords: ["Pager", "oncall"],
  },
  {
    title: "I've seen things you people wouldn't believe",
    file: "ive-seen-things.jpg",
    keywords: [
      "I've seen things you people wouldn't believe",
      "orion",
      "blade runner",
    ],
  },
  {
    title: "Your lack of faith in the force…",
    file: "lack-of-faith.jpg",
    keywords: ["Your lack of faith in the force", "Star Wars", "Vader"],
  },
  {
    title: "What's in the box?",
    file: "what-in-the-box.jpg",
    keywords: ["What's in the box?", "Gom Jabbar", "Dune"],
  },
];

const filterTextElement =
  document.getElementById("filter-text") ||
  document.body.appendChild(document.createElement("div"));
filterTextElement.id = "filter-text";

const filteredMemesElement =
  document.getElementById("filtered-memes") ||
  document.body.appendChild(document.createElement("div"));
filteredMemesElement.id = "filtered-memes";

function filterMemes(text, settings = {}) {
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
  if (settings.display) {
    displayMemes(filteredMemes, settings);
  }
  filteredMemes.forEach((meme) => {
    const p = document.createElement("p");
    p.textContent = meme.title;
    p.style.cursor = "pointer";
    p.dataset.file = meme.file;
    p.addEventListener(
      "click",
      settings.callback(settings.basepath + "memes/" + meme.file),
    );
    filteredMemesElement.appendChild(p);
    filteredMemesElement.style.display = "block";
  });
}

function displayMemes(memes, settings) {
  const container = document.getElementById("meme-container");

  if (container) {
    container.remove(); // Remove the existing container if it exists
  }

  const newContainer = document.createElement("div");
  newContainer.id = "meme-container";

  memes.forEach((meme) => {
    const memeDiv = document.createElement("div");
    const img = document.createElement("img");
    img.src = settings.basepath + "memes/" + meme.file;
    img.alt = meme.title;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover"; // This is key for square trimming
    memeDiv.classList.add("meme-div");
    memeDiv.appendChild(img);
    memeDiv.dataset["title"] = meme.title;
    memeDiv.classList.add("meme-img");
    memeDiv.addEventListener(
      "click",
      settings.callback(settings.basepath + "memes/" + meme.file),
    );
    newContainer.appendChild(memeDiv);
  });

  const existingContent = document.body.firstChild;
  document.body.insertBefore(newContainer, existingContent);
}
