"use strict";

/* =========================================================
   DON'T STOP MOVING
   Complete Game Logic
========================================================= */

/* =========================
   DOM
========================= */

const game = document.getElementById("game");

const startMenu = document.getElementById("startMenu");
const shopPanel = document.getElementById("shopPanel");
const missionsPanel = document.getElementById("missionsPanel");
const gameOver = document.getElementById("gameOver");

const playBtn = document.getElementById("playBtn");
const shopBtn = document.getElementById("shopBtn");
const missionsBtn = document.getElementById("missionsBtn");

const closeShopBtn = document.getElementById("closeShopBtn");
const closeMissionsBtn = document.getElementById("closeMissionsBtn");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const worldEl = document.getElementById("world");
const runCoinsEl = document.getElementById("runCoins");

const livesEl = document.getElementById("lives");
const powerHud = document.getElementById("powerHud");

const bestScoreEl = document.getElementById("bestScore");
const menuCoinsEl = document.getElementById("menuCoins");

const finalScoreEl = document.getElementById("finalScore");
const finalCoinsEl = document.getElementById("finalCoins");
const finalBestEl = document.getElementById("finalBest");

const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const pauseBtn = document.getElementById("pauseBtn");

const player = document.getElementById("player");
const playerEmoji = document.getElementById("playerEmoji");

const playerHitbox = document.getElementById("playerHitbox");
const playerTrail = document.getElementById("playerTrail");

const objects = document.getElementById("objects");

const forestScenery = document.getElementById("forestScenery");
const cityScenery = document.getElementById("cityScenery");
const nightScenery = document.getElementById("nightScenery");
const hauntedScenery = document.getElementById("hauntedScenery");
const hauntedFog = document.getElementById("hauntedFog");

const moon = document.getElementById("moon");

const nightWarning = document.getElementById("nightWarning");
const hauntedWarning = document.getElementById("hauntedWarning");

const missionList = document.getElementById("missionList");
const missionToast = document.getElementById("missionToast");
const shopToast = document.getElementById("shopToast");

const shopCoinsEl = document.getElementById("shopCoins");
const charactersShop = document.getElementById("charactersShop");
const effectsShop = document.getElementById("effectsShop");

const equippedCharacterName =
  document.getElementById("equippedCharacterName");

const soundBtn = document.getElementById("soundBtn");

const mobileLeft = document.getElementById("mobileLeft");
const mobileRight = document.getElementById("mobileRight");
const mobileJump = document.getElementById("mobileJump");


/* =========================================================
   STORAGE
========================================================= */

const HIGH_SCORE_KEY = "dontStopMovingHighScore";
const MISSION_KEY = "dontStopMovingMissions";
const COINS_KEY = "dontStopMovingGameCoins";
const SHOP_KEY = "dontStopMovingShop";


/* =========================================================
   GAME STATE
========================================================= */

let running = false;
let paused = false;

let score = 0;
let runCoins = 0;

let lives = 3;
const MAX_LIVES = 5;

let level = 1;

let currentWorld = "forest";

const CITY_SCORE = 40;
const NIGHT_SCORE = 100;
const HAUNTED_SCORE = 180;

let playerX = 150;
let playerY = 0;

let velocityY = 0;
let jumping = false;

const gravity = 0.72;
const jumpPower = 17.5;

const normalPlayerSpeed = 5;
const boostedPlayerSpeed = 7;

let gameSpeed = 5.5;


/* =========================================================
   OBJECT ARRAYS
========================================================= */

let obstacles = [];
let coins = [];

let magnets = [];
let shields = [];
let extraLives = [];
let speedBoosts = [];


/* =========================================================
   POWER-UPS
========================================================= */

let magnetActive = false;
let magnetDuration = 0;

let shieldActive = false;

let speedBoostActive = false;
let speedBoostDuration = 0;

const MAGNET_DURATION = 480;
const SPEED_DURATION = 480;


/* =========================================================
   TIMERS
========================================================= */

let obstacleTimer = 0;
let coinTimer = 0;
let magnetTimer = 0;
let shieldTimer = 0;
let extraLifeTimer = 0;
let speedBoostTimer = 0;

let scoreTimer = 0;


/* =========================================================
   INPUT
========================================================= */

let moveLeft = false;
let moveRight = false;


/* =========================================================
   SOUND
========================================================= */

let soundEnabled = true;
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    try {
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
    } catch {
      audioContext = null;
    }
  }
}

function playSound(type) {

  if (!soundEnabled) return;

  initAudio();

  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  let frequency = 400;
  let duration = 0.08;

  if (type === "coin") {
    frequency = 850;
    duration = 0.08;
  }

  if (type === "jump") {
    frequency = 500;
    duration = 0.08;
  }

  if (type === "power") {
    frequency = 700;
    duration = 0.18;
  }

  if (type === "hit") {
    frequency = 120;
    duration = 0.25;
  }

  if (type === "mission") {
    frequency = 900;
    duration = 0.25;
  }

  if (type === "buy") {
    frequency = 650;
    duration = 0.18;
  }

  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    .001,
    audioContext.currentTime + duration
  );

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + duration
  );
}


/* =========================================================
   GAME COINS
========================================================= */

let gameCoins =
  Number(localStorage.getItem(COINS_KEY)) || 0;

