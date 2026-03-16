export function lancerConfetti(count = 50) {
  const colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171'];
  const container = document.createElement('div');
  container.className = 'confetti-container';

  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}%`;
    c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    const size = 8 + Math.random() * 8;
    c.style.width = `${size}px`;
    c.style.height = `${size}px`;
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.animationDelay = `${Math.random() * 0.5}s`;
    c.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(c);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 5000);
}
