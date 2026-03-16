import { MODES, DIFFICULTY } from '../../domain/donnees/difficulty.js';
import { ACHIEVEMENTS } from '../../domain/donnees/achievements.js';
import { calculerScore, getMessage } from '../../domain/quiz/score.js';
import { lancerConfetti } from '../composants/confetti.js';

export function initialiserResultat(container, state, actions) {
  const { mode, results, difficulty, newAchievements } = state;
  const modeInfo = MODES[mode];
  const diffConfig = DIFFICULTY[difficulty];
  const correctCount = results.filter(r => r.correct).length;
  const score = calculerScore(correctCount, difficulty);
  const percent = Math.round((correctCount / results.length) * 100);
  const msg = getMessage(percent);

  if (percent === 100) lancerConfetti(50);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 animate-fade-in">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4 animate-pop">${msg.emoji}</div>
          <div class="text-5xl font-bold text-white mb-1">+${score} pts</div>
          <div class="text-lg text-blue-300 mb-1">${correctCount}/${results.length} \u00B7 ${diffConfig.label} (x${diffConfig.multiplier})</div>
          <div class="text-xl text-blue-200">${msg.text}</div>
        </div>
        ${newAchievements.length > 0 ? `
          <div class="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl p-4 mb-6 border border-amber-500/30 animate-pop">
            <div class="text-amber-300 font-bold text-center mb-3">\uD83C\uDF89 ${newAchievements.length > 1 ? 'Nouveaux badges !' : 'Nouveau badge !'}</div>
            <div class="flex justify-center gap-4">
              ${newAchievements.map(key => {
                const ach = ACHIEVEMENTS[key];
                return `<div class="text-center"><div class="text-3xl mb-1 animate-pulse-slow">${ach.icon}</div><div class="text-white font-medium text-sm">${ach.name}</div></div>`;
              }).join('')}
            </div>
          </div>
        ` : ''}
        <div class="bg-white/5 rounded-2xl p-4 mb-6 max-h-40 overflow-y-auto">
          ${results.map((r, i) => `
            <div class="flex justify-between items-center py-2 ${i > 0 ? 'border-t border-white/10' : ''}">
              <span class="text-blue-200">${r.a} ${modeInfo.symbol} ${r.b} = ${r.answer}</span>
              <span class="${r.correct ? 'text-green-400' : 'text-red-400'}">${r.correct ? '\u2713' : `\u2717 ${r.userAnswer ?? '\u2014'}`}</span>
            </div>
          `).join('')}
        </div>
        <div class="space-y-3">
          <button id="btn-restart" class="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r ${modeInfo.color} text-white hover:shadow-lg transition-all">Rejouer \u21BB</button>
          <button id="btn-config" class="w-full py-3 rounded-2xl font-medium text-blue-300 bg-white/10 hover:bg-white/20 transition-all">Modifier les param\u00E8tres</button>
          <button id="btn-menu" class="w-full py-3 rounded-2xl font-medium text-blue-400 hover:text-white transition-all">\u2190 Menu principal</button>
        </div>
      </div>
    </div>
  `;
  container.querySelector('#btn-restart').addEventListener('click', actions.onRestart);
  container.querySelector('#btn-config').addEventListener('click', actions.onConfig);
  container.querySelector('#btn-menu').addEventListener('click', actions.onMenu);
}