function saveCoins() {
  localStorage.setItem(
    COINS_KEY,
    String(gameCoins)
  );

  updateCoinUI();
}

function updateCoinUI() {

  menuCoinsEl.textContent = gameCoins;
  shopCoinsEl.textContent = gameCoins;
}


/* =========================================================
   HIGH SCORE
========================================================= */

let highScore =
  Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;

bestScoreEl.textContent = highScore;


/* =========================================================
   SHOP DATA
========================================================= */

const characters = [
  {
    id: "boy",
    name: "Classic Boy",
    emoji: "👦",
    price: 0,
    description: "The original runner."
  },
  {
    id: "girl",
    name: "Classic Girl",
    emoji: "👧",
    price: 0,
    description: "The original girl runner."
  },
  {
    id: "ninja",
    name: "Ninja",
    emoji: "🥷",
    price: 500,
    description: "Silent but unstoppable."
  },
  {
    id: "robot",
    name: "Robot",
    emoji: "🤖",
    price: 1000,
    description: "Built for endless runs."
  },
  {
    id: "vampire",
    name: "Vampire",
    emoji: "🧛",
    price: 1500,
    description: "Perfect for the dark world."
  }
];

const effects = [
  {
    id: "none",
    name: "No Effect",
    icon: "⭕",
    price: 0,
    description: "Classic running style."
  },
  {
    id: "fire",
    name: "Fire Trail",
    icon: "🔥",
    price: 300,
    description: "Leave fire behind you."
  },
  {
    id: "lightning",
    name: "Lightning Trail",
    icon: "⚡",
    price: 500,
    description: "Electric energy trail."
  },
  {
    id: "rainbow",
    name: "Rainbow Trail",
    icon: "🌈",
    price: 800,
    description: "A colorful moving trail."
  }
];


/* =========================================================
   SHOP SAVE DATA
========================================================= */

const defaultShopData = {
  ownedCharacters: [
    "boy",
    "girl"
  ],

  ownedEffects: [
    "none"
  ],

  equippedCharacter: "boy",

  equippedEffect: "none"
};

let shopData;

try {

  const savedShop =
    JSON.parse(
      localStorage.getItem(SHOP_KEY)
    );

  shopData = {
    ...defaultShopData,
    ...(savedShop || {})
  };

} catch {

  shopData = {
    ...defaultShopData
  };
}

function saveShop() {

  localStorage.setItem(
    SHOP_KEY,
    JSON.stringify(shopData)
  );

}


/* =========================================================
   SHOP UI
========================================================= */

function renderShop() {

  updateCoinUI();

  charactersShop.innerHTML = "";
  effectsShop.innerHTML = "";

  characters.forEach(character => {

    const owned =
      shopData.ownedCharacters.includes(
        character.id
      );

    const equipped =
      shopData.equippedCharacter ===
      character.id;

    const card =
      document.createElement("div");

    card.className = "shopCard";

    let actionText = "";
    let actionClass = "";

    if (equipped) {

      actionText = "✓ EQUIPPED";
      actionClass = "equipped";

    } else if (owned) {

      actionText = "EQUIP";
      actionClass = "equip";

    } else {

      actionText =
        `🪙 ${character.price} BUY`;

      actionClass = "buy";
    }

    card.innerHTML = `
      <div class="shopPreview">
        ${character.emoji}
      </div>

      <div class="shopName">
        ${character.name}
      </div>

      <div class="shopDescription">
        ${character.description}
      </div>

      ${
        character.price > 0 && !owned
          ? `<div class="shopPrice">
              🪙 ${character.price}
             </div>`
          : `<div class="shopPrice">
              ${owned ? "OWNED" : "FREE"}
             </div>`
      }

      <button
        class="shopAction ${actionClass}"
        data-character="${character.id}"
      >
        ${actionText}
      </button>
    `;

    charactersShop.appendChild(card);
  });


  effects.forEach(effect => {

    const owned =
      shopData.ownedEffects.includes(
        effect.id
      );

    const equipped =
      shopData.equippedEffect ===
      effect.id;

    const card =
      document.createElement("div");

    card.className = "shopCard";

    let actionText = "";
    let actionClass = "";

    if (equipped) {

      actionText = "✓ EQUIPPED";
      actionClass = "equipped";

    } else if (owned) {

      actionText = "EQUIP";
      actionClass = "equip";

    } else {

      actionText =
        `🪙 ${effect.price} BUY`;

      actionClass = "buy";
    }

    card.innerHTML = `
      <div class="effectPreview">
        ${effect.icon}
      </div>

      <div class="shopName">
        ${effect.name}
      </div>

      <div class="shopDescription">
        ${effect.description}
      </div>

      ${
        effect.price > 0 && !owned
          ? `<div class="shopPrice">
              🪙 ${effect.price}
             </div>`
          : `<div class="shopPrice">
              ${owned ? "OWNED" : "FREE"}
             </div>`
      }

      <button
        class="shopAction ${actionClass}"
        data-effect="${effect.id}"
      >
        ${actionText}
      </button>
    `;

    effectsShop.appendChild(card);
  });


  applyEquippedCharacter();
  applyEquippedEffect();
}


/* =========================================================
   SHOP ACTIONS
========================================================= */

