export function creerBriques(pattern, level) {
  const brickW = 36, brickH = 15, brickPad = 3, brickTop = 50;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
  const bricks = [];
  pattern.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell > 0) {
        let hp = 1, isMetal = false;
        if (level >= 1 && Math.random() < 0.3) { hp = 2; isMetal = true; }
        if (level >= 3 && Math.random() < 0.2) { hp = 3; isMetal = true; }
        bricks.push({
          x: c * (brickW + brickPad) + 10, y: r * (brickH + brickPad) + brickTop,
          w: brickW, h: brickH, alive: true, color: colors[r],
          hasPowerUp: cell === 2, hp, maxHp: hp, isMetal,
        });
      }
    });
  });
  return bricks;
}

export function creerBalle(W, H, speed) {
  return { x: W/2, y: H - 50, r: 8, dx: 0, dy: 0, speed, launched: false };
}

export function creerRaquette(W, wide = false) {
  const w = wide ? 120 : 90;
  return { x: W/2 - w/2, y: W > 400 ? 480 - 30 : W - 30, w, h: 12 };
}

export function mettreAJourBalle(ball, paddle, bricks, W, H, level, fallingPowerUps, particles) {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.x - ball.r < 0 || ball.x + ball.r > W) ball.dx *= -1;
  if (ball.y - ball.r < 0) ball.dy *= -1;

  // Paddle collision
  if (ball.y + ball.r > paddle.y && ball.y + ball.r < paddle.y + paddle.h + 5 &&
      ball.x > paddle.x - ball.r && ball.x < paddle.x + paddle.w + ball.r) {
    ball.dy = -Math.abs(ball.dy);
    const hitPos = (ball.x - paddle.x) / paddle.w;
    ball.dx = (hitPos - 0.5) * ball.speed * 2.5;
  }

  // Brick collision
  let scoreGained = 0;
  bricks.forEach(b => {
    if (b.alive &&
        ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
        ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
      b.hp = (b.hp || 1) - 1;
      ball.dy *= -1;
      const color = b.isMetal ? '#9ca3af' : b.color;
      const particleCount = b.hp <= 0 ? 12 : 4;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: b.x + b.w/2, y: b.y + b.h/2,
          dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4,
          size: Math.random() * 4 + 2, color, life: 1,
        });
      }
      if (b.hp <= 0) {
        b.alive = false;
        scoreGained += (b.isMetal ? 20 : 10) * (level + 1);
        if (b.hasPowerUp) {
          const types = ['wide', 'slow', 'wide'];
          fallingPowerUps.push({ x: b.x + b.w/2, y: b.y, type: types[Math.floor(Math.random() * types.length)] });
        }
      } else {
        scoreGained += 5 * (level + 1);
      }
    }
  });

  // Ball lost?
  const ballLost = ball.y > H;

  // All bricks destroyed?
  const allDestroyed = bricks.every(b => !b.alive);

  return { scoreGained, ballLost, allDestroyed };
}

export function mettreAJourParticules(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.dx; p.y += p.dy; p.dy += 0.1; p.life -= 0.03;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

export function mettreAJourPowerUps(fallingPowerUps, paddle, H) {
  const collected = [];
  for (let i = fallingPowerUps.length - 1; i >= 0; i--) {
    const p = fallingPowerUps[i];
    p.y += 1;
    if (p.y > paddle.y && p.y < paddle.y + paddle.h + 15 &&
        p.x > paddle.x && p.x < paddle.x + paddle.w) {
      collected.push(p.type);
      fallingPowerUps.splice(i, 1);
    } else if (p.y > H) {
      fallingPowerUps.splice(i, 1);
    }
  }
  return collected;
}
