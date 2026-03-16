export function creerPuzzlesDefaut() {
  return {
    currentPuzzle: 0,
    puzzles: Array.from({ length: 10 }, (_, id) => ({
      id, pieces: Array(9).fill(false), completed: false, lives: 0,
    })),
  };
}

export function attribuerPieces(puzzleData, percent) {
  if (percent < 70) return { puzzleData, piecesEarned: 0, pieceIndices: [], justCompleted: false };

  const piecesToEarn = percent === 100 ? 2 : 1;
  const idx = puzzleData.currentPuzzle;
  const pieces = [...puzzleData.puzzles[idx].pieces];
  const pieceIndices = [];

  for (let i = 0; i < piecesToEarn; i++) {
    const missingIdx = pieces.findIndex(p => !p);
    if (missingIdx !== -1) {
      pieces[missingIdx] = true;
      pieceIndices.push(missingIdx);
    }
  }

  if (pieceIndices.length === 0) return { puzzleData, piecesEarned: 0, pieceIndices: [], justCompleted: false };

  const newPuzzles = JSON.parse(JSON.stringify(puzzleData));
  newPuzzles.puzzles[idx].pieces = pieces;

  const allPiecesNow = pieces.every(p => p);
  let justCompleted = false;
  if (allPiecesNow) {
    newPuzzles.puzzles[idx].completed = true;
    newPuzzles.puzzles[idx].lives = 5;
    justCompleted = true;
    const nextIncomplete = newPuzzles.puzzles.findIndex((p, i) => i !== idx && !p.completed);
    if (nextIncomplete !== -1) newPuzzles.currentPuzzle = nextIncomplete;
  }

  return { puzzleData: newPuzzles, piecesEarned: pieceIndices.length, pieceIndices, justCompleted };
}