function buyCharacter(id) {

  const character =
    characters.find(c => c.id === id);

  if (!character) return;

  if (
    shopData.ownedCharacters.includes(id)
  ) {

    equipCharacter(id);

    return;
  }

  if (gameCoins < character.price) {

    showShopToast(
      "❌ Not enough coins!"
    );

    return;
  }

  gameCoins -= character.price;

  shopData.ownedCharacters.push(id);

  shopData.equippedCharacter = id;

  saveCoins();
  saveShop();

  applyEquippedCharacter();

  playSound("buy");

  showShopToast(
    `🎉 ${character.name} unlocked!`
  );

  renderShop();
}


function buyEffect(id) {

  const effect =
    effects.find(e => e.id === id);

  if (!effect) return;

  if (
    shopData.ownedEffects.includes(id)
  ) {

    equipEffect(id);

    return;
  }

  if (gameCoins < effect.price) {

    showShopToast(
      "❌ Not enough coins!"
    );

    return;
  }

  gameCoins -= effect.price;

  shopData.ownedEffects.push(id);

  shopData.equippedEffect = id;

  saveCoins();
  saveShop();

  applyEquippedEffect();

  playSound("buy");

  showShopToast(
    `✨ ${effect.name} unlocked!`
  );

  renderShop();
}


function equipCharacter(id) {

  if (
    !shopData.ownedCharacters.includes(id)
  ) return;

  shopData.equippedCharacter = id;

  saveShop();

  applyEquippedCharacter();

  showShopToast("👤 Character equipped!");

  renderShop();
}


function equipEffect(id) {

  if (
    !shopData.ownedEffects.includes(id)
  ) return;

  shopData.equippedEffect = id;

  saveShop();

  applyEquippedEffect();

  showShopToast("✨ Effect equipped!");

  renderShop();
}


/* =========================================================
   SHOP CLICK EVENTS
========================================================= */

charactersShop.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-character]"
      );

    if (!button) return;

    const id =
      button.dataset.character;

    const owned =
      shopData.ownedCharacters.includes(id);

    if (owned) {
      equipCharacter(id);
    } else {
      buyCharacter(id);
    }
  }
);


effectsShop.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-effect]"
      );

    if (!button) return;

    const id =
      button.dataset.effect;

    const owned =
      shopData.ownedEffects.includes(id);

    if (owned) {
      equipEffect(id);
    } else {
      buyEffect(id);
    }
  }
);


/* =========================================================
   EQUIPPED CHARACTER
========================================================= */

function applyEquippedCharacter() {

  const character =
    characters.find(
      c =>
        c.id ===
        shopData.equippedCharacter
    );

  if (!character) return;

  playerEmoji.textContent =
    character.emoji;

  equippedCharacterName.textContent =
    character.name;
}


/* =========================================================
   EQUIPPED EFFECT
========================================================= */

function applyEquippedEffect() {

  player.classList.remove(
    "trail-fire",
    "trail-lightning",
    "trail-rainbow"
  );

  if (
    shopData.equippedEffect === "fire"
  ) {

    player.classList.add(
      "trail-fire"
    );

  }

  if (
    shopData.equippedEffect === "lightning"
  ) {

    player.classList.add(
      "trail-lightning"
    );

  }

  if (
    shopData.equippedEffect === "rainbow"
  ) {

    player.classList.add(
      "trail-rainbow"
    );

  }
}


/* =========================================================
   SHOP TABS
========================================================= */

document.querySelectorAll(".shopTab")
  .forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".shopTab")
          .forEach(t =>
            t.classList.remove("active")
          );

        tab.classList.add("active");

        if (
          tab.dataset.tab ===
          "characters"
        ) {

          charactersShop
            .classList.remove("hidden");

          effectsShop
            .classList.add("hidden");

        } else {

          charactersShop
            .classList.add("hidden");

          effectsShop
            .classList.remove("hidden");
        }
      }
    );
  });


/* =========================================================
   SHOP TOAST
========================================================= */

let shopToastTimer;

function showShopToast(message) {

  shopToast.textContent = message;

  shopToast.classList.add("show");

  clearTimeout(shopToastTimer);

  shopToastTimer =
    setTimeout(() => {

      shopToast.classList.remove("show");

    }, 1800);
}


/* =========================================================
   MISSIONS
========================================================= */

const missionStatsDefault = {
  coins: 0,
  obstacles: 0,
  shieldUses: 0,
  speedUses: 0,
  hauntedReached: false
};

const missionDefinitions = [

  {
    id: "coinCollector",
    name: "🪙 Coin Collector",
    description: "Collect 25 coins.",
    target: 25,
    reward: 100
  },

  {
    id: "roadSurvivor",
    name: "🏃 Road Survivor",
    description: "Pass 30 obstacles.",
    target: 30,
    reward: 150
  },

  {
    id: "shieldMaster",
    name: "🛡️ Shield Master",
    description: "Use Shield 3 times.",
    target: 3,
    reward: 200
  },

  {
    id: "speedDemon",
    name: "⚡ Speed Demon",
    description: "Use Speed Boost 3 times.",
    target: 3,
    reward: 200
  },

  {
    id: "darkness",
    name: "👻 Into The Darkness",
    description: "Reach Haunted Area.",
    target: 1,
    reward: 300
  }
];


let missionData;

