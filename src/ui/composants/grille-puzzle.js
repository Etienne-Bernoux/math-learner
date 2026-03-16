import { PUZZLE_IMAGES } from '../../domain/donnees/puzzles-images.js';

export function creerGrillePuzzle(puzzle, pieces, size = 'md', animate = false) {
  const svgData = PUZZLE_IMAGES[puzzle.theme];
  const sizeClasses = { sm: 'w-24 h-24', md: 'w-48 h-48', lg: 'w-64 h-64' };

  const cells = pieces.map((unlocked, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    if (unlocked) {
      const delay = animate ? `animation-delay: ${i * 0.1}s` : '';
      const animClass = animate ? 'animate-puzzle-reveal' : '';
      return `<div class="relative overflow-hidden ${animClass}" style="${delay}">
        <div class="w-full h-full" style="background-image: url(&quot;data:image/svg+xml,${encodeURIComponent(svgData)}&quot;); background-size: 300% 300%; background-position: ${col * 50}% ${row * 50}%"></div>
      </div>`;
    }
    return `<div class="relative overflow-hidden">
      <div class="w-full h-full bg-gray-400 flex items-center justify-center text-gray-500 text-lg font-bold">?</div>
    </div>`;
  }).join('');

  return `<div class="${sizeClasses[size]} grid grid-cols-3 grid-rows-3 gap-0.5 rounded-xl overflow-hidden bg-gray-300">${cells}</div>`;
}
