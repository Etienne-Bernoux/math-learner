import { MODES, DIFFICULTY } from '../../domain/donnees/difficulty.js';

export function initialiserQuiz(container, state, actions) {
  const { mode, questions, difficulty } = state;
  const modeInfo = MODES[mode];
  const config = DIFFICULTY[difficulty];
  let index = 0, answer = '', timer = config.timer, results = [], feedback = null, streak = 0, maxStreak = 0;
  let feedbackLocked = false;
  let timerInterval = null;
  let cleanupFns = [];

  function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
    cleanupFns.forEach(fn => fn());
    cleanupFns = [];
  }

  function render() {
    cleanup();
    const current = questions[index];
    const timerPercent = config.timer > 0 ? (timer / config.timer) * 100 : 0;
    const timerColor = timer <= 3 ? 'bg-red-500' : timer <= 5 ? 'bg-yellow-500' : 'bg-green-500';

    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <button id="btn-quit" class="text-blue-400 hover:text-white text-sm transition">\u2715 Quitter</button>
            ${streak >= 2 ? `<span class="text-amber-400 font-bold text-sm flex items-center gap-1 animate-pulse-slow">\uD83D\uDD25 ${streak}</span>` : ''}
            <span class="text-blue-300 font-medium">${index + 1} / ${questions.length}</span>
            <div class="flex gap-1">
              ${results.map(r => `<div class="w-2 h-2 rounded-full ${r.correct ? 'bg-green-400' : 'bg-red-400'}"></div>`).join('')}
              ${Array(questions.length - results.length).fill(0).map(() => '<div class="w-2 h-2 rounded-full bg-white/20"></div>').join('')}
            </div>
          </div>
          ${config.timer > 0 ? `
            <div class="h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
              <div class="h-full ${timerColor} transition-all duration-1000 ease-linear" style="width: ${timerPercent}%"></div>
            </div>
          ` : '<div class="flex justify-center mb-6"><span class="text-blue-400 text-sm bg-blue-500/10 px-3 py-1 rounded-full">Mode Zen \u2014 sans limite de temps</span></div>'}
          <div class="text-center mb-8 transition-all duration-300 ${feedback === 'correct' ? 'scale-105' : feedback === 'wrong' ? 'animate-shake' : ''}">
            <div class="text-5xl font-bold text-white mb-2">${current.a} ${modeInfo.symbol} ${current.b}</div>
            <div class="text-2xl text-blue-300">= ?</div>
          </div>
          <div>
            <input id="quiz-input" type="text" inputmode="numeric" pattern="[0-9-]*" value="${answer}" ${feedback ? 'disabled' : ''}
              class="w-full text-center text-4xl font-bold py-4 rounded-2xl outline-none transition-all duration-300 ${
                feedback === 'correct' ? 'bg-green-500/30 text-green-300 border-2 border-green-500'
                : feedback === 'wrong' ? 'bg-red-500/30 text-red-300 border-2 border-red-500'
                : 'bg-white/10 text-white border-2 border-transparent focus:border-blue-500'
              }" placeholder="?" autocomplete="off">
            ${feedback ? `
              <div class="text-center mt-4 text-xl font-bold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}">
                ${feedback === 'correct' ? '\u2713 Correct !' : `\u2717 C'\u00E9tait ${current.answer}`}
              </div>
            ` : `
              <button id="btn-validate" ${!answer ? 'disabled' : ''} class="w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                answer ? `bg-gradient-to-r ${modeInfo.color} text-white hover:shadow-lg` : 'bg-white/10 text-white/30 cursor-not-allowed'
              }">Valider</button>
            `}
          </div>
        </div>
      </div>
    `;
    wireEvents();
  }

  function wireEvents() {
    container.querySelector('#btn-quit')?.addEventListener('click', () => { cleanup(); actions.onMenu(); });

    const input = container.querySelector('#quiz-input');
    if (input && !feedback) {
      input.focus();
      setTimeout(() => input.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      const onInput = (e) => { answer = e.target.value.replace(/[^0-9-]/g, ''); };
      const onKeydown = (e) => { if (e.key === 'Enter' && answer && !feedbackLocked) handleSubmit(); };
      input.addEventListener('input', onInput);
      input.addEventListener('keydown', onKeydown);
      cleanupFns.push(() => { input.removeEventListener('input', onInput); input.removeEventListener('keydown', onKeydown); });
    }

    container.querySelector('#btn-validate')?.addEventListener('click', () => { if (answer && !feedbackLocked) handleSubmit(); });

    // Timer
    if (config.timer > 0 && !feedbackLocked) {
      timerInterval = setInterval(() => {
        timer--;
        if (timer <= 0) { handleTimeout(); return; }
        const bar = container.querySelector('.h-full.transition-all');
        if (bar) {
          const pct = (timer / config.timer) * 100;
          bar.style.width = pct + '%';
          bar.className = `h-full transition-all duration-1000 ease-linear ${timer <= 3 ? 'bg-red-500' : timer <= 5 ? 'bg-yellow-500' : 'bg-green-500'}`;
        }
      }, 1000);
    }
  }

  function handleSubmit() {
    if (feedbackLocked) return;
    feedbackLocked = true;
    const current = questions[index];
    const isCorrect = parseInt(answer) === current.answer;
    feedback = isCorrect ? 'correct' : 'wrong';
    if (isCorrect) { streak++; maxStreak = Math.max(maxStreak, streak); } else { streak = 0; }
    results.push({ ...current, userAnswer: parseInt(answer), correct: isCorrect });
    render();
    setTimeout(nextQuestion, 1200);
  }

  function handleTimeout() {
    if (feedbackLocked) return;
    feedbackLocked = true;
    const current = questions[index];
    if (answer) {
      const isCorrect = parseInt(answer) === current.answer;
      feedback = isCorrect ? 'correct' : 'wrong';
      if (isCorrect) { streak++; maxStreak = Math.max(maxStreak, streak); } else { streak = 0; }
      results.push({ ...current, userAnswer: parseInt(answer), correct: isCorrect });
    } else {
      feedback = 'wrong';
      streak = 0;
      results.push({ ...current, userAnswer: null, correct: false });
    }
    render();
    setTimeout(nextQuestion, 1200);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      cleanup();
      actions.onFinish(results, maxStreak);
      return;
    }
    index++;
    answer = '';
    timer = config.timer;
    feedback = null;
    feedbackLocked = false;
    render();
  }

  render();
  return cleanup;
}
