import { MODES } from '../../domain/donnees/difficulty.js';
import { creerSelecteurDifficulte, cablerSelecteurDifficulte } from '../composants/selecteur-difficulte.js';

export function initialiserConfigTables(container, state, actions) {
  const modeInfo = MODES[state.mode];
  let selected = new Set([2, 3, 4, 5]);
  let difficulty = 'normal';
  let maxTable = 10;

  function render() {
    const tables = maxTable === 10 ? [2,3,4,5,6,7,8,9,10] : [2,3,4,5,6,7,8,9,10,11,12];
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 animate-fade-in">
          <button id="btn-back" class="text-blue-300 hover:text-white mb-4 transition">\u2190 Retour</button>
          <h1 class="text-2xl font-bold text-white text-center mb-2">${modeInfo.icon} ${modeInfo.label}</h1>
          <p class="text-blue-200 text-center mb-6">S\u00E9lectionne les tables</p>
          <div class="flex justify-center gap-2 mb-4">
            <span class="text-blue-300 text-sm">Tables jusqu'\u00E0 :</span>
            <button data-max="10" class="px-3 py-1 rounded-lg text-sm font-medium transition-all ${maxTable === 10 ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300 hover:bg-white/20'}">10</button>
            <button data-max="12" class="px-3 py-1 rounded-lg text-sm font-medium transition-all ${maxTable === 12 ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300 hover:bg-white/20'}">12</button>
          </div>
          <div class="flex justify-center gap-2 mb-4">
            <button id="btn-all" class="text-sm text-blue-300 hover:text-white transition">Tout</button>
            <span class="text-blue-500">|</span>
            <button id="btn-none" class="text-sm text-blue-300 hover:text-white transition">Aucun</button>
          </div>
          <div class="grid gap-3 mb-6 ${maxTable === 10 ? 'grid-cols-3' : 'grid-cols-4'}">
            ${tables.map(n => `
              <button data-table="${n}" class="aspect-square rounded-xl font-bold text-lg transition-all duration-200 ${
                selected.has(n) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105' : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }">${n}</button>
            `).join('')}
          </div>
          ${creerSelecteurDifficulte(difficulty)}
          <button id="btn-start" ${selected.size === 0 ? 'disabled' : ''} class="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            selected.size > 0 ? `bg-gradient-to-r ${modeInfo.color} text-white shadow-lg hover:scale-[1.02]` : 'bg-white/10 text-white/30 cursor-not-allowed'
          }">C'est parti ! \u2192</button>
        </div>
      </div>
    `;
    wire();
  }

  function wire() {
    container.querySelector('#btn-back').addEventListener('click', actions.onBack);
    container.querySelectorAll('[data-max]').forEach(btn => {
      btn.addEventListener('click', () => {
        maxTable = parseInt(btn.dataset.max);
        if (maxTable === 10) { selected.delete(11); selected.delete(12); }
        render();
      });
    });
    container.querySelector('#btn-all').addEventListener('click', () => {
      const tables = maxTable === 10 ? [2,3,4,5,6,7,8,9,10] : [2,3,4,5,6,7,8,9,10,11,12];
      selected = new Set(tables);
      render();
    });
    container.querySelector('#btn-none').addEventListener('click', () => { selected = new Set(); render(); });
    container.querySelectorAll('[data-table]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.dataset.table);
        if (selected.has(n)) selected.delete(n); else selected.add(n);
        render();
      });
    });
    cablerSelecteurDifficulte(container, (d) => { difficulty = d; render(); });
    const startBtn = container.querySelector('#btn-start');
    if (startBtn && selected.size > 0) {
      startBtn.addEventListener('click', () => actions.onStart({ tables: Array.from(selected), maxTable }, difficulty));
    }
  }

  render();
}
