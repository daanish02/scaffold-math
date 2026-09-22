// KaTeX render
if (document.getElementById("eq1")) {
  katex.render("A", document.getElementById("eq1"), { throwOnError: false });
}
if (document.getElementById("eq4")) {
  katex.render("A\\vec{v} = \\lambda \\vec{v}", document.getElementById("eq4"), { throwOnError: false });
}

// Transform visualizer
const canvas = document.getElementById("xform");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const sA = document.getElementById("s-a"), sB = document.getElementById("s-b"),
    sC = document.getElementById("s-c"), sD = document.getElementById("s-d");
  const oA = document.getElementById("out-a"), oB = document.getElementById("out-b"),
    oC = document.getElementById("out-c"), oD = document.getElementById("out-d");

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function eigen2x2(a, b, c, d) {
    const tr = a + d, det = a * d - b * c;
    const disc = tr * tr - 4 * det;
    if (disc < 0) return [];
    const sq = Math.sqrt(disc);
    const l1 = (tr + sq) / 2, l2 = (tr - sq) / 2;
    const vecs = [];
    [l1, l2].forEach((l) => {
      let vx, vy;
      if (Math.abs(b) > 1e-6) { vx = b; vy = l - a; }
      else if (Math.abs(c) > 1e-6) { vx = l - d; vy = c; }
      else { vx = 1; vy = 0; }
      const norm = Math.hypot(vx, vy) || 1;
      vecs.push({ x: vx / norm, y: vy / norm, lambda: l });
    });
    return vecs;
  }

  function draw() {
    const a = parseFloat(sA.value), b = parseFloat(sB.value),
      c = parseFloat(sC.value), d = parseFloat(sD.value);
    oA.textContent = a.toFixed(2); oB.textContent = b.toFixed(2);
    oC.textContent = c.toFixed(2); oD.textContent = d.toFixed(2);

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, scale = 40;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = getCssVar("--bg-raised");
    ctx.fillRect(0, 0, W, H);

    const rule = getCssVar("--rule"), ruleStrong = getCssVar("--rule-strong"),
      accent = getCssVar("--accent"), ink = getCssVar("--ink-soft");

    function toScreen(x, y) { return [cx + x * scale, cy - y * scale]; }

    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      for (let t = -6; t <= 6; t += 0.25) {
        const tx = a * i + b * t, ty = c * i + d * t;
        const [sx, sy] = toScreen(tx, ty);
        t === -6 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let t = -6; t <= 6; t += 0.25) {
        const tx = a * t + b * i, ty = c * t + d * i;
        const [sx, sy] = toScreen(tx, ty);
        t === -6 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = ruleStrong;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    const vecs = eigen2x2(a, b, c, d);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    vecs.forEach(({ x: vx, y: vy, lambda }, i) => {
      const len = 8;
      const [x1, y1] = toScreen(vx * len, vy * len);
      const [x2, y2] = toScreen(-vx * len, -vy * len);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

      // place label a short, fixed distance from the origin along the line,
      // offset perpendicular to it so text sits beside the stroke, not on it
      ctx.font = "12px monospace";
      const eqLine = Math.abs(vx) < 1e-6
        ? "x = 0"
        : `y = ${(vy / vx).toFixed(2)}x`;
      const label = `λ = ${lambda.toFixed(2)}  (${eqLine})`;
      const labelLen = 2.2 + i * 1.4;
      const [lx0, ly0] = toScreen(vx * labelLen, vy * labelLen);
      const px = -vy, py = vx; // perpendicular unit vector
      const perpOffset = 14;
      const textW = ctx.measureText(label).width;
      const lx = lx0 + px * perpOffset - textW / 2;
      const ly = ly0 + py * perpOffset;

      ctx.fillStyle = getCssVar("--bg-raised");
      ctx.globalAlpha = 0.85;
      ctx.fillRect(lx - 3, ly - 11, textW + 6, 15);
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;
      ctx.fillText(label, lx, ly);
    });

    if (vecs.length === 0) {
      ctx.fillStyle = ink;
      ctx.font = "13px sans-serif";
      ctx.fillText("No real eigenvectors — this matrix rotates", 14, 22);
    }
  }

  [sA, sB, sC, sD].forEach((s) => s.addEventListener("input", draw));
  draw();
  window.addEventListener("resize", draw);
}