try {

  const saved =
    JSON.parse(
      localStorage.getItem(
        MISSION_KEY
      )
    );

  missionData = {
    ...missionStatsDefault,
    ...(saved || {})
  };

} catch {

  missionData = {
    ...missionStatsDefault
  };
}


let missionClaimed = {};


try {

  missionClaimed =
    JSON.parse(
      localStorage.getItem(
        MISSION_KEY + "_claimed"
      )
    ) || {};

} catch {

  missionClaimed = {};
}


function saveMissionData() {

  localStorage.setItem(
    MISSION_KEY,
    JSON.stringify(missionData)
  );

  localStorage.setItem(
    MISSION_KEY + "_claimed",
    JSON.stringify(missionClaimed)
  );
}


function getMissionProgress(mission) {

  if (
    mission.id ===
    "coinCollector"
  ) {
    return missionData.coins;
  }

  if (
    mission.id ===
    "roadSurvivor"
  ) {
    return missionData.obstacles;
  }

  if (
    mission.id ===
    "shieldMaster"
  ) {
    return missionData.shieldUses;
  }

  if (
    mission.id ===
    "speedDemon"
  ) {
    return missionData.speedUses;
  }

  if (
    mission.id ===
    "darkness"
  ) {
    return missionData.hauntedReached
      ? 1
      : 0;
  }

  return 0;
}


function renderMissions() {

  missionList.innerHTML = "";

  missionDefinitions.forEach(
    mission => {

      const progress =
        Math.min(
          getMissionProgress(mission),
          mission.target
        );

      const completed =
        progress >= mission.target;

      const claimed =
        missionClaimed[mission.id];

      const percent =
        (progress /
          mission.target) *
        100;

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "missionCard";

      card.innerHTML = `
        <div class="missionTop">

          <div class="missionName">
            ${mission.name}
          </div>

          <div class="missionReward">
            +${mission.reward} 🪙
          </div>

        </div>

        <div class="missionDescription">
          ${mission.description}
        </div>

        <div class="progressBar">
          <div
            class="progressFill"
            style="width:${percent}%"
          ></div>
        </div>

        <div class="missionBottom">

          <span>
            ${progress}/${mission.target}
          </span>

          ${
            claimed
              ? `<span class="missionDone">
                   ✓ CLAIMED
                 </span>`
              : completed
              ? `<span class="missionDone">
                   ✓ COMPLETED
                 </span>`
              : `<span>
                   In progress
                 </span>`
          }

        </div>
      `;

      missionList.appendChild(card);
    }
  );
}


function checkMissions() {

  let changed = false;

  missionDefinitions.forEach(
    mission => {

      const progress =
        getMissionProgress(
          mission
        );

      if (
        progress >=
        mission.target &&
        !missionClaimed[mission.id]
      ) {

        missionClaimed[mission.id] =
          true;

        gameCoins +=
          mission.reward;

        changed = true;

        showMissionToast(
          `🎉 ${mission.name} completed! +${mission.reward} 🪙`
        );

        playSound("mission");
      }
    }
  );

  if (changed) {

    saveCoins();
    saveMissionData();
    renderMissions();
  }
}


let missionToastTimer;

function showMissionToast(message) {

  missionToast.textContent =
    message;

  missionToast.classList.add(
    "show"
  );

  clearTimeout(
    missionToastTimer
  );

  missionToastTimer =
    setTimeout(() => {

      missionToast.classList.remove(
        "show"
      );

    }, 2500);
}


/* =========================================================
   WORLD
========================================================= */

function updateWorld() {

  let nextWorld = "forest";

  if (score >= HAUNTED_SCORE) {
    nextWorld = "haunted";
  } else if (score >= NIGHT_SCORE) {
    nextWorld = "night";
  } else if (score >= CITY_SCORE) {
    nextWorld = "city";
  }

  if (
    nextWorld !== currentWorld
  ) {

    currentWorld = nextWorld;

    if (
      currentWorld ===
      "haunted"
    ) {

      missionData.hauntedReached =
        true;

      saveMissionData();

      showWorldWarning(
        "👻 HAUNTED AREA"
      );

    } else if (
      currentWorld ===
      "night"
    ) {

      showWorldWarning(
        "🌙 NIGHT CITY"
      );
    }
  }

  forestScenery.style.display =
    currentWorld === "forest"
      ? "block"
      : "none";

  cityScenery.style.display =
    currentWorld === "city"
      ? "block"
      : "none";

  nightScenery.style.display =
    currentWorld === "night"
      ? "block"
      : "none";

  hauntedScenery.style.display =
    currentWorld === "haunted"
      ? "block"
      : "none";

  hauntedFog.style.display =
    currentWorld === "haunted"
      ? "block"
      : "none";

  moon.style.display =
    currentWorld === "night" ||
    currentWorld === "haunted"
      ? "block"
      : "none";

  worldEl.textContent =
    currentWorld.toUpperCase();
}


function showWorldWarning(text) {

  const element =
    text.includes("HAUNTED")
      ? hauntedWarning
      : nightWarning;

  element.textContent = text;
  element.style.display = "block";

  setTimeout(() => {

    element.style.display = "none";

  }, 2200);
}


/* =========================================================
   PROGRESSION
========================================================= */

function updateProgress() {

  level =
    Math.floor(score / 20) + 1;

  gameSpeed =
    Math.min(
      7,
      5.5 +
      (level - 1) *
      0.12
    );

  updateWorld();

  levelEl.textContent =
    level;
}


