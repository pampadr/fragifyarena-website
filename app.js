// ============================================
// Template Engine — Injects CONFIG values into pages
// ============================================

(function () {
  const C = CONFIG;

  // -- Helper: set text content by ID --
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // -- Helper: set text for all elements with a class --
  function setTextAll(className, text) {
    document.querySelectorAll("." + className).forEach(function (el) {
      el.textContent = text;
    });
  }

  // -- Helper: show element by ID --
  function show(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  }

  // -- Common elements (all pages) --
  setText("header-logo", C.appName);
  setText("footer-text", "\u00A9 " + new Date().getFullYear() + " " + C.developerName + ". All rights reserved.");

  // -- Page title --
  var titleEl = document.getElementById("page-title");
  if (titleEl) {
    var base = titleEl.textContent;
    titleEl.textContent = base + " — " + C.appName;
  }

  // -- Predefined themes --
  var THEMES = {
    warm: {
      colorBg: "#faf6f1",
      colorSurface: "#ffffff",
      colorText: "#3d3229",
      colorTextLight: "#7a6e63",
      colorAccent: "#c2754f",
      colorBorder: "#e8ddd3",
    },
    cool: {
      colorBg: "#f0f4f8",
      colorSurface: "#ffffff",
      colorText: "#1a2a3a",
      colorTextLight: "#5a6f82",
      colorAccent: "#4a8cb5",
      colorBorder: "#d2dde8",
    },
  };

  // -- Resolve colors: theme preset or custom --
  var colors = (C.theme === "custom") ? C.customColors : (THEMES[C.theme] || THEMES.warm);

  // -- Apply colors --
  var root = document.documentElement;
  root.style.setProperty("--color-bg", colors.colorBg);
  root.style.setProperty("--color-surface", colors.colorSurface);
  root.style.setProperty("--color-text", colors.colorText);
  root.style.setProperty("--color-text-light", colors.colorTextLight);
  root.style.setProperty("--color-accent", colors.colorAccent);
  root.style.setProperty("--color-border", colors.colorBorder);
  root.style.setProperty("--color-input-bg", colors.colorBg);

  // Derive accent hover color (18% darker)
  var canvas = document.createElement("canvas").getContext("2d");
  canvas.fillStyle = colors.colorAccent;
  var hex = canvas.fillStyle;
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  var darken = function (v) { return Math.max(0, Math.round(v * 0.82)); };
  var hoverColor = "#" + [darken(r), darken(g), darken(b)].map(function (v) {
    return v.toString(16).padStart(2, "0");
  }).join("");
  root.style.setProperty("--color-accent-hover", hoverColor);

  // -- Index page --
  setText("hero-title", C.appName);
  setText("hero-subtitle", "Support and legal information for " + C.appName + ".");

  // -- Effective date (privacy & terms) --
  var dateEls = document.querySelectorAll("#effective-date");
  dateEls.forEach(function (el) { el.textContent = C.effectiveDate; });

  // -- App name & developer name spans --
  setTextAll("app-name", C.appName);
  setTextAll("developer-name", C.developerName);
  setTextAll("jurisdiction", C.jurisdiction);

  // -- Privacy policy intro --
  setText("privacy-intro",
    C.developerName + " built " + C.appName + " as a free app for iOS. " +
    "This Privacy Policy explains what information we collect, how we use it, and your choices. " +
    "By using " + C.appName + ", you agree to this policy."
  );

  // -- Conditional privacy sections --
  if (C.collectsAnalytics) show("analytics-section");
  if (C.collectsDeviceInfo) show("device-info-section");
  if (C.collectsCrashReports) show("crash-reports-section");

  if (C.usesThirdPartyServices && C.thirdPartyServices.length > 0) {
    show("third-party-section");
    var list = document.getElementById("third-party-list");
    if (list) {
      C.thirdPartyServices.forEach(function (service) {
        var li = document.createElement("li");
        li.textContent = service;
        list.appendChild(li);
      });
    }
  }

  // -- Contact email links --
  var contactLinks = ["privacy-contact-link", "terms-contact-link"];
  contactLinks.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.href = "mailto:" + C.contactEmail;
      el.textContent = C.contactEmail;
    }
  });

  // -- Contact form (UI only) --
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      document.getElementById("form-success").style.display = "block";
    });
  }
})();
