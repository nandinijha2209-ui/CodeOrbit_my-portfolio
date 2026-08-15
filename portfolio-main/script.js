/* =====================================================================
   Nandini Kumari Jha — Portfolio
   All content config + animation systems (vanilla JS, zero deps)
   ===================================================================== */

/* ---------------------------------------------------------------------
   EDIT YOUR CONTENT HERE — one place, everything updates
   --------------------------------------------------------------------- */
const CONFIG = {
  name: "Nandini Kumari Jha",
  initials: "NKJ",
  role: "IT Diploma Student",
  college: "Jharsuguda Engineering School",
  location: "Jharsuguda, Odisha, India",
  email: "nandinijha8763@gmail.com",
  phone: "",
  socials: {
    github: "https://github.com/nandinijha2209-ui",
    linkedin: "https://www.linkedin.com/in/nandini-jha-498480340"
  },
  resumeUrl: "https://drive.google.com/file/d/1JSDCFUtsoDaHXmhvghPay13ijcSg9hGi/view?usp=sharing",
  roles: ["IT Diploma Student", "Software Developer", "Java Programmer", "Problem Solver"],
  marquee: [
    "Core Java", "SQL", "JavaScript", "HTML & CSS",
    "Software Development", "Teamwork", "Critical Thinking", "Problem Solving"
  ],
  education: [
    {
      year: "2019 — 2022",
      title: "Secondary Education (10th)",
      desc: "Completed secondary schooling with a strong foundation in science and mathematics.",
      tag: "Completed"
    },
    {
      year: "2022 — 2024",
      title: "Higher Secondary (+2) — Science",
      desc: "Pursued PCB,IT in the Science stream, sharpening analytical and logical thinking skills.",
      tag: "Completed"
    },
    {
      year: "2024 — Present",
      title: "Diploma in Information Technology",
      desc: "Final year at Jharsuguda Engineering School, Jharsuguda, Odisha. Focused on Java, SQL and web technologies.",
      tag: "In Progress",
      current: true
    }
  ],
  skills: [
    { name: "Core Java", pct: 85, icon: "Ja" },
    { name: "HTML & CSS", pct: 88, icon: "<>" },
    { name: "JavaScript", pct: 78, icon: "JS" },
    { name: "SQL", pct: 76, icon: "SQL" },
    { name: "Software Development", pct: 80, icon: "SD" }
  ],
  softSkills: [
    "Teamwork", "Critical Thinking", "Problem Solving",
    "Communication", "Adaptability", "Time Management", "Attention to Detail"
  ],
  stats: [
    { num: 8, suffix: "+", label: "Skills & Tools" },
    { num: 6, suffix: "", label: "Mini Projects", live: true },
    { num: 6, suffix: " yrs", label: "Learning Journey" },
    { num: 3, suffix: "", label: "Languages Spoken" }
  ],
  projects: [
    {
      title: "Library Management System",
      desc: "A console-based Java application with SQL persistence to manage books, members and issue/return records using JDBC.",
      tags: ["Java", "JDBC", "SQL"],
      github: "https://github.com/nandinijha2209-ui",
      live: "#",
      icon: "LM",
      featured: true
    },
    {
      title: "Student Result Portal",
      desc: "A web app where students can view semester results. Built with HTML, CSS, JavaScript and SQL-backed data handling.",
      tags: ["HTML", "CSS", "JavaScript", "SQL"],
      github: "https://github.com/nandinijha2209-ui",
      live: "#",
      icon: "RP"
    },
    {
      title: "Personal Portfolio Website",
      desc: "This website — a fully responsive, animated portfolio crafted with pure HTML, CSS and JavaScript.",
      tags: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/nandinijha2209-ui",
      live: "#",
      icon: "PF"
    },
    {
      title: "Job Portal (Static)",
      desc: "A responsive job-listing website concept with a filtering UI, built as a team project to practise layout and UX.",
      tags: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/nandinijha2209-ui",
      live: "#",
      icon: "JB"
    }
  ]
};

