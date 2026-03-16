import { PUZZLES } from '../../domain/donnees/puzzles-config.js';
import { creerGrillePuzzle } from '../composants/grille-puzzle.js';

export function initialiserGaleriePuzzles(container, state, actions) {
  const { puzzleData } = state;
  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-purple-300 animate-fade-in">
        <button id="btn-back" class="text-purple-500 hover:text-purple-700 mb-4 transition text-lg">\u2190 Retour</button>
        <h1 class="text-3xl font-bold text-purple-600 text-center mb-2">\uD83E\uDDE9 Mes Puzzles</h1>
        <p class="text-purple-400 text-center mb-6">${puzzleData.puzzles.filter(p => p.completed).length}/${PUZZLES.length} compl\u00E9t\u00E9s</p>
        <div class="space-y-4">
          ${PUZZLES.map((puzzle, idx) => {
            const data = puzzleData.puzzles[idx];
            const piecesCount = data.pieces.filter(p => p).length;
            const isCurrent = puzzleData.currentPuzzle === idx;
            const isCompleted = data.completed;
            return `
              <button data-puzzle-idx="${idx}" class="w-full p-4 rounded-2xl transition-all ${
                isCurrent ? `bg-gradient-to-r ${puzzle.bgColor} ${puzzle.borderColor} border-4 scale-[1.02] shadow-lg`
                : isCompleted ? `bg-gradient-to-r ${puzzle.bgColor} opacity-90`
                : 'bg-gray-100 opacity-60'
              }">
                <div class="flex justify-between items-center mb-3">
                  <span class="font-bold text-lg">${isCompleted ? '\uD83C\uDFC6' : isCurrent ? '\u25B6\uFE0F' : '\uD83D\uDD12'} ${puzzle.name}</span>
                  <span class="font-medium">${piecesCount}/9</span>
                </div>
                <div class="flex justify-center">${creerGrillePuzzle(puzzle, data.pieces, 'md')}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', actions.onBack);
  container.querySelectorAll('[data-puzzle-idx]').forEach(btn => {
    btn.addEventListener('click', () => actions.onSelectPuzzle(parseInt(btn.dataset.puzzleIdx)));
  });
}
