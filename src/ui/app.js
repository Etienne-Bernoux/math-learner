import { chargerStats, sauvegarderStats, chargerPuzzles, sauvegarderPuzzles, statsParDefaut } from '../domain/persistence/storage.js';
import { genererQuestions } from '../domain/quiz/generer-questions.js';
import { verifierAchievements } from '../domain/achievements/verifier.js';
import { attribuerPieces } from '../domain/puzzles/progression.js';
import { calculerScore } from '../domain/quiz/score.js';
import { DIFFICULTY } from '../domain/donnees/difficulty.js';

import { initialiserAccueil } from './ecrans/accueil.js';
import { initialiserMenuAvance } from './ecrans/menu-avance.js';
import { initialiserStats } from './ecrans/stats.js';
import { initialiserConfigTables } from './ecrans/config-tables.js';
import { initialiserConfigPlage } from './ecrans/config-plage.js';
import { initialiserQuiz } from './ecrans/quiz.js';
import { initialiserResultat } from './ecrans/resultat.js';
import { initialiserMenuEnfant } from './ecrans/menu-enfant.js';
import { initialiserConfigEnfant } from './ecrans/config-enfant.js';
import { initialiserQuizEnfant } from './ecrans/quiz-enfant.js';
import { initialiserResultatEnfant } from './ecrans/resultat-enfant.js';
import { initialiserGaleriePuzzles } from './ecrans/galerie-puzzles.js';
import { initialiserBreakout } from './ecrans/breakout.js';

const root = document.getElementById('root');
let cleanupFn = null;

// State
let stats = chargerStats();
let puzzleData = chargerPuzzles();
let mode = null;
let gameConfig = null;
let difficulty = 'normal';
let questions = [];
let results = [];
let newAchievements = [];
let earnedPiece = false;
let newPieceIndex = [];
let puzzleJustCompleted = false;