/* =========================================================
   PLAYER
========================================================= */

function jump() {

  if (!running || paused) return;

  if (!jumping) {

    velocityY =
      jumpPower;

    jumping = true;

    playSound("jump");
  }
}


function updatePlayer() {

  if (moveLeft) {

    playerX -=
      speedBoostActive
        ? boostedPlayerSpeed
        : normalPlayerSpeed;
  }

  if (moveRight) {

    playerX +=
      speedBoostActive
        ? boostedPlayerSpeed
        : normalPlayerSpeed;
  }

  playerX =
    Math.max(
      20,
      Math.min(
        game.clientWidth - 80,
        playerX
      )
    );

  if (jumping) {

    playerY +=
      velocityY;

    velocityY -=
      gravity;

    if (playerY <= 0) {

      playerY = 0;
      velocityY = 0;
      jumping = false;
    }
  }

  player.style.left =
    playerX + "px";

  player.style.bottom =
    (120 + playerY) + "px";
}


/* =========================================================
   CREATE OBJECT
========================================================= */

function createElement(
  className,
  emoji
) {

  const element =
    document.createElement("div");

  element.className =
    className;

  element.textContent =
    emoji;

  objects.appendChild(
    element
  );

  return element;
}


/* =========================================================
   OBSTACLES
========================================================= */

function spawnObstacle() {

  let emoji = "🧟";

  if (
    currentWorld ===
    "forest"
  ) {

    const list = [
      "🧟",
      "👹",
      "💀",
      "👻"
    ];

    emoji =
      list[
        Math.floor(
          Math.random() *
          list.length
        )
      ];

  } else if (
    currentWorld ===
    "city"
  ) {

    const list = [
      "🚗",
      "🚕",
      "🚙",
      "🚓",
      "🚌",
      "🚧"
    ];

    emoji =
      list[
        Math.floor(
          Math.random() *
          list.length
        )
      ];

  } else if (
    currentWorld ===
    "night"
  ) {

    const list = [
      "🚗",
      "🚕",
      "🚙",
      "🚧",
      "👹"
    ];

    emoji =
      list[
        Math.floor(
          Math.random() *
          list.length
        )
      ];

  } else {

    const list = [
      "👻",
      "💀",
      "🧟",
      "🧛",
      "👹"
    ];

    emoji =
      list[
        Math.floor(
          Math.random() *
          list.length
        )
      ];
  }

  const obstacle =
    createElement(
      "gameObject obstacle",
      emoji
    );

  const isFlying =
    currentWorld === "haunted" &&
    (
      emoji === "👻" ||
      emoji === "🧛"
    );

  let bottom = 120;

  if (isFlying) {

    obstacle.classList.add(
      "flyingObstacle"
    );

    const heights = [
      150,
      185,
      220,
      255
    ];

    bottom =
      heights[
        Math.floor(
          Math.random() *
          heights.length
        )
      ];
  }

  obstacle.style.bottom =
    bottom + "px";

  obstacle.style.left =
    game.clientWidth + 30 + "px";

  const data = {
    el: obstacle,
    x: game.clientWidth + 30,
    bottom,
    counted: false,
    hit: false
  };

  obstacle.innerHTML = `
    <span>${emoji}</span>
    <div class="obstacleHitbox"></div>
  `;

  obstacles.push(data);
}


/* =========================================================
   COINS
========================================================= */

function spawnCoin() {

  const coin =
    createElement(
      "gameObject coin",
      "🪙"
    );

  const y =
    150 +
    Math.random() *
    260;

  coin.style.left =
    game.clientWidth + 20 + "px";

  coin.style.bottom =
    y + "px";

  coins.push({
    el: coin,
    x: game.clientWidth + 20,
    y
  });
}


/* =========================================================
   MAGNET
========================================================= */

function spawnMagnet() {

  const element =
    createElement(
      "gameObject powerup",
      "🧲"
    );

  const y =
    160 +
    Math.random() *
    220;

  element.style.left =
    game.clientWidth + 30 + "px";

  element.style.bottom =
    y + "px";

  magnets.push({
    el: element,
    x: game.clientWidth + 30,
    y
  });
}


/* =========================================================
   SHIELD
========================================================= */

function spawnShield() {

  const element =
    createElement(
      "gameObject powerup",
      "🛡️"
    );

  element.style.left =
    game.clientWidth + 30 + "px";

  element.style.bottom =
    155 +
    Math.random() *
    200 +
    "px";

  shields.push({
    el: element,
    x: game.clientWidth + 30
  });
}


/* =========================================================
   EXTRA LIFE
========================================================= */

function spawnExtraLife() {

  const element =
    createElement(
      "gameObject powerup",
      "❤️"
    );

  element.style.left =
    game.clientWidth + 30 + "px";

  element.style.bottom =
    160 +
    Math.random() *
    180 +
    "px";

  extraLives.push({
    el: element,
    x: game.clientWidth + 30
  });
}


/* =========================================================
   SPEED BOOST
========================================================= */

function spawnSpeedBoost() {

  const element =
    createElement(
      "gameObject powerup",
      "⚡"
    );

  element.style.left =
    game.clientWidth + 30 + "px";

  element.style.bottom =
    170 +
    Math.random() *
    190 +
    "px";

  speedBoosts.push({
    el: element,
    x: game.clientWidth + 30
  });
}


