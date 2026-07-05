const TURN_SECONDS = 60;
const PLAYER_LIMITS = { min: 2, max: 4 };
const WARNING_SECONDS = 10;

const voiceLanguageOptions = {
  mandarin: {
    lang: "zh-CN",
    next: (name) => `到下一个玩家，${name}`,
    timeout: (name) => `超时，罚牌2张，到下一个玩家，${name}`,
  },
  cantonese: {
    lang: "zh-HK",
    next: (name) => `到下一個玩家，${name}`,
    timeout: (name) => `超時，罰牌2張，到下一個玩家，${name}`,
  },
  english: {
    lang: "en-US",
    next: (name) => `Next player, ${name}`,
    timeout: (name) => `Time out. Draw two tiles. Next player, ${name}`,
  },
};

const uiText = {
  mandarin: {
    documentLang: "zh-CN",
    pageTitle: "拉密计时器",
    heading: "拉密计时器",
    setupCopy: "选择 2-4 位玩家，按顺序每人 1 分钟。",
    playerCounts: ["2 人", "3 人", "4 人"],
    playerCountAria: "选择玩家人数",
    voiceLanguage: "语音语言",
    voiceLanguageAria: "选择语音语言",
    playerTitle: (index) => `玩家 ${index + 1}`,
    playerNameAria: (index) => `玩家 ${index + 1} 名字`,
    playerImageAria: (index) => `玩家 ${index + 1} 图片`,
    startButton: "开始游戏",
    gameControlsAria: "游戏控制",
    pause: "暂停",
    resume: "继续",
    restart: "重新开始",
    changePlayers: "换玩家",
    turnLabel: "当前玩家",
    statusStart: "请开始出牌",
    statusNext: "轮到下一位",
    statusTimeout: "上一位超时，自动切换",
    statusPaused: "已暂停",
    statusResume: "继续计时",
    statusRestart: "重新开始",
    finishTurn: "出牌结束",
    playerOrderAria: "玩家顺序",
    restartToast: "已从玩家 1 重新开始",
    timeoutToast: (timedOut, next) => `${timedOut} 超时，轮到 ${next}`,
    avatarAlt: (name) => `${name} 的图片`,
    fallbackPlayer: (index) => `玩家 ${index + 1}`,
  },
  cantonese: {
    documentLang: "zh-HK",
    pageTitle: "拉密計時器",
    heading: "拉密計時器",
    setupCopy: "選擇 2-4 位玩家，按順序每人 1 分鐘。",
    playerCounts: ["2 人", "3 人", "4 人"],
    playerCountAria: "選擇玩家人數",
    voiceLanguage: "語音語言",
    voiceLanguageAria: "選擇語音語言",
    playerTitle: (index) => `玩家 ${index + 1}`,
    playerNameAria: (index) => `玩家 ${index + 1} 名字`,
    playerImageAria: (index) => `玩家 ${index + 1} 圖片`,
    startButton: "開始遊戲",
    gameControlsAria: "遊戲控制",
    pause: "暫停",
    resume: "繼續",
    restart: "重新開始",
    changePlayers: "換玩家",
    turnLabel: "目前玩家",
    statusStart: "請開始出牌",
    statusNext: "到下一位",
    statusTimeout: "上一位超時，自動切換",
    statusPaused: "已暫停",
    statusResume: "繼續計時",
    statusRestart: "重新開始",
    finishTurn: "出牌結束",
    playerOrderAria: "玩家順序",
    restartToast: "已由玩家 1 重新開始",
    timeoutToast: (timedOut, next) => `${timedOut} 超時，到 ${next}`,
    avatarAlt: (name) => `${name} 的圖片`,
    fallbackPlayer: (index) => `玩家 ${index + 1}`,
  },
  english: {
    documentLang: "en",
    pageTitle: "Rummikub Timer",
    heading: "Rummikub Timer",
    setupCopy: "Choose 2-4 players. Each turn is 1 minute.",
    playerCounts: ["2 Players", "3 Players", "4 Players"],
    playerCountAria: "Choose player count",
    voiceLanguage: "Voice Language",
    voiceLanguageAria: "Choose voice language",
    playerTitle: (index) => `Player ${index + 1}`,
    playerNameAria: (index) => `Player ${index + 1} name`,
    playerImageAria: (index) => `Player ${index + 1} avatar`,
    startButton: "Start Game",
    gameControlsAria: "Game controls",
    pause: "Pause",
    resume: "Resume",
    restart: "Restart",
    changePlayers: "Players",
    turnLabel: "Current Player",
    statusStart: "Start your turn",
    statusNext: "Next player",
    statusTimeout: "Timed out, switching",
    statusPaused: "Paused",
    statusResume: "Timer resumed",
    statusRestart: "Restarted",
    finishTurn: "End Turn",
    playerOrderAria: "Player order",
    restartToast: "Restarted from player 1",
    timeoutToast: (timedOut, next) => `${timedOut} timed out. Next: ${next}`,
    avatarAlt: (name) => `${name}'s avatar`,
    fallbackPlayer: (index) => `Player ${index + 1}`,
  },
};

