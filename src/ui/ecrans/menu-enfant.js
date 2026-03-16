import { PUZZLES } from '../../domain/donnees/puzzles-config.js';
import { creerGrillePuzzle } from '../composants/grille-puzzle.js';
import { creerDetecteurTripleDollar } from '../../domain/cheat/detecteur-triche.js';

export function initialiserMenuEnfant(container, state, actions) {
  const { puzzleData } = state;
  const currentPuzzle = PUZZLES[puzzleData.currentPuzzle];
  const piecesCollected = puzzleData.puzzles[puzzleData.currentPuzzle].pieces.filter(p => p).length;
  const completedPuzzles = puzzleData.puzzles.filter(p => p.completed).length;
  const totalLives = puzzleData.puzzles.reduce((sum, p) => sum + (p.lives || 0), 0);

  const onCheat = creerDetecteurTripleDollar(() => actions.onCheatLives && actions.onCheatLives(99));
  const handleKeyDown = (e) => onCheat(e.key);
  window.addEventListener('keydown', handleKeyDown);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-purple-300 animate-fade-in">
        <button id="btn-back" class="text-purple-500 hover:text-purple-700 mb-4 transition text-lg">\u2190 Accueil</button>
        <h1 class="text-3xl font-bold text-purple-600 text-center mb-2">\uD83D\uDC76 Apprendre \u00E0 compter</h1>
        <p class="text-purple-400 text-center mb-6">En s'amusant !</p>
        <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
          <div class="flex justify-between items-center mb-3">
            <span class="text-amber-700 font-medium">\uD83E\uDDE9 ${currentPuzzle.name}</span>
            <span class="text-amber-600 font-bold">${piecesCollected}/9</span>
          </div>
          <div class="flex justify-center mb-2">${creerGrillePuzzle(currentPuzzle, puzzleData.puzzles[puzzleData.currentPuzzle].pieces, 'sm')}</div>
          <div class="text-center text-amber-500 text-sm">${completedPuzzles} puzzle${completedPuzzles > 1 ? 's' : ''} compl\u00E9t\u00E9${completedPuzzles > 1 ? 's' : ''}</div>
        </div>
        <button id="btn-play" class="w-full py-5 mb-4 rounded-2xl font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:scale-[1.02] transition-all animate-pulse-slow">\uD83D\uDE80 Jouer !</button>
        <button id="btn-breakout" ${totalLives === 0 ? 'disabled' : ''} class="w-full py-4 mb-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          totalLives > 0 ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-lg hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }">
          \uD83C\uDFAE Casse-Brique
          ${totalLives > 0 ? `<span class="bg-white/20 px-2 py-0.5 rounded-full text-sm">\u2764\uFE0F ${totalLives}</span>` : '<span class="text-sm font-normal">(Compl\u00E8te un puzzle !)</span>'}
        </button>
        <button id="btn-puzzles" class="w-full py-4 rounded-2xl font-bold text-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all flex items-center justify-center gap-2">\uD83E\uDDE9 Voir mes puzzles</button>
      </div>
    </div>
  `;
  container.querySelector('#btn-back').addEventListener('click', () => { window.removeEventListener('keydown', handleKeyDown); actions.onBack(); });
  container.querySelector('#btn-play').addEventListener('click', actions.onStart);
  container.querySelector('#btn-breakout').addEventListener('click', actions.onBreakout);
  container.querySelector('#btn-puzzles').addEventListener('click', actions.onPuzzles);

  return () => window.removeEventListener('keydown', handleKeyDown);
}