/* =========================================================
   COLLISION
========================================================= */

function rectsCollide(
  rect1,
  rect2
) {

  return !(
    rect1.right <
    rect2.left ||

    rect1.left >
    rect2.right ||

    rect1.bottom <
    rect2.top ||

    rect1.top >
    rect2.bottom
  );
}


function playerCollides(
  element
) {

  return rectsCollide(
    playerHitbox.getBoundingClientRect(),
    element.getBoundingClientRect()
  );
}


/* =========================================================
   HANDLE OBSTACLE HIT
========================================================= */

function handleObstacleHit(
  obstacle
) {

  if (obstacle.hit) return;

  obstacle.hit = true;

  if (shieldActive) {

    shieldActive = false;

    missionData.shieldUses++;

    saveMissionData();

    playSound("power");

    obstacle.el.remove();

    obstacles =
      obstacles.filter(
        o => o !== obstacle
      );

    return;
  }

  lives--;

  updateLives();

  player.classList.add(
    "hitFlash"
  );

  setTimeout(() => {

    player.classList.remove(
      "hitFlash"
    );

  }, 500);

  playSound("hit");

  if (lives <= 0) {

    endGame();

    return;
  }

  obstacle.el.remove();

  obstacles =
    obstacles.filter(
      o => o !== obstacle
    );
}


/* =========================================================
   UPDATE OBSTACLES
========================================================= */

function updateObstacles() {

  obstacles.forEach(
    obstacle => {

      obstacle.x -=
        gameSpeed *
        (
          speedBoostActive
            ? 1.18
            : 1
        );

      obstacle.el.style.left =
        obstacle.x + "px";

      if (
        !obstacle.hit &&
        playerCollides(
          obstacle.el
            .querySelector(
              ".obstacleHitbox"
            )
        )
      ) {

        handleObstacleHit(
          obstacle
        );

        return;
      }

      if (
        !obstacle.counted &&
        obstacle.x < playerX - 70
      ) {

        obstacle.counted = true;

        missionData.obstacles++;

        saveMissionData();

        checkMissions();
      }
    }
  );

  obstacles =
    obstacles.filter(
      obstacle => {

        if (
          obstacle.x < -100 ||
          obstacle.hit
        ) {

          obstacle.el.remove();

          return false;
        }

        return true;
      }
    );
}


/* =========================================================
   UPDATE COINS
========================================================= */

function updateCoins() {

  coins.forEach(
    coin => {

      // Normal movement
      coin.x -= gameSpeed;

      if (magnetActive) {

        const playerCenterX =
          playerX + 31;

        const playerCenterY =
          120 + playerY + 35;

        const coinCenterX =
          coin.x + 17;

        const coinCenterY =
          coin.y + 17;

        const dx =
          playerCenterX - coinCenterX;

        const dy =
          playerCenterY - coinCenterY;

        const distance =
          Math.hypot(dx, dy);

        const magnetRange =
          Math.min(
            430,
            Math.max(
              260,
              game.clientWidth * 0.48
            )
          );

        if (
          distance < magnetRange &&
          distance > 1
        ) {

          const pullStrength =
            Math.min(
              24,
              Math.max(
                8,
                (magnetRange - distance) * 0.09
              )
            );

          // Coin player ki taraf horizontal + vertical dono move karega
          coin.x +=
            (dx / distance) *
            pullStrength;

          coin.y +=
            (dy / distance) *
            pullStrength;
        }
      }

      coin.el.style.left =
        coin.x + "px";

      coin.el.style.bottom =
        coin.y + "px";

      if (
        playerCollides(
          coin.el
        )
      ) {

        runCoins++;

        gameCoins++;

        missionData.coins++;

        saveCoins();
        saveMissionData();

        playSound("coin");

        coin.el.remove();

        coin.collected = true;

        checkMissions();
      }
    }
  );

  coins =
    coins.filter(
      coin => {

        if (
          coin.collected ||
          coin.x < -60
        ) {

          coin.el.remove();

          return false;
        }

        return true;
      }
    );
}

/* =========================================================
   UPDATE POWERUPS
========================================================= */

function updatePowerups() {

  magnets.forEach(
    item => {

      item.x -=
        gameSpeed;

      item.el.style.left =
        item.x + "px";

      if (
        playerCollides(
          item.el
        )
      ) {

        magnetActive = true;

        magnetDuration =
          MAGNET_DURATION;

        playSound("power");

        item.el.remove();

        item.collected = true;
      }
    }
  );


  shields.forEach(
    item => {

      item.x -=
        gameSpeed;

      item.el.style.left =
        item.x + "px";

      if (
        playerCollides(
          item.el
        )
      ) {

        shieldActive = true;

        playSound("power");

        item.el.remove();

        item.collected = true;
      }
    }
  );


  extraLives.forEach(
    item => {

      item.x -=
        gameSpeed;

      item.el.style.left =
        item.x + "px";

      if (
        playerCollides(
          item.el
        )
      ) {

        if (
          lives < MAX_LIVES
        ) {

          lives++;

          updateLives();

          playSound("power");
        }

        item.el.remove();

        item.collected = true;
      }
    }
  );


  speedBoosts.forEach(
    item => {

      item.x -=
        gameSpeed;

      item.el.style.left =
        item.x + "px";

      if (
        playerCollides(
          item.el
        )
      ) {

        speedBoostActive =
          true;

        speedBoostDuration =
          SPEED_DURATION;

        missionData.speedUses++;

        saveMissionData();

        playSound("power");

        item.el.remove();

        item.collected = true;

        checkMissions();
      }
    }
  );


  magnets =
    magnets.filter(
      item => {

        if (
          item.collected ||
          item.x < -80
        ) {

          item.el.remove();

          return false;
        }

        return true;
      }
    );


  shields =
    shields.filter(
      item => {

        if (
          item.collected ||
          item.x < -80
        ) {

          item.el.remove();

          return false;
        }

        return true;
      }
    );


  extraLives =
    extraLives.filter(
      item => {

        if (
          item.collected ||
          item.x < -80
        ) {

          item.el.remove();

          return false;
        }

        return true;
      }
    );


  speedBoosts =
    speedBoosts.filter(
      item => {

        if (
          item.collected ||
          item.x < -80
        ) {

          item.el.remove();

          return false;
        }

        return true;
      }
    );
}