const avatarSeeds = [
  {
    id: "dad",
    labels: { mandarin: "爸爸", cantonese: "爸爸", english: "Dad" },
    faces: { mandarin: "爸", cantonese: "爸", english: "D" },
    fill: "#457b9d",
    accent: "#f4a261",
  },
  {
    id: "mom",
    labels: { mandarin: "妈妈", cantonese: "媽媽", english: "Mom" },
    faces: { mandarin: "妈", cantonese: "媽", english: "M" },
    fill: "#e76f51",
    accent: "#2a9d8f",
  },
  {
    id: "brother",
    labels: { mandarin: "哥哥", cantonese: "哥哥", english: "Brother" },
    faces: { mandarin: "哥", cantonese: "哥", english: "B" },
    fill: "#2a9d8f",
    accent: "#f4a261",
  },
  {
    id: "sister",
    labels: { mandarin: "妹妹", cantonese: "妹妹", english: "Sister" },
    faces: { mandarin: "妹", cantonese: "妹", english: "S" },
    fill: "#f4a261",
    accent: "#457b9d",
  },
  {
    id: "grandpa",
    labels: { mandarin: "爷爷", cantonese: "爺爺", english: "Grandpa" },
    faces: { mandarin: "爷", cantonese: "爺", english: "GP" },
    fill: "#6d597a",
    accent: "#eaac8b",
  },
  {
    id: "grandma",
    labels: { mandarin: "奶奶", cantonese: "嫲嫲", english: "Grandma" },
    faces: { mandarin: "奶", cantonese: "嫲", english: "GM" },
    fill: "#b56576",
    accent: "#84a59d",
  },
  {
    id: "kid",
    labels: { mandarin: "小宝", cantonese: "小寶", english: "Kid" },
    faces: { mandarin: "宝", cantonese: "寶", english: "K" },
    fill: "#4d908e",
    accent: "#f9c74f",
  },
  {
    id: "guest",
    labels: { mandarin: "朋友", cantonese: "朋友", english: "Friend" },
    faces: { mandarin: "友", cantonese: "友", english: "F" },
    fill: "#577590",
    accent: "#f3722c",
  },
];

const setupScreen = document.querySelector("#setup-screen");
const gameScreen = document.querySelector("#game-screen");
const playersForm = document.querySelector("#players-form");
const countButtons = document.querySelectorAll(".count-button");
const languageButtons = document.querySelectorAll(".language-button");
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
let audioContext = null;
let lastWarningSecond = null;
let selectedVoiceLanguage = "mandarin";
let selectedVoice = null;
let avatars = buildLocalizedAvatars();

function getText() {
  return uiText[selectedVoiceLanguage] || uiText.mandarin;
}

function getDefaultNames() {
  return avatarSeeds.slice(0, PLAYER_LIMITS.max).map((avatar) => avatar.labels[selectedVoiceLanguage]);
}

