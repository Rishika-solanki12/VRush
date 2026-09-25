# 🎮 VRush

**VRush** is a 2D endless runner game developed using HTML, CSS, and Vanilla JavaScript and packaged as an Android application using Capacitor.

The player must keep moving, avoid obstacles and monsters, collect coins and power-ups, complete missions, and survive through different worlds.

## 📱 Download VRush for Android

### [⬇️ Download VRush v1.0.0 APK](https://github.com/Rishika-solanki12/VRush/releases/download/v1.0.0/app-release.apk)

> Android may ask for permission to install apps from your browser because VRush is currently distributed directly as an APK.

---

## ✨ Features

- 🏃 Endless runner gameplay
- 🪙 Coin collection system
- 🧲 Magnet Power-Up
- 🛡️ Shield Power-Up
- ❤️ Extra Life
- ⚡ Speed Boost
- 🎯 Mission system
- 🔥 Combo system
- 👾 Monsters and obstacles
- 👹 Boss encounters
- 🛍️ Character and effects shop
- 💾 Saved game progress
- 📱 Mobile controls
- 🖥️ Desktop keyboard controls
- 🔊 Game sound effects
- 🏆 High-score system

---

## 🌍 Game Worlds

VRush includes multiple environments that appear as the player progresses:

- 🌲 Forest
- 🏙️ City
- 🌃 Night City
- 👻 Haunted Area

---

## ⚡ Power-Ups

### 🧲 Magnet
Attracts nearby coins toward the player automatically.

### 🛡️ Shield
Protects the player from one enemy or obstacle hit.

### ❤️ Extra Life
Provides an additional life during gameplay.

### ⚡ Speed Boost
Temporarily increases the player's movement speed.

---

## 🎯 Missions

Players can complete different missions while playing, including:

- Collect coins
- Pass obstacles
- Use shields
- Use speed boosts
- Reach the Haunted Area

Completing missions rewards the player with additional game coins.

---

## 🛍️ Shop System

Players can use collected coins to unlock characters and visual effects.

### Characters

- Classic Boy
- Classic Girl
- Ninja
- Robot
- Vampire

### Effects

- No Effect
- Fire Trail
- Lightning Trail
- Rainbow Trail

---

## 🎮 Controls

### Desktop

Use the keyboard controls to move and jump.

### Mobile

VRush provides on-screen controls optimized for mobile devices and landscape gameplay.

---

## 💾 Game Progress

VRush uses browser `localStorage` to preserve important game data such as:

- High score
- Game coins
- Mission progress
- Purchased shop items

This allows progress to remain available after the game is closed.

---

## 🛠️ Technologies Used

- **HTML5** — Game structure and interface
- **CSS3** — Styling, responsive design, and game environments
- **Vanilla JavaScript** — Game logic and gameplay systems
- **Web Audio API** — Sound effects
- **LocalStorage** — Local game progress
- **Capacitor** — Converting the web game into an Android application
- **Android Studio** — Building and signing the Android APK
- **Git & GitHub** — Version control and public distribution

---

## ⚙️ How the Game Works

The main gameplay system is implemented using JavaScript.

The game loop uses `requestAnimationFrame()` to continuously update the player, coins, obstacles, enemies, power-ups, collisions, score, and other gameplay elements.

Player jumping is implemented using gravity, velocity, and jump-power calculations. Collision detection determines interactions between the player and coins, obstacles, enemies, and power-ups.

The game was initially developed as a web-based game and later packaged as an Android application using Capacitor.

---

## 📂 Project Structure

```text
VRush/
│
├── index.html
├── style.css
├── game.js
├── capacitor.config.json
├── package.json
│
├── www/
│   ├── index.html
│   ├── style.css
│   └── game.js
│
└── android/
    └── Android application project
```

---

## 🚀 Android Application

The web version of VRush was converted into an Android application using Capacitor.

The Android project is built using Android Studio, and the public release APK is digitally signed for distribution.

### Current Release

**VRush v1.0.0**

### [📥 Download Android APK](https://github.com/Rishika-solanki12/VRush/releases/download/v1.0.0/app-release.apk)

---

## 👩‍💻 Developer

**Rishika Solanki**

GitHub: [Rishika-solanki12](https://github.com/Rishika-solanki12)

---

## 📌 Project Purpose

VRush was developed as a practical game-development project to apply concepts such as JavaScript game loops, collision detection, player physics, responsive controls, persistent game data, Android packaging, Git version control, and application distribution.