/* =====================================================================
   Helpers
   ===================================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const finePointer = window.matchMedia("(pointer: fine)").matches;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

function splitChars(el) {
  const nodes = [...el.childNodes];
  el.textContent = "";
  nodes.forEach(node => {
    if (node.nodeType === 3) {
      const text = node.textContent;
      if (!text.trim()) { el.appendChild(document.createTextNode(text)); return; }
      text.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          [...part].forEach(c => {
            const s = document.createElement("span");
            s.className = "char";
            s.textContent = c;
            el.appendChild(s);
          });
        }
      });
    } else {
      el.appendChild(node);
      if (node.children.length === 0 && node.textContent.trim() && !node.classList.contains("char")) {
        splitChars(node);
      }
    }
  });
}

/* =====================================================================
   Render content from CONFIG
   ===================================================================== */
function renderStatic() {
  $("#year").textContent = new Date().getFullYear();

  $("#emailLink").href = `mailto:${CONFIG.email}`;
  $("#emailLink").textContent = CONFIG.email;

  const phoneCard = $("#phoneCard");
  if (phoneCard) phoneCard.remove();

  $$("[data-social]").forEach(el => {
    const key = el.dataset.social;
    if (CONFIG.socials[key]) el.href = CONFIG.socials[key];
  });

  if (CONFIG.resumeUrl) $$("[data-resume]").forEach(el => el.href = CONFIG.resumeUrl);
}

function renderMarquee() {
  const group = html => CONFIG.marquee.map(w => `<span>${w}</span>`).join("");
  $("#marqueeGroupA").innerHTML = group();
  $("#marqueeGroupB").innerHTML = group();
}

/* JS-driven infinite marquee — works even when CSS animations are disabled
   by prefers-reduced-motion, and gives a smooth constant-speed scroll. */