function buildLocalizedAvatars() {
  return avatarSeeds.map((avatar) => {
    const localized = {
      ...avatar,
      label: avatar.labels[selectedVoiceLanguage],
      face: avatar.faces[selectedVoiceLanguage],
    };

    return {
      ...localized,
      src: makeAvatarSvg(localized),
    };
  });
}

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
  const text = getText();
  avatars = buildLocalizedAvatars();
  renderStaticText();

  countButtons.forEach((button) => {
    const isActive = Number(button.dataset.count) === selectedCount;
    const labelIndex = Number(button.dataset.count) - PLAYER_LIMITS.min;
    button.classList.toggle("is-active", isActive);
    button.textContent = text.playerCounts[labelIndex];
  });

  playersForm.innerHTML = "";
  for (let index = 0; index < selectedCount; index += 1) {
    const card = document.createElement("section");
    card.className = "player-card";
    card.innerHTML = `
      <div class="player-card-header">
        <div class="player-card-title">${text.playerTitle(index)}</div>
        <input class="name-input" name="player-name-${index}" maxlength="12" value="${getDefaultNames()[index]}" aria-label="${text.playerNameAria(index)}" />
      </div>
      <div class="avatar-grid" role="radiogroup" aria-label="${text.playerImageAria(index)}"></div>
    `;

    const avatarGrid = card.querySelector(".avatar-grid");
    avatars.forEach((avatar, avatarIndex) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "avatar-option";
      option.dataset.playerIndex = String(index);
      option.dataset.avatarId = avatar.id;
      option.dataset.avatarLabel = avatar.label;
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
  const text = getText();
  return Array.from(playersForm.querySelectorAll(".player-card")).map((card, index) => {
    const input = card.querySelector(".name-input");
    const selected = card.querySelector(".avatar-option.is-selected");
    const avatar = avatars.find((item) => item.id === selected.dataset.avatarId) || avatars[index];

    return {
      id: crypto.randomUUID(),
      name: input.value.trim() || getDefaultNames()[index] || text.fallbackPlayer(index),
      avatar,
    };
  });
}

function renderStaticText() {
  const text = getText();

  document.documentElement.lang = text.documentLang;
  document.title = text.pageTitle;
  document.querySelector("#setup-title").textContent = text.heading;
  document.querySelector(".setup-copy").textContent = text.setupCopy;
  document.querySelector(".player-count").setAttribute("aria-label", text.playerCountAria);
  document.querySelector(".voice-language").setAttribute("aria-label", text.voiceLanguageAria);
  document.querySelector(".voice-language-label").textContent = text.voiceLanguage;
  startButton.textContent = text.startButton;
  document.querySelector(".top-actions").setAttribute("aria-label", text.gameControlsAria);
  pauseButton.textContent = isPaused ? text.resume : text.pause;
  restartButton.textContent = text.restart;
  changeButton.textContent = text.changePlayers;
  document.querySelector(".turn-label").textContent = text.turnLabel;
  finishTurnButton.textContent = text.finishTurn;
  playerStrip.setAttribute("aria-label", text.playerOrderAria);
}

function startGame() {
  unlockAudio();
  players = collectPlayers();
  currentIndex = 0;
  setupScreen.classList.add("is-hidden");
  gameScreen.classList.remove("is-hidden");
  scrollToTop();
  playerStrip.style.setProperty("--player-count", String(players.length));
  renderPlayerStrip();
  startTurn(0, getText().statusStart);
}

function startTurn(index, message) {
  stopTimer();
  currentIndex = index;
  remainingMs = TURN_SECONDS * 1000;
  // 先写入本轮结束时间，再渲染界面，避免刷新时误判为超时。
  turnEndsAt = Date.now() + remainingMs;
  lastWarningSecond = null;
  isPaused = false;
  pauseButton.textContent = getText().pause;
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

  if (!isPaused && seconds > 0 && seconds <= WARNING_SECONDS && seconds !== lastWarningSecond) {
    lastWarningSecond = seconds;
    playWarningBeep(seconds);
  }

  if (remainingMs <= 0 && !isPaused) {
    handleTimeout();
  }
}

function updateTurnView() {
  const player = players[currentIndex];
  currentAvatar.src = player.avatar.src;
  currentAvatar.alt = getText().avatarAlt(player.name);
  currentName.textContent = player.name;
  renderPlayerStrip();
  updateTimerDisplay();
}

function finishTurn() {
  const nextIndex = getNextIndex();
  const nextPlayer = players[nextIndex];
  speakNextPlayer(nextPlayer.name);
  startTurn(nextIndex, getText().statusNext);
}

function handleTimeout() {
  stopTimer();
  const timedOutPlayer = players[currentIndex];
  const nextIndex = getNextIndex();
  const nextPlayer = players[nextIndex];
  vibrate();
  playTimeoutTone();
  speakTimeout(nextPlayer.name);
  showToast(getText().timeoutToast(timedOutPlayer.name, nextPlayer.name));
  startTurn(nextIndex, getText().statusTimeout);
}

function getNextIndex() {
  return (currentIndex + 1) % players.length;
}

function togglePause() {
  if (!players.length) return;

  if (isPaused) {
    // 继续时用暂停保存的剩余时间重建结束点，避免按旧结束时间跳秒。
    turnEndsAt = Date.now() + remainingMs;
    isPaused = false;
    pauseButton.textContent = getText().pause;
    finishTurnButton.disabled = false;
    statusText.textContent = getText().statusResume;
    startTimer();
    return;
  }

  remainingMs = Math.max(0, turnEndsAt - Date.now());
  isPaused = true;
  pauseButton.textContent = getText().resume;
  finishTurnButton.disabled = true;
  statusText.textContent = getText().statusPaused;
  stopTimer();
  updateTimerDisplay();
}

function restartGame() {
  if (!players.length) return;
  unlockAudio();
  showToast(getText().restartToast);
  startTurn(0, getText().statusRestart);
}

function changePlayers() {
  stopTimer();
  players = [];
  currentIndex = 0;
  setupScreen.classList.remove("is-hidden");
  gameScreen.classList.add("is-hidden");
  scrollToTop();
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

function unlockAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }
}

