export function initialiserConfigEnfant(container, actions) {
  let addOps = new Set([1, 2, 3]);
  let subOps = new Set();
  let min = 10, max = 30;
  const presets = [{ label: '10-20', min: 10, max: 20, desc: 'D\u00E9butant' }, { label: '10-50', min: 10, max: 50, desc: 'GS/CP' }, { label: '20-100', min: 20, max: 100, desc: 'CP/CE1' }];

  function render() {
    const canStart = addOps.size > 0 || subOps.size > 0;
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-purple-300 animate-fade-in max-h-[90vh] overflow-y-auto">
          <button id="btn-back" class="text-purple-500 hover:text-purple-700 mb-4 transition text-lg">\u2190 Retour</button>
          <h1 class="text-3xl font-bold text-purple-600 text-center mb-2">\u2699\uFE0F Param\u00E8tres</h1>
          <p class="text-purple-400 text-center mb-6">Personnalise ton entra\u00EEnement</p>
          <div class="mb-6">
            <p class="text-green-600 text-center font-bold mb-3">\u2795 Additions</p>
            <div class="flex justify-center gap-2">
              ${[1,2,3,4,5].map(n => `
                <button data-add="${n}" class="w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200 ${addOps.has(n) ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'}">+${n}</button>
              `).join('')}
            </div>
          </div>
          <div class="mb-6">
            <p class="text-orange-600 text-center font-bold mb-3">\u2796 Soustractions</p>
            <div class="flex justify-center gap-2">
              ${[1,2,3,4,5].map(n => `
                <button data-sub="${n}" class="w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200 ${subOps.has(n) ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'}">-${n}</button>
              `).join('')}
            </div>
          </div>
          <div class="mb-6">
            <p class="text-purple-500 text-center font-medium mb-3">\uD83D\uDCCA Plage de nombres</p>
            <div class="flex gap-2">
              ${presets.map(p => `
                <button data-preset-min="${p.min}" data-preset-max="${p.max}" class="flex-1 py-3 rounded-xl font-medium transition-all ${min === p.min && max === p.max ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg scale-105' : 'bg-purple-100 text-purple-500 hover:bg-purple-200'}">
                  <div class="text-lg">${p.label}</div><div class="text-xs opacity-75">${p.desc}</div>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="flex gap-4 mb-8">
            <div class="flex-1"><label class="text-purple-400 text-sm mb-1 block text-center">De</label><input id="input-min" type="number" value="${min}" class="w-full py-3 px-4 rounded-xl bg-purple-50 text-purple-700 text-center font-bold text-xl outline-none focus:ring-4 focus:ring-purple-300 border-2 border-purple-200"></div>
            <div class="flex-1"><label class="text-purple-400 text-sm mb-1 block text-center">\u00C0</label><input id="input-max" type="number" value="${max}" class="w-full py-3 px-4 rounded-xl bg-purple-50 text-purple-700 text-center font-bold text-xl outline-none focus:ring-4 focus:ring-purple-300 border-2 border-purple-200"></div>
          </div>
          <button id="btn-start" ${!canStart ? 'disabled' : ''} class="w-full py-5 rounded-2xl font-bold text-2xl transition-all ${canStart ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}">\uD83D\uDE80 C'est parti !</button>
        </div>
      </div>
    `;
    wire();
  }

  function wire() {
    container.querySelector('#btn-back').addEventListener('click', actions.onBack);
    container.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.dataset.add);
        if (addOps.has(n)) { if (addOps.size > 1 || subOps.size > 0) addOps.delete(n); } else addOps.add(n);
        render();
      });
    });
    container.querySelectorAll('[data-sub]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.dataset.sub);
        if (subOps.has(n)) subOps.delete(n); else subOps.add(n);
        if (subOps.size === 0 && addOps.size === 0) addOps.add(1);
        render();
      });
    });
    container.querySelectorAll('[data-preset-min]').forEach(btn => {
      btn.addEventListener('click', () => { min = parseInt(btn.dataset.presetMin); max = parseInt(btn.dataset.presetMax); render(); });
    });
    container.querySelector('#input-min').addEventListener('change', (e) => { min = Math.max(1, parseInt(e.target.value) || 1); render(); });
    container.querySelector('#input-max').addEventListener('change', (e) => { max = Math.max(min + 1, parseInt(e.target.value) || min + 1); render(); });
    const startBtn = container.querySelector('#btn-start');
    if (startBtn && (addOps.size > 0 || subOps.size > 0)) {
      startBtn.addEventListener('click', () => actions.onStart({ addOperations: Array.from(addOps), subOperations: Array.from(subOps), min, max }));
    }
  }

  render();
}
