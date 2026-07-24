/* =========================================================
   Damco L2 — Application & Product Engineering — main.js
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer:fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var io = null;

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* split text */
  $$("[data-split-lines]").forEach(function (el) {
    if (reduceMotion) return;
    el.innerHTML = '<span class="split-inner">' + el.innerHTML + "</span>";
    el.classList.add("split-line");
  });

  /* start immediately (no preloader) */
  var heroTitle = $(".hero-title");
  if (heroTitle) heroTitle.classList.add("is-in");
  revealNow();

  /* header scroll */
  var header = $("#siteHeader");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 12); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* overlay menu */
  var toggle = $("#navToggle"), overlay = $("#overlayMenu");
  var setMenu = function (open) {
    toggle.setAttribute("aria-expanded", String(open));
    overlay.classList.toggle("is-open", open);
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    $$("#overlayMenu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* reveal */
  function revealNow() {
    var els = $$("[data-reveal], .split-line");
    if ("IntersectionObserver" in window && !reduceMotion) {
      io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      els.forEach(function (el) { io.observe(el); });
    } else els.forEach(function (el) { el.classList.add("is-in"); });
  }
  if (reduceMotion) revealNow();

  /* count-up */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "", suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    var dur = 1500, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else counters.forEach(function (c) { c.textContent = (c.getAttribute("data-prefix") || "") + c.getAttribute("data-count") + (c.getAttribute("data-suffix") || ""); });

  /* timeline progress */
  var tl = $("#timeline"), prog = $("#tlProgress");
  if (tl && prog && !reduceMotion) {
    var updateTL = function () {
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var startPt = vh * 0.75, endPt = vh * 0.35;
      var total = r.height + (startPt - endPt);
      var passed = startPt - r.top;
      var pct = Math.max(0, Math.min(1, passed / total));
      prog.style.height = (pct * 100) + "%";
    };
    updateTL();
    window.addEventListener("scroll", updateTL, { passive: true });
    window.addEventListener("resize", updateTL);
  } else if (prog && reduceMotion) { prog.style.height = "100%"; }

  /* magnetic + tilt (fine pointer) */
  if (!reduceMotion && finePointer) {
    $$("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.22 + "px," + (e.clientY - r.top - r.height / 2) * 0.32 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* cursor */
  var cursor = $("#cursor");
  if (cursor && !reduceMotion && finePointer) {
    cursor.classList.add("is-active");
    var cx = 0, cy = 0, tx = 0, ty = 0, raf;
    window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; if (!raf) loop(); });
    function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : null;
    }
    var hov = "a, button, summary, input, textarea, .offer, .tech-pills span";
    document.addEventListener("mouseover", function (e) { if (e.target.closest(hov)) cursor.classList.add("is-hover"); });
    document.addEventListener("mouseout", function (e) { if (e.target.closest(hov)) cursor.classList.remove("is-hover"); });
  }

  /* FAQ accordion (single-open, animated) */
  var faqItems = $$(".faq-item");
  $$(".faq-body").forEach(function (b) { b.style.height = "0px"; b.style.transition = "height 0.4s cubic-bezier(0.19,1,0.22,1)"; });
  faqItems.forEach(function (item) {
    var body = $(".faq-body", item), summary = $("summary", item);
    summary.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = item.hasAttribute("open");
      if (!isOpen) {
        faqItems.forEach(function (o) { if (o !== item && o.hasAttribute("open")) { $(".faq-body", o).style.height = "0px"; o.removeAttribute("open"); } });
        item.setAttribute("open", "");
        if (reduceMotion) { body.style.height = "auto"; return; }
        body.style.height = "0px";
        var h = body.scrollHeight;
        requestAnimationFrame(function () { body.style.height = h + "px"; });
        body.addEventListener("transitionend", function te() { body.style.height = "auto"; body.removeEventListener("transitionend", te); });
      } else {
        if (reduceMotion) { item.removeAttribute("open"); return; }
        body.style.height = body.scrollHeight + "px";
        requestAnimationFrame(function () { body.style.height = "0px"; });
        body.addEventListener("transitionend", function te() { item.removeAttribute("open"); body.removeEventListener("transitionend", te); });
      }
    });
  });

  /* case carousel (coverflow) */
  var stage = $("#caseStage");
  if (stage) {
    var slides = $$(".case-slide", stage);
    var n = slides.length, active = 0, offset = 0;

    function sizeStage() {
      var maxH = 0;
      slides.forEach(function (s) { maxH = Math.max(maxH, s.offsetHeight); });
      if (maxH) stage.style.height = maxH + "px";
    }
    function computeOffset() {
      var cw = stage.getBoundingClientRect().width;
      offset = Math.min(cw * 0.33, 340);
    }
    function setLink(s, on) { var l = s.querySelector(".case-link"); if (l) l.setAttribute("tabindex", on ? "0" : "-1"); }
    function layout() {
      slides.forEach(function (s, i) {
        var d = i - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        s.classList.remove("is-active", "is-side", "is-hidden");
        if (d === 0) {
          s.style.transform = "translate(-50%,-50%) scale(1)"; s.style.zIndex = 3;
          s.classList.add("is-active"); setLink(s, true);
        } else if (d === -1) {
          s.style.transform = "translate(-50%,-50%) translateX(" + (-offset) + "px) scale(0.82)"; s.style.zIndex = 2;
          s.classList.add("is-side"); setLink(s, false);
        } else if (d === 1) {
          s.style.transform = "translate(-50%,-50%) translateX(" + offset + "px) scale(0.82)"; s.style.zIndex = 2;
          s.classList.add("is-side"); setLink(s, false);
        } else {
          s.style.transform = "translate(-50%,-50%) scale(0.7)"; s.style.zIndex = 1;
          s.classList.add("is-hidden"); setLink(s, false);
        }
      });
      $$(".case-dot").forEach(function (dot, i) { dot.classList.toggle("is-active", i === active); });
    }
    function go(i) { active = (i % n + n) % n; layout(); }
    function next() { go(active + 1); }
    function prev() { go(active - 1); }

    computeOffset(); layout(); sizeStage();
    window.addEventListener("resize", function () { computeOffset(); sizeStage(); layout(); });
    window.addEventListener("load", function () { computeOffset(); sizeStage(); layout(); });

    var nextBtn = $("#caseNext"), prevBtn = $("#casePrev");
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    $$(".case-dot").forEach(function (dot) { dot.addEventListener("click", function () { go(parseInt(dot.getAttribute("data-go"), 10)); }); });
    slides.forEach(function (s, i) { s.addEventListener("click", function (e) { if (s.classList.contains("is-side")) { e.preventDefault(); go(i); } }); });

    var carousel = $("#caseCarousel");
    if (carousel) {
      carousel.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      });
    }
    var sx = 0, dx = 0;
    stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
    stage.addEventListener("touchmove", function (e) { dx = e.touches[0].clientX - sx; }, { passive: true });
    stage.addEventListener("touchend", function () { if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); } });
  }

  /* form */
  var form = $(".cta-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = $("#formNote"), name = $("#f-name"), email = $("#f-email"), goal = $("#f-goal");
      if (!name.value.trim() || !email.value.trim() || !goal.value.trim()) { note.className = "form-note"; note.textContent = "Please add your name, work email, and what you're building."; return; }
      if (!/^\S+@\S+\.\S+$/.test(email.value)) { note.className = "form-note"; note.textContent = "Please enter a valid work email."; return; }
      note.className = "form-note is-ok";
      note.textContent = "Thanks, " + name.value.trim().split(" ")[0] + ". An engineer will reach out to set up your session.";
      form.reset();
    });
  }
})();
