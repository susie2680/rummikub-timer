const TURN_SECONDS = 60;
const PLAYER_LIMITS = { min: 2, max: 4 };

const avatarSeeds = [
  { id: "dad", label: "爸爸", face: "爸", fill: "#457b9d", accent: "#f4a261" },
  { id: "mom", label: "妈妈", face: "妈", fill: "#e76f51", accent: "#2a9d8f" },
  { id: "brother", label: "哥哥", face: "哥", fill: "#2a9d8f", accent: "#f4a261" },
  { id: "sister", label: "妹妹", face: "妹", fill: "#f4a261", accent: "#457b9d" },
  { id: "grandpa", label: "爷爷", face: "爷", fill: "#6d597a", accent: "#eaac8b" },
  { id: "grandma", label: "奶奶", face: "奶", fill: "#b56576", accent: "#84a59d" },
  { id: "kid", label: "小宝", face: "宝", fill: "#4d908e", accent: "#f9c74f" },
  { id: "guest", label: "朋友", face: "友", fill: "#577590", accent: "#f3722c" },
];

const defaultNames = ["爸爸", "妈妈", "哥哥", "妹妹"];

const setupScreen = document.querySelector("#setup-screen");
const gameScreen = document.querySelector("#game-screen");
const playersForm = document.querySelector("#players-form");
const countButtons = document.querySelectorAll(".count-button");
const startButton = document.querySelector("#start-button");
const currentAvatar = document.querySelector("#current-avatar");
const currentName = document.querySelector("#current-name");
const timerDisplay = document.querySelector("#timer-display");
const statusText = document.querySelector("#status-text");
const finishTurnButton = document.querySelector("#finish-turn-button");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const changeButton = document.querySelector("#change-button");
const playerStrip = document.querySelector("#player-strip");
const toast = document.querySelector("#toast");

let selectedCount = 2;
let players = [];
let currentIndex = 0;
let timerId = 0;
let turnEndsAt = 0;
let remainingMs = TURN_SECONDS * 1000;
let isPaused = false;
let toastId = 0;

const avatars = avatarSeeds.map((avatar) => ({
  ...avatar,
  src: makeAvatarSvg(avatar),
}));

function makeAvatarSvg({ label, face, fill, accent }) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${label}">
      <rect width="128" height="128" rx="30" fill="${fill}"/>
      <circle cx="64" cy="54" r="30" fill="#fff5e6"/>
      <path d="M28 117c6-26 25-39 36-39s30 13 36 39" fill="${accent}"/>
      <circle cx="52" cy="52" r="4" fill="#14213d"/>
      <circle cx="76" cy="52" r="4" fill="#14213d"/>
      <path d="M52 66c7 7 17 7 24 0" fill="none" stroke="#14213d" stroke-width="5" stroke-linecap="round"/>
      <text x="64" y="111" text-anchor="middle" font-size="26" font-weight="800" font-family="Arial, sans-serif" fill="#ffffff">${face}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderSetup() {
  countButtons.forEach((button) => {
    const isActive = Number(button.dataset.count) === selectedCount;
    button.classList.toggle("is-active", isActive);
  });

  playersForm.innerHTML = "";
  for (let index = 0; index < selectedCount; index += 1) {
    const card = document.createElement("section");
    card.className = "player-card";
    card.innerHTML = `
      <div class="player-card-header">
        <div class="player-card-title">玩家 ${index + 1}</div>
        <input class="name-input" name="player-name-${index}" maxlength="8" value="${defaultNames[index]}" aria-label="玩家 ${index + 1} 名字" />
      </div>
      <div class="avatar-grid" role="radiogroup" aria-label="玩家 ${index + 1} 图片"></div>
    `;

    const avatarGrid = card.querySelector(".avatar-grid");
    avatars.forEach((avatar, avatarIndex) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "avatar-option";
      option.dataset.playerIndex = String(index);
      option.dataset.avatarId = avatar.id;
      option.setAttribute("role", "radio");
      option.setAttribute("aria-checked", String(avatarIndex === index));
      option.innerHTML = `<img src="${avatar.src}" alt="" /><span>${avatar.label}</span>`;
      if (avatarIndex === index) {
        option.classList.add("is-selected");
      }
      avatarGrid.append(option);
    });

    playersForm.append(card);
  }
}