/* =========================================================
   POWER TIMERS
========================================================= */

function updatePowerTimers() {

  if (magnetActive) {

    magnetDuration--;

    if (
      magnetDuration <= 0
    ) {

      magnetActive = false;
    }
  }


  if (speedBoostActive) {

    speedBoostDuration--;

    if (
      speedBoostDuration <= 0
    ) {

      speedBoostActive = false;
    }
  }


  let text = "";

  if (shieldActive) {
    text += "🛡️ SHIELD ";
  }

  if (magnetActive) {

    text +=
      `🧲 ${Math.ceil(
        magnetDuration / 60
      )}s `;
  }

  if (speedBoostActive) {

    text +=
      `⚡ ${Math.ceil(
        speedBoostDuration / 60
      )}s`;
  }

  powerHud.textContent =
    text;
}


/* =========================================================
   LIVES UI
========================================================= */

function updateLives() {

  livesEl.textContent =
    "❤️".repeat(lives) +
    "🖤".repeat(
      MAX_LIVES - lives
    );
}


/* =========================================================
   SCORE
========================================================= */

function updateScore() {

  scoreEl.textContent =
    score;

  updateProgress();
}


/* =========================================================
   CLEAN OBJECTS
========================================================= */

function clearObjects() {

  objects.innerHTML = "";

  obstacles = [];
  coins = [];

  magnets = [];
  shields = [];

  extraLives = [];
  speedBoosts = [];
}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

  score = 0;
  runCoins = 0;

  lives = 3;

  level = 1;

  currentWorld =
    "forest";

  playerX = 150;
  playerY = 0;

  velocityY = 0;
  jumping = false;

  magnetActive = false;
  magnetDuration = 0;

  shieldActive = false;

  speedBoostActive = false;
  speedBoostDuration = 0;

  gameSpeed = 5.5;

  obstacleTimer = 0;
  coinTimer = 0;

  magnetTimer = 0;
  shieldTimer = 0;

  extraLifeTimer = 0;
  speedBoostTimer = 0;

  scoreTimer = 0;

  moveLeft = false;
  moveRight = false;

  clearObjects();

  scoreEl.textContent = "0";
  runCoinsEl.textContent = "0";
  levelEl.textContent = "1";
  worldEl.textContent = "FOREST";

  updateLives();

  updateWorld();

  updatePowerTimers();

  player.style.left =
    playerX + "px";

  player.style.bottom =
    "120px";

  applyEquippedCharacter();
  applyEquippedEffect();
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

  initAudio();

  resetGame();

  running = true;
  paused = false;

  startMenu.style.display =
    "none";

  shopPanel.classList.add(
    "hidden"
  );

  missionsPanel.classList.add(
    "hidden"
  );

  gameOver.classList.add(
    "hidden"
  );

  document.getElementById(
    "hud"
  ).style.display = "flex";

  livesEl.style.display =
    "block";

  powerHud.style.display =
    "block";

  requestAnimationFrame(
    gameLoop
  );
}


/* =========================================================
   END GAME
========================================================= */

function endGame() {

  running = false;

  paused = false;

  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      HIGH_SCORE_KEY,
      String(highScore)
    );
  }

  bestScoreEl.textContent =
    highScore;

  finalScoreEl.textContent =
    score;

  finalCoinsEl.textContent =
    runCoins;

  finalBestEl.textContent =
    highScore;

  gameOver.classList.remove(
    "hidden"
  );
}


/* =========================================================
   MENU
========================================================= */

