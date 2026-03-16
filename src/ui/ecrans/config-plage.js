import { MODES } from '../../domain/donnees/difficulty.js';
import { creerSelecteurDifficulte, cablerSelecteurDifficulte } from '../composants/selecteur-difficulte.js';

export function initialiserConfigPlage(container, state, actions) {
  const modeInfo = MODES[state.mode];
  let min = 1, max = 20, difficulty = 'normal';
  const presets = [{ label: '1-20', min: 1, max: 20 }, { label: '1-50', min: 1, max: 50 }, { label: '1-100', min: 1, max: 100 }];

  function render() {
    const isValid = min >= 0 && max > min;
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 animate-fade-in">
          <button id="btn-back" class="text-blue-300 hover:text-white mb-4 transition">\u2190 Retour</button>
          <h1 class="text-2xl font-bold text-white text-center mb-2">${modeInfo.icon} ${modeInfo.label}</h1>
          <p class="text-blue-200 text-center mb-6">Configure la plage de nombres</p>
          <div class="flex gap-2 mb-6">
            ${presets.map(p => `
              <button data-preset-min="${p.min}" data-preset-max="${p.max}" class="flex-1 py-2 rounded-xl font-medium text-sm transition-all ${
                min === p.min && max === p.max ? `bg-gradient-to-r ${modeInfo.color} text-white shadow-lg` : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }">${p.label}</button>
            `).join('')}
          </div>
          <div class="flex gap-4 mb-6">
            <div class="flex-1">
              <label class="text-blue-300 text-sm mb-1 block">Min</label>
              <input id="input-min" type="number" value="${min}" class="w-full py-3 px-4 rounded-xl bg-white/10 text-white text-center font-bold outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="flex-1">
              <label class="text-blue-300 text-sm mb-1 block">Max</label>
              <input id="input-max" type="number" value="${max}" class="w-full py-3 px-4 rounded-xl bg-white/10 text-white text-center font-bold outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          ${creerSelecteurDifficulte(difficulty)}
          <button id="btn-start" ${!isValid ? 'disabled' : ''} class="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            isValid ? `bg-gradient-to-r ${modeInfo.color} text-white shadow-lg hover:scale-[1.02]` : 'bg-white/10 text-white/30 cursor-not-allowed'
          }">C'est parti ! \u2192</button>
        </div>
      </div>
    `;
    wire();
  }

  function wire() {
    container.querySelector('#btn-back').addEventListener('click', actions.onBack);
    container.querySelectorAll('[data-preset-min]').forEach(btn => {
      btn.addEventListener('click', () => { min = parseInt(btn.dataset.presetMin); max = parseInt(btn.dataset.presetMax); render(); });
    });
    container.querySelector('#input-min').addEventListener('change', (e) => { min = Math.max(0, parseInt(e.target.value) || 0); render(); });
    container.querySelector('#input-max').addEventListener('change', (e) => { max = parseInt(e.target.value) || 0; render(); });
    cablerSelecteurDifficulte(container, (d) => { difficulty = d; render(); });
    const startBtn = container.querySelector('#btn-start');
    if (startBtn && min >= 0 && max > min) {
      startBtn.addEventListener('click', () => actions.onStart({ min, max }, difficulty));
    }
  }

  render();
}