function collectPlayers() {
  return Array.from(playersForm.querySelectorAll(".player-card")).map((card, index) => {
    const input = card.querySelector(".name-input");
    const selected = card.querySelector(".avatar-option.is-selected");
    const avatar = avatars.find((item) => item.id === selected.dataset.avatarId) || avatars[index];

    return {
      id: crypto.randomUUID(),
      name: input.value.trim() || defaultNames[index] || `玩家 ${index + 1}`,
      avatar,
    };
  });
}

function startGame() {
  players = collectPlayers();
  currentIndex = 0;
  setupScreen.classList.add("is-hidden");
  gameScreen.classList.remove("is-hidden");
  playerStrip.style.setProperty("--player-count", String(players.length));
  renderPlayerStrip();
  startTurn(0, "请开始出牌");
}

function startTurn(index, message) {
  stopTimer();
  currentIndex = index;
  remainingMs = TURN_SECONDS * 1000;
  // 先写入本轮结束时间，再渲染界面，避免刷新时误判为超时。
  turnEndsAt = Date.now() + remainingMs;
  isPaused = false;
  pauseButton.textContent = "暂停";
  finishTurnButton.disabled = false;
  statusText.textContent = message;
  updateTurnView();
  startTimer();
}

function startTimer() {
  updateTimerDisplay();
  timerId = window.setInterval(updateTimerDisplay, 200);
}

function stopTimer() {
  window.clearInterval(timerId);
  timerId = 0;
}

function updateTimerDisplay() {
  if (!isPaused) {
    remainingMs = Math.max(0, turnEndsAt - Date.now());
  }

  const seconds = Math.ceil(remainingMs / 1000);
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsText = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutesText}:${secondsText}`;
  timerDisplay.classList.toggle("is-danger", seconds <= 10);

  if (remainingMs <= 0 && !isPaused) {
    handleTimeout();
  }
}

function updateTurnView() {
  const player = players[currentIndex];
  currentAvatar.src = player.avatar.src;
  currentAvatar.alt = `${player.name} 的图片`;
  currentName.textContent = player.name;
  renderPlayerStrip();
  updateTimerDisplay();
}

function finishTurn() {
  const nextIndex = getNextIndex();
  startTurn(nextIndex, "轮到下一位");
}

function handleTimeout() {
  stopTimer();
  const timedOutPlayer = players[currentIndex];
  const nextIndex = getNextIndex();
  const nextPlayer = players[nextIndex];
  vibrate();
  showToast(`${timedOutPlayer.name} 超时，轮到 ${nextPlayer.name}`);
  startTurn(nextIndex, "上一位超时，自动切换");
}

function getNextIndex() {
  return (currentIndex + 1) % players.length;
}

function togglePause() {
  if (!players.length) return;

  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "暂停";
    finishTurnButton.disabled = false;
    statusText.textContent = "继续计时";
    startTimer();
    return;
  }

  remainingMs = Math.max(0, turnEndsAt - Date.now());
  isPaused = true;
  pauseButton.textContent = "继续";
  finishTurnButton.disabled = true;
  statusText.textContent = "已暂停";
  stopTimer();
  updateTimerDisplay();
}

function restartGame() {
  if (!players.length) return;
  showToast("已从玩家 1 重新开始");
  startTurn(0, "重新开始");
}

function changePlayers() {
  stopTimer();
  players = [];
  currentIndex = 0;
  setupScreen.classList.remove("is-hidden");
  gameScreen.classList.add("is-hidden");
  renderSetup();
}

function renderPlayerStrip() {
  playerStrip.innerHTML = "";
  players.forEach((player, index) => {
    const item = document.createElement("div");
    item.className = "strip-player";
    item.classList.toggle("is-current", index === currentIndex);
    item.innerHTML = `<img src="${player.avatar.src}" alt="" /><span>${player.name}</span>`;
    playerStrip.append(item);
  });
}

function showToast(message) {
  window.clearTimeout(toastId);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate([180, 80, 180]);
  }
}

countButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCount = Math.min(
      PLAYER_LIMITS.max,
      Math.max(PLAYER_LIMITS.min, Number(button.dataset.count)),
    );
    renderSetup();
  });
});

playersForm.addEventListener("click", (event) => {
  const option = event.target.closest(".avatar-option");
  if (!option) return;

  const card = option.closest(".player-card");
  card.querySelectorAll(".avatar-option").forEach((button) => {
    const isSelected = button === option;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });
});

startButton.addEventListener("click", startGame);
finishTurnButton.addEventListener("click", finishTurn);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartGame);
changeButton.addEventListener("click", changePlayers);

document.addEventListener("visibilitychange", () => {
  if (document.hidden || isPaused || !timerId) return;
  updateTimerDisplay();
});

renderSetup();