function initMarquee() {
  const track = $(".marquee__track");
  const group = $(".marquee__group");
  if (!track || !group) return;

  const speed = 38; // px per second
  let offset = 0;
  let last = performance.now();
  let paused = false;

  const marquee = $(".marquee");
  if (marquee) {
    marquee.addEventListener("pointerenter", () => { paused = true; });
    marquee.addEventListener("pointerleave", () => { paused = false; });
  }

  function loop(now) {
    if (!paused) {
      const dt = Math.min((now - last) / 1000, 0.1);
      offset -= speed * dt;
      const gw = group.offsetWidth;
      if (gw > 0) {
        if (-offset >= gw) offset += gw;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
    }
    last = now;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function renderTimeline() {
  $("#timeline").innerHTML = CONFIG.education.map((e, i) => `
    <li data-reveal="up" style="--reveal-delay:${i * 110}ms">
      <span class="timeline__year">${e.year}</span>
      <span class="timeline__title">${e.title}</span>
      <span class="timeline__desc">${e.desc}</span>
      <span class="timeline__tag">${e.tag}</span>
    </li>`).join("");
}

function renderSkills() {
  $("#skillBars").innerHTML = CONFIG.skills.map((s, i) => `
    <div class="skill" data-reveal="up" style="--reveal-delay:${i * 90}ms">
      <div class="skill__head">
        <span class="skill__name"><span class="skill__icon">${s.icon}</span>${s.name}</span>
        <span class="skill__pct">${s.pct}%</span>
      </div>
      <div class="skill__bar"><span data-width="${s.pct}"></span></div>
    </div>`).join("");
}

function renderChips() {
  $("#softChips").innerHTML = CONFIG.softSkills.map((c, i) =>
    `<span class="chip" data-reveal="scale" style="--reveal-delay:${i * 60}ms">${c}</span>`).join("");
}

function renderStats() {
  $("#stats").innerHTML = CONFIG.stats.map((s, i) => `
    <div class="stat" data-reveal="up" data-cursor="link" style="--reveal-delay:${i * 90}ms">
      <span class="stat__num" ${s.live ? `data-live="1" ` : ""}data-count="${s.num}" data-suffix="${s.suffix || ""}">0${s.suffix || ""}</span>
      <span class="stat__label">${s.label}</span>
    </div>`).join("");
}

function setMiniProjectCount(count) {
  const el = document.querySelector('.stat__num[data-live="1"]');
  if (!el) return;
  el.dataset.count = count;
  const suffix = el.dataset.suffix || "";
  if (el.textContent !== "0" + suffix) el.textContent = count + suffix;
}

const GIT_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.35.77 1.05.77 2.12v3.15c0 .3.2.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>`;
const LINK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>`;

const GITHUB_USERNAME = "nandinijha2209-ui";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

const ACRONYMS = { ai: "AI", html: "HTML", css: "CSS", java: "Java", sql: "SQL", js: "JS", git: "Git", github: "GitHub" };

function prettyRepoName(name) {
  return name
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(w => ACRONYMS[w.toLowerCase()] || (w[0] || "").toUpperCase() + w.slice(1))
    .join(" ");
}

function repoInitials(title) {
  const words = title.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function repoFallbackDesc(r, title) {
  const bits = [];
  if (r.language) bits.push(r.language);
  if (r.topics && r.topics.length) bits.push(r.topics.join(", "));
  return `${title} — ${bits.join(" · ") || "a personal"} project I built during my diploma journey. Explore the repository for the source code and approach.`;
}

function repoToProject(r) {
  const title = prettyRepoName(r.name);
  const lang = r.language || "GitHub";
  const topics = (r.topics || []).slice(0, 3);
  return {
    title,
    desc: (r.description || repoFallbackDesc(r, title)).trim().replace(/\s+\.\s*$/, "."),
    tags: [lang, ...topics].slice(0, 5),
    github: r.html_url,
    live: r.homepage || null,
    icon: repoInitials(title),
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    updated: r.pushed_at ? new Date(r.pushed_at).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "",
    score: (r.description ? 2 : 0) + (r.homepage ? 1 : 0) + Math.min(r.stargazers_count || 0, 3)
  };
}

function renderProjects(list) {
  const grid = $("#projectsGrid");
  grid.innerHTML = list.map((p, i) => `
    <article class="project" data-reveal="up" data-cursor="link" style="--reveal-delay:${i * 110}ms">
      <div class="project__spotlight"></div>
      <div class="project__top">
        <span class="project__icon">${p.icon}</span>
        <div class="project__links">
          ${p.github && p.github !== "#" ? `<a href="${p.github}" target="_blank" rel="noopener" data-cursor="label|GITHUB" aria-label="View code on GitHub">${GIT_ICON}</a>` : ""}
          ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" data-cursor="label|LIVE" aria-label="Open live demo">${LINK_ICON}</a>` : ""}
        </div>
      </div>
      <h3 class="project__title">${p.title}</h3>
      <p class="project__desc">${p.desc}</p>
      <div class="project__tags">
        ${p.tags.map((t, ti) => `<span class="project__tag ${ti === 0 ? "project__tag--accent" : ""}">${t}</span>`).join("")}
      </div>
      <div class="project__meta">${p.forks} forks &nbsp;·&nbsp; ${p.stars} stars${p.updated ? ` &nbsp;·&nbsp; ${p.updated}` : ""}</div>
    </article>`).join("");

  bindReveals();
  bindCursorTargets();
  bindTilt();
  bindSpotlight();
}

function renderProjectsSkeleton() {
  $("#projectsGrid").innerHTML = Array.from({ length: 4 }, () => `
    <div class="project project--skeleton">
      <div class="sk sk-badge"></div>
      <div class="sk sk-title"></div>
      <div class="sk sk-line"></div>
      <div class="sk sk-line sk-short"></div>
      <div class="sk sk-tags"></div>
    </div>`).join("");
}

async function loadLiveProjects() {
  const note = $("#projectsNote");
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "nandini-portfolio" }
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = await res.json();
    if (!Array.isArray(repos) || !repos.length) throw new Error("No repositories found");

    const list = repos
      .filter(r => !r.fork)
      .map(repoToProject)
      .sort((a, b) => b.score - a.score || b.updated.localeCompare(a.updated));

    renderProjects(list);
    setMiniProjectCount(list.length);
    if (note) note.textContent = `Pulled live from GitHub API — ${list.length} repositories`;
  } catch (err) {
    renderProjects(CONFIG.projects);
    setMiniProjectCount(CONFIG.projects.length);
    if (note) note.textContent = "Showing saved projects (GitHub API unavailable right now).";
  }
}

/* =====================================================================
   Reveal-on-scroll system (IntersectionObserver)
   ===================================================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-revealed");
    const head = entry.target.closest(".section-head");
    if (head) head.classList.add("is-revealed");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

function bindReveals() {
  const els = $$("[data-reveal]");
  const seen = new Set();
  els.forEach(el => {
    revealObserver.observe(el);
    if (seen.has(el)) return;
    const parent = el.parentElement;
    if (!parent || parent.hasAttribute("data-reveal")) return;
    const siblings = [...parent.children].filter(c => c.hasAttribute("data-reveal"));
    if (siblings.length < 2) return;
    siblings.forEach((s, i) => {
      if (!s.style.getPropertyValue("--reveal-delay")) {
        s.style.setProperty("--reveal-delay", `${i * 90}ms`);
      }
      seen.add(s);
    });
  });
}

function animateSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.width + "%";
      io.unobserve(bar);
    });
  }, { threshold: 0.6 });
  $$(".skill__bar span").forEach(bar => io.observe(bar));
}

function animateCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const dur = 1500;
      const start = performance.now();
      const tick = now => {
        const p = clamp((now - start) / dur, 0, 1);
        el.textContent = Math.round(target * easeOutCubic(p)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$(".stat__num").forEach(el => io.observe(el));
}

/* =====================================================================
   Theme toggle
   ===================================================================== */
function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("hds-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  if (saved === "light" || (!saved && prefersLight)) root.classList.add("light");

  $("#themeToggle").addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("hds-theme", root.classList.contains("light") ? "light" : "dark");
    $('meta[name="theme-color"]').setAttribute("content", root.classList.contains("light") ? "#f3f0ea" : "#0a0a0a");
  });
}

/* =====================================================================
   Preloader + hero intro
   ===================================================================== */
const preloader = $("#preloader");
let introStarted = false;

function startIntro() {
  if (introStarted) return;
  introStarted = true;

  document.body.classList.remove("preload");
  document.body.classList.add("loaded");

  splitChars($(".hero__title"));
  const chars = $$(".hero__title .char");
  chars.forEach((c, i) => {
    c.style.transitionDelay = `${0.12 + i * 0.035}s`;
  });
  // re-trigger: chars are already in DOM; body.loaded flips them visible
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("reveal-chars")));

  const lines = $$(".term-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("is-in"), 900 + i * 220);
  });

  setTimeout(() => {
    preloader.classList.add("done");
    setTimeout(() => preloader.remove(), 1400);
    document.body.classList.remove("no-scroll");
  }, 400);
}

function initPreloader() {
  document.body.classList.add("preload", "no-scroll");

  const bar = $("#preloaderBar");
  const count = $("#preloaderCount");
  const dur = 1500;
  const start = performance.now();
  let done = false;

  const finish = () => { if (!done) { done = true; startIntro(); } };

  preloader.addEventListener("pointerdown", () => {
    if (!done) {
      bar.style.width = "100%";
      count.textContent = "100%";
      startIntro();
    }
  });

  (function loop(now) {
    const p = clamp((now - start) / dur, 0, 1);
    const eased = easeOutExpo(p);
    bar.style.width = (eased * 100).toFixed(1) + "%";
    count.textContent = Math.round(eased * 100) + "%";
    if (p < 1) requestAnimationFrame(loop);
    else finish();
  })(performance.now());
}

/* =====================================================================
   Typewriter (rotating roles)
   ===================================================================== */
function initTypewriter() {
  const rotator = $("#rotator");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const role = CONFIG.roles[roleIdx];
    rotator.textContent = role.slice(0, charIdx);
    let delay = deleting ? 38 : 80;
    if (!deleting && charIdx === role.length) {
      deleting = true; delay = 1900;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % CONFIG.roles.length;
      delay = 450;
    } else {
      charIdx += deleting ? -1 : 1;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2300);
}

/* =====================================================================
   Lenis smooth scroll + anchor navigation
   ===================================================================== */
function initSmoothScroll() {
  if (window.lenis) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (window.lenis) window.lenis.scrollTo(target, { offset: -74, duration: 1.2 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* =====================================================================
   Nav state + progress + mobile menu
   ===================================================================== */
const nav = $("#nav");
let menuOpen = false;

function initNav() {
  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    if (y > lastY && y > 320 && !menuOpen) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    $("#progress span").style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  }, { passive: true });

  const burger = $("#hamburger");
  const menu = $("#mobileMenu");
  burger.addEventListener("click", () => {
    menuOpen = !menuOpen;
    burger.classList.toggle("is-open", menuOpen);
    menu.classList.toggle("is-open", menuOpen);
    burger.setAttribute("aria-expanded", menuOpen);
    menu.setAttribute("aria-hidden", !menuOpen);
    document.body.classList.toggle("no-scroll", menuOpen);
    if (window.lenis) menuOpen ? window.lenis.stop() : window.lenis.start();
  });
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  $("#hamburger").classList.remove("is-open");
  $("#mobileMenu").classList.remove("is-open");
  $("#hamburger").setAttribute("aria-expanded", "false");
  $("#mobileMenu").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (window.lenis) window.lenis.start();
}

/* =====================================================================
   Custom cursor + magnetic elements
   ===================================================================== */
let cursorSetState = null;

function bindCursorTargets() {
  $$("[data-cursor]").forEach(el => {
    if (el.dataset.cursorBound === "1") return;
    el.dataset.cursorBound = "1";
    el.addEventListener("pointerenter", () => cursorSetState && cursorSetState(el, true));
    el.addEventListener("pointerleave", () => cursorSetState && cursorSetState(el, false));
  });
}

function initCursor() {
  if (!finePointer) return;
  const cursor = $("#cursor");
  const dot = $(".cursor__dot", cursor);
  const ring = $(".cursor__ring", cursor);
  const label = $(".cursor__label", cursor);

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  window.addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  (function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(loop);
  })();

  cursorSetState = (el, on) => {
    const v = el.dataset.cursor;
    cursor.classList.toggle("is-link", on && v === "link");
    cursor.classList.toggle("is-hover", on && !!v && v !== "link" && !v.startsWith("label"));
    const labeled = on && v && v.startsWith("label");
    cursor.classList.toggle("is-label", labeled);
    if (labeled) label.textContent = v.split("|")[1] || "";
  };

  bindCursorTargets();

  $$(".magnetic").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.32;
      const y = (e.clientY - r.top - r.height / 2) * 0.32;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

/* =====================================================================
   3D tilt + spotlight
   ===================================================================== */
function bindTilt() {
  if (!finePointer) return;
  $$(".project, .terminal").forEach(el => {
    if (el.dataset.tiltBound === "1") return;
    el.dataset.tiltBound = "1";
    let raf = null;
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(950px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-4px)`;
      });
    });
    el.addEventListener("pointerleave", () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  });
}

