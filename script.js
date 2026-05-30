const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* -------------------------------------------------------------------------
   Scroll reveal — staggered fade/blur-up via IntersectionObserver
   ------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
   Scrollspy — highlight the nav link for the section in view
   ------------------------------------------------------------------------- */
function initScrollspy() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const map = new Map();
  for (const link of links) {
    const id = link.getAttribute("href")?.replace("#", "");
    const section = id && document.getElementById(id);
    if (section) map.set(section, link);
  }
  if (!map.size || !("IntersectionObserver" in window)) return;

  const setActive = (link) => {
    for (const l of links) {
      const active = l === link;
      l.classList.toggle("is-active", active);
      if (active) l.setAttribute("aria-current", "true");
      else l.removeAttribute("aria-current");
    }
  };

  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(map.get(entry.target));
      }
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  map.forEach((_link, section) => spy.observe(section));
}

/* -------------------------------------------------------------------------
   Ambient particle field (decorative; skipped under reduced motion)
   ------------------------------------------------------------------------- */
function initAtmosphere() {
  const canvas = document.getElementById("atmosphere");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  let width = 0;
  let height = 0;
  let pointerX = 0.5;
  let pointerY = 0.5;

  // Forest-night palette: bone light, warm amber, moss green
  const palette = [
    "236, 227, 209", // bone
    "236, 227, 209",
    "200, 154, 93", // amber
    "93, 107, 80", // moss
  ];

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function seedParticles() {
    particles.length = 0;
    const count = Math.min(90, Math.floor(width / 18));
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 40 + Math.random() * 140,
        a: 0.015 + Math.random() * 0.045,
        vx: -0.12 + Math.random() * 0.24,
        vy: -0.08 - Math.random() * 0.16,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx + (pointerX - 0.5) * 0.08;
      p.y += p.vy + (pointerY - 0.5) * 0.04;

      if (p.x < -p.r) p.x = width + p.r;
      if (p.x > width + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = height + p.r;
      if (p.y > height + p.r) p.y = -p.r;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gradient.addColorStop(0, `rgba(${p.color}, ${p.a})`);
      gradient.addColorStop(0.62, `rgba(${p.color}, ${p.a * 0.32})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    seedParticles();
  });

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX / width;
    pointerY = event.clientY / height;
  });

  resize();
  seedParticles();
  draw();
}

initReveal();
initScrollspy();
initAtmosphere();
