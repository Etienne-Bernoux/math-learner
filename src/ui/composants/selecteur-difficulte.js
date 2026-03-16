import { DIFFICULTY } from '../../domain/donnees/difficulty.js';

export function creerSelecteurDifficulte(selected = 'normal') {
  return `<div class="mb-8">
    <p class="text-blue-200 text-center text-sm mb-3">Difficulte</p>
    <div class="flex gap-2">
      ${Object.entries(DIFFICULTY).map(([key, val]) => `
        <button data-difficulty="${key}" class="flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
          selected === key
            ? `bg-gradient-to-r ${val.color} text-white shadow-lg scale-105`
            : 'bg-white/10 text-blue-200 hover:bg-white/20'
        }">
          <div>${val.label}</div>
          <div class="text-xs opacity-75">${val.timer === 0 ? '\u221E' : val.timer + 's'} \u00B7 x${val.multiplier}</div>
        </button>
      `).join('')}
    </div>
  </div>`;
}

export function cablerSelecteurDifficulte(container, onChange) {
  container.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => onChange(btn.dataset.difficulty));
  });
}
