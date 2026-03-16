import { ACHIEVEMENTS } from '../../domain/donnees/achievements.js';

export function initialiserStats(container, state, actions) {
  const { stats } = state;
  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto animate-fade-in">
        <button id="btn-back" class="text-blue-300 hover:text-white mb-4 transition flex items-center gap-1">\u2190 Retour</button>
        <h1 class="text-2xl font-bold text-white text-center mb-6">\uD83C\uDFC6 Statistiques</h1>
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-white/5 rounded-xl p-4 text-center"><div class="text-3xl font-bold text-white">${stats.totalScore}</div><div class="text-blue-300 text-sm">Score total</div></div>
          <div class="bg-white/5 rounded-xl p-4 text-center"><div class="text-3xl font-bold text-white">${stats.gamesPlayed}</div><div class="text-blue-300 text-sm">Parties jou\u00E9es</div></div>
          <div class="bg-white/5 rounded-xl p-4 text-center"><div class="text-3xl font-bold text-white">${accuracy}%</div><div class="text-blue-300 text-sm">Pr\u00E9cision</div></div>
          <div class="bg-white/5 rounded-xl p-4 text-center"><div class="text-3xl font-bold text-white">${stats.bestStreak}</div><div class="text-blue-300 text-sm">Meilleur streak</div></div>
          <div class="bg-white/5 rounded-xl p-4 text-center"><div class="text-3xl font-bold text-white">${stats.perfectGames}</div><div class="text-blue-300 text-sm">Parties parfaites</div></div>
          <div class="bg-white/5 rounded-xl p-4 text-center"><div class="text-3xl font-bold text-white">${stats.totalCorrect}</div><div class="text-blue-300 text-sm">Bonnes r\u00E9ponses</div></div>
        </div>
        <h2 class="text-lg font-bold text-white mb-4">\uD83C\uDF96\uFE0F Badges (${stats.achievements.length}/${Object.keys(ACHIEVEMENTS).length})</h2>
        <div class="grid grid-cols-2 gap-3 mb-6">
          ${Object.entries(ACHIEVEMENTS).map(([key, ach]) => {
            const unlocked = stats.achievements.includes(key);
            return `<div class="rounded-xl p-3 text-center transition-all ${unlocked ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/50' : 'bg-white/5 opacity-50'}">
              <div class="text-2xl mb-1 ${unlocked ? '' : 'grayscale'}">${ach.icon}</div>
              <div class="font-medium text-sm ${unlocked ? 'text-white' : 'text-blue-300'}">${ach.name}</div>
              <div class="text-xs text-blue-400">${ach.desc}</div>
            </div>`;
          }).join('')}
        </div>
        <button id="btn-reset" class="w-full py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
          R\u00E9initialiser les statistiques
        </button>
      </div>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', actions.onBack);
  container.querySelector('#btn-reset').addEventListener('click', actions.onReset);
}
