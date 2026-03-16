import { MODES } from '../../domain/donnees/difficulty.js';

export function initialiserMenuAvance(container, state, actions) {
  const { stats } = state;
  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 animate-fade-in">
        <button id="btn-back" class="text-blue-300 hover:text-white mb-4 transition flex items-center gap-1">\u2190 Accueil</button>
        <h1 class="text-3xl font-bold text-white text-center mb-2">\uD83E\uDDE0 Calcul Mental</h1>
        <p class="text-blue-200 text-center mb-6">Choisis ton entra\u00EEnement</p>
        <div class="flex justify-center gap-6 mb-6 text-sm">
          <div class="text-center"><div class="text-2xl font-bold text-white">${stats.totalScore}</div><div class="text-blue-300">points</div></div>
          <div class="text-center"><div class="text-2xl font-bold text-white">${stats.gamesPlayed}</div><div class="text-blue-300">parties</div></div>
          <div class="text-center"><div class="text-2xl font-bold text-white">${stats.achievements.length}</div><div class="text-blue-300">badges</div></div>
        </div>
        <div class="space-y-3 mb-6">
          ${Object.entries(MODES).map(([key, mode]) => `
            <button data-mode="${key}" class="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r ${mode.color} text-white shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3">
              <span class="text-xl">${mode.icon}</span> ${mode.label}
            </button>
          `).join('')}
        </div>
        <button id="btn-stats" class="w-full py-3 rounded-2xl font-medium text-blue-300 bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
          \uD83C\uDFC6 Statistiques & Badges
        </button>
      </div>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', actions.onBack);
  container.querySelector('#btn-stats').addEventListener('click', actions.onStats);
  container.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => actions.onSelectMode(btn.dataset.mode));
  });
}
