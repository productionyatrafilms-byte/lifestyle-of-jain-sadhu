const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujrati");

const DEFAULT_LANG = "English";
const STORAGE_KEY = "selectedLanguage";
let translations = {};

// audio setup for language button clicks
const langAudioMap = {
  English: "./assets/audio/Eng.mpeg",
  Hindi: "./assets/audio/Hin.mpeg",
  Gujarati: "./assets/audio/Guj.mpeg",
};

let currentLangAudio = null;

function playLangAudio(lang) {
  const src = langAudioMap[lang];
  if (!src) return;

  // stop any audio that might still be playing
  if (currentLangAudio) {
    currentLangAudio.pause();
    currentLangAudio.currentTime = 0;
  }

  currentLangAudio = new Audio(src);
  currentLangAudio.play().catch(function (err) {
    // Autoplay can be blocked by the browser; fail silently
    console.error("Error playing language audio:", err);
  });
}

// set active button
function setActiveButton(activeBtn) {
  [btnEn, btnHi, btnGu].forEach((btn) => btn.classList.remove("active"));
  if (activeBtn) activeBtn.classList.add("active");
}

// apply language
function applyLanguage(lang) {
  const langData = translations[lang];
  if (!langData) return;

  document.documentElement.lang = lang;

  if (lang === "English") {
    document.body.setAttribute("data-lang", "en");
    setActiveButton(btnEn);
  } else if (lang === "Hindi") {
    document.body.setAttribute("data-lang", "hi");
    setActiveButton(btnHi);
  } else if (lang === "Gujarati") {
    document.body.setAttribute("data-lang", "gu");
    setActiveButton(btnGu);
  }

  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    if (langData[key] !== undefined) {
      el.innerHTML = String(langData[key]).replace(/\n/g, "<br>");
    }
  });

  localStorage.setItem(STORAGE_KEY, lang);
}

// detect refresh
function isPageRefresh() {
  const navEntries = performance.getEntriesByType("navigation");
  if (navEntries.length > 0) {
    return navEntries[0].type === "reload";
  }
  return performance.navigation.type === 1;
}

// load language
window.addEventListener("DOMContentLoaded", () => {
  fetch("./assets/json/data.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;

      let langToApply = DEFAULT_LANG;
      const savedLang = localStorage.getItem(STORAGE_KEY);

      if (isPageRefresh()) {
        // on refresh always reset to English
        langToApply = DEFAULT_LANG;
        localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
      } else {
        // on normal page load / navigation keep selected language
        langToApply = savedLang || DEFAULT_LANG;
      }

      applyLanguage(langToApply);
    })
    .catch((err) => console.error("Error loading translations:", err));
});

// button clicks
if (btnEn) {
  btnEn.addEventListener("click", () => {
    applyLanguage("English");
    playLangAudio("English");
  });
}
if (btnHi) {
  btnHi.addEventListener("click", () => {
    applyLanguage("Hindi");
    playLangAudio("Hindi");
  });
}
if (btnGu) {
  btnGu.addEventListener("click", () => {
    applyLanguage("Gujarati");
    playLangAudio("Gujarati");
  });
}