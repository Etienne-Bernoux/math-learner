import { PUZZLES } from '../../domain/donnees/puzzles-config.js';
import { creerGrillePuzzle } from '../composants/grille-puzzle.js';
import { getKidsMessage } from '../../domain/quiz/score.js';
import { lancerConfetti } from '../composants/confetti.js';

export function initialiserResultatEnfant(container, state, actions) {
  const { results, puzzleData, earnedPiece, newPieceIndex, puzzleJustCompleted } = state;
  const correctCount = results.filter(r => r.correct).length;
  const percent = Math.round((correctCount / results.length) * 100);
  const msg = getKidsMessage(percent);
  const stars = Math.ceil((correctCount / results.length) * 5);
  const currentPuzzle = PUZZLES[puzzleData.currentPuzzle];
  const piecesCount = puzzleData.puzzles[puzzleData.currentPuzzle].pieces.filter(p => p).length;

  if (percent === 100) lancerConfetti(60);

  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-purple-300 animate-fade-in text-center">
        <div class="text-8xl mb-4 animate-pop">${msg.emoji}</div>
        <div class="flex justify-center gap-2 mb-4">
          ${[1,2,3,4,5].map(i => `
            <span class="text-4xl ${i <= stars ? 'animate-star-pop' : 'opacity-30'}" ${i <= stars ? `style="animation-delay: ${(i-1)*0.15}s"` : ''}>${i <= stars ? '\u2B50' : '\u2606'}</span>
          `).join('')}
        </div>
        <div class="text-4xl font-bold mb-2 ${msg.color}">${msg.text}</div>
        <div class="text-2xl text-purple-500 mb-4">${correctCount} / ${results.length} bonnes r\u00E9ponses</div>
        <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
          <div class="flex justify-between items-center mb-3">
            <span class="text-amber-700 font-medium">\uD83E\uDDE9 ${currentPuzzle.name}</span>
            <span class="text-amber-600 font-bold">${piecesCount}/9</span>
          </div>
          <div class="flex justify-center mb-3">${creerGrillePuzzle(currentPuzzle, puzzleData.puzzles[puzzleData.currentPuzzle].pieces, 'sm')}</div>
          ${earnedPiece && newPieceIndex && newPieceIndex.length > 0
            ? `<div class="text-green-600 font-bold text-center">+${newPieceIndex.length} pi\u00E8ce${newPieceIndex.length > 1 ? 's' : ''} ! ${percent === 100 ? '\uD83C\uDF1F' : '\u2728'}</div>`
            : percent < 70 ? '<div class="text-gray-500 text-sm text-center">\u226570% = 1 pi\u00E8ce \u00B7 100% = 2 pi\u00E8ces</div>'
            : '<div class="text-amber-600 text-sm text-center">Puzzle complet ! \uD83C\uDF89</div>'
          }
        </div>
        <div class="bg-purple-50 rounded-2xl p-4 mb-6 max-h-32 overflow-y-auto">
          ${results.map(r => `
            <div class="flex justify-between items-center py-1 text-lg ${r.correct ? 'text-green-600' : 'text-red-500'}">
              <span>${r.a} ${r.op} ${r.b} = ${r.answer}</span>
              <span>${r.correct ? '\u2713' : '\u2717'}</span>
            </div>
          `).join('')}
        </div>
        <div class="space-y-3">
          <button id="btn-restart" class="w-full py-5 rounded-2xl font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:scale-[1.02] transition-all">\uD83D\uDD04 Rejouer</button>
          <button id="btn-menu" class="w-full py-4 rounded-2xl font-bold text-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all">\u2190 Menu</button>
        </div>
      </div>
    </div>
  `;
  container.querySelector('#btn-restart').addEventListener('click', actions.onRestart);
  container.querySelector('#btn-menu').addEventListener('click', actions.onMenu);
}
