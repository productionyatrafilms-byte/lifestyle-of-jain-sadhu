const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujrati");

const DEFAULT_LANG = "English";
const STORAGE_KEY = "selectedLanguage";
let translations = {};

// ================= LANDSCAPE ALERT =================

let landscapeAlertShown = false;

function checkScreenSize() {
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isMobile && window.innerWidth < 768) {
    if (!landscapeAlertShown) {
      landscapeAlertShown = true;
      alert("Please use Landscape!");
    }
  } else {
    landscapeAlertShown = false;
  }
}

window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);
window.addEventListener("orientationchange", function () {
  setTimeout(checkScreenSize, 200);
});

// ================= LANGUAGE AUDIO =================

const langAudioMap = {
  English: "./assets/audio/Eng.mpeg",
  Hindi: "./assets/audio/Hin.mpeg",
  Gujarati: "./assets/audio/Guj.mpeg",
};

let currentLangAudio = null;

function playLangAudio(lang) {
  const src = langAudioMap[lang];

  if (!src) return;

  if (currentLangAudio) {
    currentLangAudio.pause();
    currentLangAudio.currentTime = 0;
  }

  currentLangAudio = new Audio(src);

  currentLangAudio.play().catch(function (err) {
    console.error(
      "Error playing language audio:",
      err,
    );
  });
}

// ================= ACTIVE BUTTON =================

function setActiveButton(activeBtn) {
  [btnEn, btnHi, btnGu].forEach(function (btn) {
    if (btn) {
      btn.classList.remove("active");
    }
  });

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// ================= APPLY LANGUAGE =================

function applyLanguage(lang) {
  const langData = translations[lang];

  if (!langData) return;

  if (lang === "English") {
    document.documentElement.lang = "en";
    document.body.setAttribute("data-lang", "en");
    setActiveButton(btnEn);
  } else if (lang === "Hindi") {
    document.documentElement.lang = "hi";
    document.body.setAttribute("data-lang", "hi");
    setActiveButton(btnHi);
  } else if (lang === "Gujarati") {
    document.documentElement.lang = "gu";
    document.body.setAttribute("data-lang", "gu");
    setActiveButton(btnGu);
  }

  document
    .querySelectorAll("[data-lang-key]")
    .forEach(function (element) {
      const key =
        element.getAttribute("data-lang-key");

      if (langData[key] !== undefined) {
        element.innerHTML = String(
          langData[key],
        ).replace(/\n/g, "<br>");
      }
    });

  localStorage.setItem(STORAGE_KEY, lang);
}

// ================= DETECT REFRESH =================

function isPageRefresh() {
  const navEntries =
    performance.getEntriesByType("navigation");

  if (navEntries.length > 0) {
    return navEntries[0].type === "reload";
  }

  return performance.navigation.type === 1;
}

// ================= LOAD LANGUAGE =================

window.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch("./assets/json/data.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "Unable to load data.json",
          );
        }

        return response.json();
      })
      .then(function (data) {
        translations = data;

        const savedLang =
          localStorage.getItem(STORAGE_KEY);

        let langToApply = DEFAULT_LANG;

        if (isPageRefresh()) {
          langToApply = DEFAULT_LANG;

          localStorage.setItem(
            STORAGE_KEY,
            DEFAULT_LANG,
          );
        } else {
          langToApply =
            savedLang || DEFAULT_LANG;
        }

        applyLanguage(langToApply);
      })
      .catch(function (err) {
        console.error(
          "Error loading translations:",
          err,
        );
      });
  },
);

// ================= LANGUAGE BUTTON CLICKS =================

if (btnEn) {
  btnEn.addEventListener(
    "click",
    function () {
      applyLanguage("English");
      playLangAudio("English");
    },
  );
}

if (btnHi) {
  btnHi.addEventListener(
    "click",
    function () {
      applyLanguage("Hindi");
      playLangAudio("Hindi");
    },
  );
}

if (btnGu) {
  btnGu.addEventListener(
    "click",
    function () {
      applyLanguage("Gujarati");
      playLangAudio("Gujarati");
    },
  );
}