function navigate(screen) {
  if (cleanupFn) { cleanupFn(); cleanupFn = null; }

  switch (screen) {
    case 'home':
      mode = null; newAchievements = []; earnedPiece = false; puzzleJustCompleted = false;
      initialiserAccueil(root, { onKids: () => navigate('kids-menu'), onAdvanced: () => navigate('menu') });
      break;

    case 'menu':
      initialiserMenuAvance(root, { stats }, {
        onBack: () => navigate('home'),
        onStats: () => navigate('stats'),
        onSelectMode: (m) => { mode = m; navigate('config'); },
      });
      break;

    case 'stats':
      initialiserStats(root, { stats }, {
        onBack: () => navigate('menu'),
        onReset: () => {
          if (confirm('R\u00E9initialiser toutes les statistiques ?')) {
            stats = statsParDefaut();
            sauvegarderStats(stats);
            navigate('stats');
          }
        },
      });
      break;

    case 'config':
      if (mode === 'multiplication' || mode === 'division') {
        initialiserConfigTables(root, { mode }, {
          onBack: () => navigate('menu'),
          onStart: (config, diff) => { gameConfig = config; difficulty = diff; questions = genererQuestions(mode, config); results = []; navigate('quiz'); },
        });
      } else {
        initialiserConfigPlage(root, { mode }, {
          onBack: () => navigate('menu'),
          onStart: (config, diff) => { gameConfig = config; difficulty = diff; questions = genererQuestions(mode, config); results = []; navigate('quiz'); },
        });
      }
      break;

    case 'quiz':
      cleanupFn = initialiserQuiz(root, { mode, questions, difficulty }, {
        onFinish: (quizResults, maxStreak) => {
          results = quizResults;
          const correctCount = quizResults.filter(r => r.correct).length;
          const isPerfect = correctCount === quizResults.length;
          const score = calculerScore(correctCount, difficulty);
          const unlocked = verifierAchievements(stats, { results: quizResults, difficulty, currentStreak: maxStreak });
          newAchievements = unlocked;
          stats = {
            ...stats, totalScore: stats.totalScore + score, gamesPlayed: stats.gamesPlayed + 1,
            perfectGames: stats.perfectGames + (isPerfect ? 1 : 0), bestStreak: Math.max(stats.bestStreak, maxStreak),
            totalCorrect: stats.totalCorrect + correctCount, totalQuestions: stats.totalQuestions + quizResults.length,
            achievements: [...stats.achievements, ...unlocked],
          };
          sauvegarderStats(stats);
          navigate('result');
        },
        onMenu: () => navigate('menu'),
      });
      break;

    case 'result':
      initialiserResultat(root, { mode, results, difficulty, newAchievements }, {
        onRestart: () => { questions = genererQuestions(mode, gameConfig); results = []; newAchievements = []; navigate('quiz'); },
        onConfig: () => navigate('config'),
        onMenu: () => { mode = null; newAchievements = []; navigate('menu'); },
      });
      break;

    case 'kids-menu':
      cleanupFn = initialiserMenuEnfant(root, { puzzleData }, {
        onBack: () => navigate('home'),
        onStart: () => navigate('kids-config'),
        onBreakout: () => {
          const totalLives = puzzleData.puzzles.reduce((sum, p) => sum + (p.lives || 0), 0);
          if (totalLives > 0) navigate('breakout');
        },
        onPuzzles: () => navigate('puzzles'),
        onCheatLives: (amount) => {
          puzzleData.puzzles[0].lives = (puzzleData.puzzles[0].lives || 0) + amount;
          sauvegarderPuzzles(puzzleData);
          navigate('kids-menu');
        },
      });
      break;

    case 'kids-config':
      initialiserConfigEnfant(root, {
        onBack: () => navigate('kids-menu'),
        onStart: (config) => {
          gameConfig = config; mode = 'kids'; difficulty = 'zen';
          questions = genererQuestions('kids', config); results = [];
          earnedPiece = false; newPieceIndex = []; puzzleJustCompleted = false;
          navigate('kids-quiz');
        },
      });
      break;

    case 'kids-quiz':
      initialiserQuizEnfant(root, { questions }, {
        onFinish: (quizResults, maxStreak) => {
          results = quizResults;
          const correctCount = quizResults.filter(r => r.correct).length;
          const percent = Math.round((correctCount / quizResults.length) * 100);
          const result = attribuerPieces(puzzleData, percent);
          puzzleData = result.puzzleData;
          earnedPiece = result.piecesEarned > 0;
          newPieceIndex = result.pieceIndices;
          puzzleJustCompleted = result.justCompleted;
          sauvegarderPuzzles(puzzleData);
          stats = {
            ...stats, totalScore: stats.totalScore + correctCount * 5, gamesPlayed: stats.gamesPlayed + 1,
            perfectGames: stats.perfectGames + (correctCount === quizResults.length ? 1 : 0),
            bestStreak: Math.max(stats.bestStreak, maxStreak),
            totalCorrect: stats.totalCorrect + correctCount, totalQuestions: stats.totalQuestions + quizResults.length,
          };
          sauvegarderStats(stats);
          navigate('kids-result');
        },
        onMenu: () => navigate('kids-menu'),
      });
      break;

    case 'kids-result':
      initialiserResultatEnfant(root, { results, puzzleData, earnedPiece, newPieceIndex, puzzleJustCompleted }, {
        onRestart: () => {
          questions = genererQuestions('kids', gameConfig); results = [];
          earnedPiece = false; newPieceIndex = []; puzzleJustCompleted = false;
          navigate('kids-quiz');
        },
        onMenu: () => navigate('kids-menu'),
      });
      break;

    case 'puzzles':
      initialiserGaleriePuzzles(root, { puzzleData }, {
        onBack: () => navigate('kids-menu'),
        onSelectPuzzle: (idx) => {
          if (!puzzleData.puzzles[idx].completed || puzzleData.currentPuzzle === idx) {
            puzzleData.currentPuzzle = idx;
            sauvegarderPuzzles(puzzleData);
          }
          navigate('puzzles');
        },
      });
      break;

    case 'breakout': {
      const totalLives = puzzleData.puzzles.reduce((sum, p) => sum + (p.lives || 0), 0);
      cleanupFn = initialiserBreakout(root, { lives: totalLives, puzzleData }, {
        onLoseLife: () => {
          for (const p of puzzleData.puzzles) {
            if (p.lives > 0) { p.lives--; break; }
          }
          sauvegarderPuzzles(puzzleData);
        },
        onExit: () => navigate('kids-menu'),
      });
      break;
    }
  }
}

// Start
navigate('home');
