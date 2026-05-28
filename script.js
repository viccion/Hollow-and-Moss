const canvas = document.getElementById("atmosphere");
const ctx = canvas.getContext("2d");
const particles = [];
let width = 0;
let height = 0;
let pointerX = 0.5;
let pointerY = 0.5;

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
      warm: Math.random() > 0.72
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
    const color = p.warm ? "198, 155, 99" : "215, 199, 173";
    gradient.addColorStop(0, `rgba(${color}, ${p.a})`);
    gradient.addColorStop(0.62, `rgba(${color}, ${p.a * 0.32})`);
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