function openMenu() {

  running = false;
  paused = false;

  gameOver.classList.add(
    "hidden"
  );

  shopPanel.classList.add(
    "hidden"
  );

  missionsPanel.classList.add(
    "hidden"
  );

  startMenu.style.display =
    "flex";

  document.getElementById(
    "hud"
  ).style.display = "none";

  livesEl.style.display =
    "none";

  powerHud.style.display =
    "none";

  clearObjects();

  bestScoreEl.textContent =
    highScore;

  updateCoinUI();

  applyEquippedCharacter();
  applyEquippedEffect();
}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

  if (!running) return;

  paused = !paused;

  pauseBtn.textContent =
    paused
      ? "▶"
      : "Ⅱ";
}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop() {

  if (!running) return;

  if (!paused) {

    updatePlayer();

    obstacleTimer++;
    coinTimer++;

    magnetTimer++;
    shieldTimer++;

    extraLifeTimer++;
    speedBoostTimer++;

    scoreTimer++;


    /* SCORE */

    if (
      scoreTimer >= 20
    ) {

      score++;

      scoreTimer = 0;

      updateScore();
    }


    /* OBSTACLES */

    let obstacleInterval =
      260;

    if (
      currentWorld === "city"
    ) {
      obstacleInterval = 245;
    }

    if (
      currentWorld === "night"
    ) {
      obstacleInterval = 225;
    }

    if (
      currentWorld === "haunted"
    ) {
      obstacleInterval = 215;
    }

    if (
      obstacleTimer >=
      obstacleInterval
    ) {

      spawnObstacle();

      obstacleTimer = 0;
    }


    /* COINS */

    if (
      coinTimer >= 105
    ) {

      spawnCoin();

      coinTimer = 0;
    }


    /* MAGNET */

    if (
      magnetTimer >= 650
    ) {

      spawnMagnet();

      magnetTimer = 0;
    }


    /* SHIELD */

    if (
      shieldTimer >= 900
    ) {

      spawnShield();

      shieldTimer = 0;
    }


    /* EXTRA LIFE */

    if (
      extraLifeTimer >= 1100
    ) {

      spawnExtraLife();

      extraLifeTimer = 0;
    }


    /* SPEED BOOST */

    if (
      speedBoostTimer >= 1250
    ) {

      spawnSpeedBoost();

      speedBoostTimer = 0;
    }


    updateObstacles();

    updateCoins();

    updatePowerups();

    updatePowerTimers();
  }

  requestAnimationFrame(
    gameLoop
  );
}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {

      moveLeft = true;
    }


    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {

      moveRight = true;
    }


    if (
      event.key === "ArrowUp" ||
      event.key === " " ||
      event.key.toLowerCase() === "w"
    ) {

      event.preventDefault();

      jump();
    }


    if (
      event.key.toLowerCase() === "p"
    ) {

      togglePause();
    }
  }
);


document.addEventListener(
  "keyup",
  event => {

    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {

      moveLeft = false;
    }


    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {

      moveRight = false;
    }
  }
);


/* =========================================================
   MOBILE CONTROLS
========================================================= */

function holdButton(
  button,
  onStart,
  onEnd
) {

  button.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      onStart();
    },
    {
      passive: false
    }
  );

  button.addEventListener(
    "touchend",
    event => {

      event.preventDefault();

      onEnd();
    },
    {
      passive: false
    }
  );

  button.addEventListener(
    "mousedown",
    event => {

      event.preventDefault();

      onStart();
    }
  );

  button.addEventListener(
    "mouseup",
    event => {

      event.preventDefault();

      onEnd();
    }
  );

  button.addEventListener(
    "mouseleave",
    onEnd
  );
}


holdButton(
  mobileLeft,
  () => {
    moveLeft = true;
  },
  () => {
    moveLeft = false;
  }
);


holdButton(
  mobileRight,
  () => {
    moveRight = true;
  },
  () => {
    moveRight = false;
  }
);


mobileJump.addEventListener(
  "touchstart",
  event => {

    event.preventDefault();

    jump();
  },
  {
    passive: false
  }
);


mobileJump.addEventListener(
  "mousedown",
  event => {

    event.preventDefault();

    jump();
  }
);


/* =========================================================
   BUTTONS
========================================================= */

playBtn.addEventListener(
  "click",
  startGame
);


pauseBtn.addEventListener(
  "click",
  togglePause
);


restartBtn.addEventListener(
  "click",
  startGame
);


menuBtn.addEventListener(
  "click",
  openMenu
);


/* =========================================================
   SHOP OPEN/CLOSE
========================================================= */

shopBtn.addEventListener(
  "click",
  () => {

    renderShop();

    startMenu.style.display =
      "none";

    shopPanel.classList.remove(
      "hidden"
    );
  }
);


closeShopBtn.addEventListener(
  "click",
  () => {

    shopPanel.classList.add(
      "hidden"
    );

    startMenu.style.display =
      "flex";

    updateCoinUI();
  }
);


/* =========================================================
   MISSIONS OPEN/CLOSE
========================================================= */

missionsBtn.addEventListener(
  "click",
  () => {

    renderMissions();

    startMenu.style.display =
      "none";

    missionsPanel.classList.remove(
      "hidden"
    );
  }
);


closeMissionsBtn.addEventListener(
  "click",
  () => {

    missionsPanel.classList.add(
      "hidden"
    );

    startMenu.style.display =
      "flex";
  }
);


/* =========================================================
   SOUND
========================================================= */

soundBtn.addEventListener(
  "click",
  () => {

    soundEnabled =
      !soundEnabled;

    soundBtn.textContent =
      soundEnabled
        ? "🔊 SOUND ON"
        : "🔇 SOUND OFF";

    if (soundEnabled) {
      initAudio();
    }
  }
);


/* =========================================================
   INITIALIZATION
========================================================= */

updateCoinUI();

updateLives();

renderMissions();

renderShop();

applyEquippedCharacter();

applyEquippedEffect();

updateWorld();

console.log(
  "Don't Stop Moving loaded successfully."
);