function bindSpotlight() {
  $$(".project, .stat, .terminal").forEach(el => {
    if (el.dataset.spotBound === "1") return;
    el.dataset.spotBound = "1";
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* =====================================================================
   Mouse parallax (blobs + float cards) with idle float
   ===================================================================== */
function initParallax() {
  const els = $$(".blob, .hero__float-card").map((el, i) => ({
    el, depth: parseFloat(el.dataset.depth || 0) || 0, i
  }));
  let tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener("pointermove", e => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  (function loop(t) {
    cx += (tx - cx) * 0.045;
    cy += (ty - cy) * 0.045;
    els.forEach(({ el, depth, i }) => {
      const bx = Math.sin(t * 0.0004 + i * 1.7) * 9;
      const by = Math.cos(t * 0.0005 + i * 2.3) * 9;
      el.style.transform = `translate3d(${cx * depth + bx}px, ${cy * depth + by}px, 0)`;
    });
    requestAnimationFrame(loop);
  })(performance.now());
}

/* =====================================================================
   Contact form → mailto
   ===================================================================== */
function initForm() {
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#f-name").value.trim();
    const email = $("#f-email").value.trim();
    const subject = $("#f-subject").value.trim();
    const msg = $("#f-msg").value.trim();

    $$(".field input, .field textarea").forEach(f => f.classList.toggle("is-error", !f.value.trim()));
    if (!name || !email || !subject || !msg) return;

    const body = `Hi Hukum,\n\n${msg}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function initScrollProgress() {
  const bar = $("#scrollBar");
  if (!bar) return;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* =====================================================================
   Boot
   ===================================================================== */
document.documentElement.classList.remove("no-js");
renderStatic();
renderMarquee();
initMarquee();
renderTimeline();
renderSkills();
renderChips();
renderStats();
renderProjectsSkeleton();
loadLiveProjects();

bindReveals();
animateSkillBars();
animateCounters();

initTheme();
initPreloader();
initTypewriter();
initSmoothScroll();
initNav();
initCursor();
bindTilt();
bindSpotlight();
initParallax();
initForm();
initScrollProgress();