function playWarningBeep(seconds) {
  playTone({
    frequency: seconds <= 3 ? 1046 : 880,
    duration: 0.12,
    volume: seconds <= 3 ? 0.16 : 0.1,
  });
}

function playTimeoutTone() {
  playTone({ frequency: 220, duration: 0.42, volume: 0.18 });
}

function playTone({ frequency, duration, volume }) {
  unlockAudio();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function speakNextPlayer(nextPlayerName) {
  const option = voiceLanguageOptions[selectedVoiceLanguage] || voiceLanguageOptions.mandarin;
  speak(option.next(nextPlayerName));
}

function speakTimeout(nextPlayerName) {
  const option = voiceLanguageOptions[selectedVoiceLanguage] || voiceLanguageOptions.mandarin;
  speak(option.timeout(nextPlayerName));
}

function speak(message) {
  if (!("speechSynthesis" in window)) return;

  updateSelectedVoice();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  const option = voiceLanguageOptions[selectedVoiceLanguage] || voiceLanguageOptions.mandarin;
  utterance.lang = option.lang;
  if (selectedVoice && !isBlockedVoiceForLanguage(selectedVoice, selectedVoiceLanguage)) {
    utterance.voice = selectedVoice;
  }
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function updateSelectedVoice() {
  if (!("speechSynthesis" in window)) return;

  selectedVoice = null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;

  selectedVoice = findVoiceForLanguage(voices, selectedVoiceLanguage);
}

function isBlockedVoiceForLanguage(voice, language) {
  return language === "mandarin" && isCantoneseVoice(voice);
}

function isCantoneseVoice(voice) {
  return (
    voice.lang.toLowerCase() === "zh-hk" ||
    voice.lang.toLowerCase().includes("hk") ||
    /cantonese|yue|粵語|粤语|hong kong|香港/i.test(voice.name)
  );
}

function findVoiceForLanguage(voices, language) {
  if (language === "cantonese") {
    return (
      voices.find((voice) => voice.lang.toLowerCase() === "zh-hk") ||
      voices.find((voice) => /cantonese|yue|粵語|粤语|hong kong|香港/i.test(voice.name)) ||
      voices.find((voice) => voice.lang.toLowerCase().includes("hk"))
    );
  }

  if (language === "english") {
    return (
      voices.find((voice) => voice.lang.toLowerCase() === "en-us") ||
      voices.find((voice) => voice.lang.toLowerCase() === "en-gb") ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
    );
  }

  return (
    voices.find((voice) => voice.lang.toLowerCase() === "zh-cn" && !isCantoneseVoice(voice)) ||
    voices.find((voice) => voice.lang.toLowerCase() === "zh-hans" && !isCantoneseVoice(voice)) ||
    voices.find((voice) => /mandarin|putonghua|普通话|ting-ting/i.test(voice.name) && !isCantoneseVoice(voice))
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedVoiceLanguage = button.dataset.language || "mandarin";
    languageButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    updateSelectedVoice();
    renderSetup();
  });
});

playersForm.addEventListener("click", (event) => {
  const option = event.target.closest(".avatar-option");
  if (!option) return;

  syncAvatarSelection(option);
});

function syncAvatarSelection(option) {
  const card = option.closest(".player-card");
  const selectedAvatar = avatars.find((avatar) => avatar.id === option.dataset.avatarId);
  card.querySelectorAll(".avatar-option").forEach((button) => {
    const isSelected = button === option;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });

  // 点击头像时同步默认名字，方便手机上快速换玩家。
  card.querySelector(".name-input").value =
    option.dataset.avatarLabel || selectedAvatar?.label || "";
}

startButton.addEventListener("click", startGame);
finishTurnButton.addEventListener("click", finishTurn);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartGame);
changeButton.addEventListener("click", changePlayers);

document.addEventListener("visibilitychange", () => {
  if (document.hidden || isPaused || !timerId) return;
  updateTimerDisplay();
});

if ("speechSynthesis" in window) {
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", updateSelectedVoice);
  } else {
    window.speechSynthesis.onvoiceschanged = updateSelectedVoice;
  }
  updateSelectedVoice();
}

renderSetup();
