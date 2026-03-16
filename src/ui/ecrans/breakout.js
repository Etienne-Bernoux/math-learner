import { LEVELS } from '../../domain/breakout/niveaux.js';
import { creerBriques, creerBalle, creerRaquette, mettreAJourBalle, mettreAJourParticules, mettreAJourPowerUps } from '../../domain/breakout/physique.js';
import { creerDetecteurTripleDollar } from '../../domain/cheat/detecteur-triche.js';

export function initialiserBreakout(container, state, actions) {
  const { lives, puzzleData } = state;
  const W = 320, H = 480;

  // Game state
  let gameState = 'ready'; // ready, playing, won, lost, levelComplete
  let score = 0;
  let currentLives = lives;
  let level = parseInt(localStorage.getItem('breakoutLevel') || '0', 10);
  let powerUps = { wide: 0, slow: 0 };

  // Game objects
  let paddle, ball, bricks, fallingPowerUps, particles;
  let running = false;
  let animFrameId = null;
  let powerUpInterval = null;
  let canvas = null;
  let ctx = null;

  // Cheat code
  const onCheat = creerDetecteurTripleDollar(() => {
    if (bricks) bricks.forEach(b => { b.alive = false; });
  });
  const handleKeyDown = (e) => onCheat(e.key);
  window.addEventListener('keydown', handleKeyDown);

  function saveLevelToStorage() {
    localStorage.setItem('breakoutLevel', level.toString());
  }

  function initLevel(lvl) {
    const pattern = LEVELS[lvl % LEVELS.length].pattern;
    bricks = creerBriques(pattern, lvl);
    const isWide = powerUps.wide > 0;
    const pw = isWide ? 120 : 90;
    paddle = { x: W / 2 - pw / 2, y: H - 30, w: pw, h: 12 };
    const speed = powerUps.slow > 0 ? 2 : 2.5;
    ball = { x: W / 2, y: H - 50, r: 8, dx: 0, dy: 0, speed, launched: false };
    fallingPowerUps = [];
    particles = [];
    running = false;
    draw();
  }

  function draw() {
    if (!ctx) return;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, H);
    bgGradient.addColorStop(0, '#1e1b4b');
    bgGradient.addColorStop(1, '#0f0a2e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, W, H);

    // Stars effect
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 20; i++) {
      const sx = (i * 37 + level * 13) % W;
      const sy = (i * 23 + level * 7) % (H - 100);
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paddle with gradient
    const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.h);
    if (powerUps.wide > 0) {
      paddleGradient.addColorStop(0, '#4ade80');
      paddleGradient.addColorStop(1, '#16a34a');
    } else {
      paddleGradient.addColorStop(0, '#a78bfa');
      paddleGradient.addColorStop(1, '#7c3aed');
    }
    ctx.fillStyle = paddleGradient;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
    ctx.fill();
    // Paddle shine
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.roundRect(paddle.x + 4, paddle.y + 2, paddle.w - 8, 4, 2);
    ctx.fill();

    // Ball with glow effect
    const ballColor = powerUps.slow > 0 ? '#60a5fa' : '#fbbf24';
    const glowColor = powerUps.slow > 0 ? 'rgba(96, 165, 250, 0.4)' : 'rgba(251, 191, 36, 0.4)';
    // Glow
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r + 4, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.fill();
    // Ball
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(ball.x - 2, ball.y - 2, ball.r / 3, 0, Math.PI * 2);
    ctx.fill();

    // Bricks
    bricks.forEach(b => {
      if (b.alive) {
        if (b.isMetal) {
          const gradient = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
          gradient.addColorStop(0, '#9ca3af');
          gradient.addColorStop(0.5, '#6b7280');
          gradient.addColorStop(1, '#4b5563');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = b.color;
        }
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 3);
        ctx.fill();

        // Metal border
        if (b.isMetal) {
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Cracks based on damage
        if (b.isMetal && b.hp < b.maxHp) {
          ctx.strokeStyle = '#1f2937';
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (b.maxHp - b.hp >= 1) {
            ctx.moveTo(b.x + b.w * 0.3, b.y);
            ctx.lineTo(b.x + b.w * 0.5, b.y + b.h * 0.5);
            ctx.lineTo(b.x + b.w * 0.4, b.y + b.h);
          }
          if (b.maxHp - b.hp >= 2) {
            ctx.moveTo(b.x + b.w * 0.7, b.y);
            ctx.lineTo(b.x + b.w * 0.6, b.y + b.h * 0.6);
            ctx.lineTo(b.x + b.w * 0.8, b.y + b.h);
          }
          ctx.stroke();
        }

        // HP indicator for metal
        if (b.isMetal) {
          ctx.fillStyle = 'white';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(b.hp.toString(), b.x + b.w / 2 - 3, b.y + b.h / 2 + 3);
        }

        if (b.hasPowerUp && !b.isMetal) {
          ctx.fillStyle = 'white';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('\u2B50', b.x + b.w / 2 - 5, b.y + b.h / 2 + 4);
        }
      }
    });

    // Falling powerups
    fallingPowerUps.forEach(p => {
      ctx.fillStyle = p.type === 'wide' ? '#22c55e' : p.type === 'slow' ? '#60a5fa' : '#f472b6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(p.type === 'wide' ? '\u2194' : p.type === 'slow' ? '\uD83D\uDC22' : '\u00D72', p.x - 6, p.y + 4);
    });

    // Particles
    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // UI
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Niveau ${level + 1}`, 10, 20);
    ctx.fillText(`Score: ${score}`, W / 2 - 30, 20);
    ctx.fillText(`\u2764\uFE0F\u00D7${currentLives}`, W - 50, 20);

    // Active power-ups display
    let puY = 38;
    if (powerUps.wide > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`\u2194 ${Math.ceil(powerUps.wide)}s`, 10, puY);
      puY += 16;
    }
    if (powerUps.slow > 0) {
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`\uD83D\uDC22 ${Math.ceil(powerUps.slow)}s`, 10, puY);
    }

    if (!ball.launched && gameState === 'ready') {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Clique pour lancer !', W / 2 - 70, H / 2);
    }
  }

  function gameLoop() {
    if (!running) return;

    // Update ball position and check collisions
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
            x: b.x + b.w / 2, y: b.y + b.h / 2,
            dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2, color, life: 1,
          });
        }

        if (b.hp <= 0) {
          b.alive = false;
          score += (b.isMetal ? 20 : 10) * (level + 1);
          if (b.hasPowerUp) {
            const types = ['wide', 'slow', 'wide'];
            fallingPowerUps.push({ x: b.x + b.w / 2, y: b.y, type: types[Math.floor(Math.random() * types.length)] });
          }
        } else {
          score += 5 * (level + 1);
        }
      }
    });

    // Update falling powerups
    for (let i = fallingPowerUps.length - 1; i >= 0; i--) {
      const p = fallingPowerUps[i];
      p.y += 1;
      if (p.y > paddle.y && p.y < paddle.y + paddle.h + 15 &&
          p.x > paddle.x && p.x < paddle.x + paddle.w) {
        powerUps = { ...powerUps, [p.type]: powerUps[p.type] + 10 };
        applyPowerUps();
        fallingPowerUps.splice(i, 1);
      } else if (p.y > H) {
        fallingPowerUps.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.1;
      p.life -= 0.03;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Check win
    if (bricks.every(b => !b.alive)) {
      running = false;
      if (level < LEVELS.length - 1) {
        gameState = 'levelComplete';
      } else {
        gameState = 'won';
      }
      draw();
      renderOverlay();
      return;
    }

    // Ball lost
    if (ball.y > H) {
      running = false;
      currentLives--;
      actions.onLoseLife();
      if (currentLives <= 0) {
        gameState = 'lost';
        draw();
        renderOverlay();
      } else {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = H - 50;
        ball.dx = 0;
        ball.dy = 0;
        ball.launched = false;
        gameState = 'ready';
        draw();
        renderOverlay();
      }
      return;
    }

    draw();
    animFrameId = requestAnimationFrame(gameLoop);
  }

  function applyPowerUps() {
    if (!paddle || !ball) return;
    const shouldBeWide = powerUps.wide > 0;
    paddle.w = shouldBeWide ? 120 : 90;

    const shouldBeSlow = powerUps.slow > 0;
    const newSpeed = shouldBeSlow ? 2 : 2.5;
    if (ball.launched && ball.speed !== newSpeed) {
      const ratio = newSpeed / ball.speed;
      ball.dx *= ratio;
      ball.dy *= ratio;
    }
    ball.speed = newSpeed;
  }

  function renderUI() {
    const levelName = LEVELS[level % LEVELS.length].name;
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-4 shadow-2xl border border-white/20">
          <div class="flex justify-between items-center mb-3">
            <button id="btn-exit" class="text-purple-300 hover:text-white transition text-sm">\u2190 Quitter</button>
            <h2 class="text-lg font-bold text-white">\uD83C\uDFAE ${levelName}</h2>
            <div class="text-purple-300 text-sm">Niv.${level + 1}</div>
          </div>
          ${(powerUps.wide > 0 || powerUps.slow > 0) ? `
            <div class="flex justify-center gap-2 mb-2">
              ${powerUps.wide > 0 ? `<div class="text-sm py-1 px-3 rounded-full bg-green-500/30 text-green-300">\u2194\uFE0F ${Math.ceil(powerUps.wide)}s</div>` : ''}
              ${powerUps.slow > 0 ? `<div class="text-sm py-1 px-3 rounded-full bg-blue-500/30 text-blue-300">\uD83D\uDC22 ${Math.ceil(powerUps.slow)}s</div>` : ''}
            </div>
          ` : ''}
          <canvas id="breakout-canvas" width="${W}" height="${H}" class="rounded-xl bg-indigo-950 touch-none cursor-pointer" style="max-width: 100%"></canvas>
          <div id="overlay-container"></div>
          <div class="mt-3 flex justify-between text-purple-300 text-xs">
            <span>\u2764\uFE0F \u00D7 ${currentLives}</span>
            <span>Score: ${score}</span>
          </div>
        </div>
      </div>
    `;

    canvas = container.querySelector('#breakout-canvas');
    ctx = canvas.getContext('2d');

    // Wire events
    container.querySelector('#btn-exit').addEventListener('click', () => { cleanup(); actions.onExit(); });
    wireCanvasEvents();
  }

  function renderOverlay() {
    const overlayContainer = container.querySelector('#overlay-container');
    if (!overlayContainer) return;

    // Update bottom stats
    const statsEl = container.querySelector('.mt-3.flex');
    if (statsEl) {
      statsEl.innerHTML = `<span>\u2764\uFE0F \u00D7 ${currentLives}</span><span>Score: ${score}</span>`;
    }

    if (gameState === 'levelComplete') {
      overlayContainer.innerHTML = `
        <div class="text-center mt-4 animate-pop">
          <div class="text-4xl mb-2">\uD83C\uDF89</div>
          <div class="text-xl font-bold text-green-400 mb-2">Niveau ${level + 1} termin\u00E9 !</div>
          <button id="btn-next-level" class="px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold">
            Niveau suivant \u2192
          </button>
        </div>
      `;
      overlayContainer.querySelector('#btn-next-level').addEventListener('click', () => {
        level++;
        saveLevelToStorage();
        gameState = 'ready';
        overlayContainer.innerHTML = '';
        initLevel(level);
        // Re-wire canvas events since game state changed
        wireCanvasEvents();
      });
    } else if (gameState === 'won') {
      overlayContainer.innerHTML = `
        <div class="text-center mt-4 animate-pop">
          <div class="text-4xl mb-2">\uD83C\uDFC6</div>
          <div class="text-2xl font-bold text-yellow-400 mb-2">Tous les niveaux battus !</div>
          <div class="text-purple-300 mb-4">Score final : ${score}</div>
          <button id="btn-restart" class="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold mr-2">Rejouer</button>
          <button id="btn-quit-won" class="px-6 py-3 rounded-xl bg-white/20 text-white font-bold">Quitter</button>
        </div>
      `;
      overlayContainer.querySelector('#btn-restart').addEventListener('click', () => {
        level = 0;
        score = 0;
        currentLives = lives;
        powerUps = { wide: 0, slow: 0 };
        saveLevelToStorage();
        gameState = 'ready';
        overlayContainer.innerHTML = '';
        initLevel(level);
        wireCanvasEvents();
      });
      overlayContainer.querySelector('#btn-quit-won').addEventListener('click', () => { cleanup(); actions.onExit(); });
    } else if (gameState === 'lost') {
      overlayContainer.innerHTML = `
        <div class="text-center mt-4">
          <div class="text-4xl mb-2">\uD83D\uDC94</div>
          <div class="text-xl font-bold text-red-400 mb-2">Plus de vies !</div>
          <div class="text-purple-300 mb-4">Score : ${score}</div>
          <button id="btn-quit-lost" class="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold">Retour</button>
        </div>
      `;
      overlayContainer.querySelector('#btn-quit-lost').addEventListener('click', () => { cleanup(); actions.onExit(); });
    } else {
      overlayContainer.innerHTML = '';
    }
  }

  function wireCanvasEvents() {
    if (!canvas) return;

    // Remove old listeners by replacing canvas (simplest approach for re-wiring)
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    ctx = canvas.getContext('2d');

    const handleMove = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * (canvas.width / rect.width);
      paddle.x = Math.max(0, Math.min(W - paddle.w, x - paddle.w / 2));
      if (!ball.launched) {
        ball.x = paddle.x + paddle.w / 2;
      }
      if (!running) draw();
    };

    const handleClick = () => {
      if (gameState !== 'ready' || currentLives <= 0) return;
      if (!ball.launched) {
        ball.launched = true;
        ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -ball.speed;
        running = true;
        gameState = 'playing';
        renderOverlay();
        gameLoop();
      }
    };

    canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handleMove(e.touches[0].clientX); }, { passive: false });
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleClick(); }, { passive: false });

    draw();
  }

  function startPowerUpTimer() {
    powerUpInterval = setInterval(() => {
      let changed = false;
      if (powerUps.wide > 0) { powerUps.wide = Math.max(0, powerUps.wide - 0.1); changed = true; }
      if (powerUps.slow > 0) { powerUps.slow = Math.max(0, powerUps.slow - 0.1); changed = true; }
      if (changed) {
        applyPowerUps();
        if (!running) draw();
        // Update power-up display in HTML
        const puContainer = container.querySelector('.flex.justify-center.gap-2.mb-2');
        if (puContainer) {
          let html = '';
          if (powerUps.wide > 0) html += `<div class="text-sm py-1 px-3 rounded-full bg-green-500/30 text-green-300">\u2194\uFE0F ${Math.ceil(powerUps.wide)}s</div>`;
          if (powerUps.slow > 0) html += `<div class="text-sm py-1 px-3 rounded-full bg-blue-500/30 text-blue-300">\uD83D\uDC22 ${Math.ceil(powerUps.slow)}s</div>`;
          puContainer.innerHTML = html;
        }
      }
    }, 100);
  }

  function cleanup() {
    running = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (powerUpInterval) clearInterval(powerUpInterval);
    window.removeEventListener('keydown', handleKeyDown);
  }

  // Initialize
  renderUI();
  saveLevelToStorage();
  initLevel(level);
  startPowerUpTimer();

  return cleanup;
}
