export function initialiserAccueil(container, actions) {
  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md animate-fade-in">
        <h1 class="text-4xl font-bold text-white text-center mb-2">\uD83E\uDDEE MathQuiz</h1>
        <p class="text-purple-200 text-center mb-10">Choisis ton aventure</p>
        <div class="space-y-6">
          <button id="btn-kids" class="w-full py-8 rounded-3xl font-bold text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden group">
            <div class="absolute inset-0 shine-effect opacity-30"></div>
            <span class="text-5xl animate-float">\uD83D\uDC76</span>
            <span>Apprendre \u00E0 compter</span>
            <span class="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">GS / CP / CE1</span>
          </button>
          <button id="btn-advanced" class="w-full py-8 rounded-3xl font-bold text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden group">
            <div class="absolute inset-0 shine-effect opacity-20"></div>
            <span class="text-5xl">\uD83E\uDDE0</span>
            <span>Calcul mental avanc\u00E9</span>
            <span class="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">\u00D7, \u00F7, +, \u2212</span>
          </button>
        </div>
      </div>
    </div>
  `;
  container.querySelector('#btn-kids').addEventListener('click', actions.onKids);
  container.querySelector('#btn-advanced').addEventListener('click', actions.onAdvanced);
}
