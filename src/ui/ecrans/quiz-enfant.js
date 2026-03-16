import { KIDS_FEEDBACK } from '../../domain/donnees/feedback.js';

export function initialiserQuizEnfant(container, state, actions) {
  const { questions } = state;
  let index = 0, answer = '', results = [], feedback = null, feedbackText = '', streak = 0, maxStreak = 0;
  let feedbackLocked = false;

  function render() {
    const current = questions[index];
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-purple-300 animate-fade-in">
          <div class="flex justify-between items-center mb-6">
            <button id="btn-quit" class="text-purple-400 hover:text-purple-600 text-lg transition">\u2715</button>
            ${streak >= 2 ? `<span class="text-amber-500 font-bold text-xl flex items-center gap-1 animate-pulse-slow">\u2B50 ${streak}</span>` : ''}
            <span class="text-purple-500 font-bold text-lg">${index + 1} / ${questions.length}</span>
          </div>
          <div class="flex justify-center gap-2 mb-6">
            ${results.map(r => `<div class="w-4 h-4 rounded-full ${r.correct ? 'bg-green-400' : 'bg-red-400'}"></div>`).join('')}
            ${Array(questions.length - results.length).fill(0).map(() => '<div class="w-4 h-4 rounded-full bg-purple-200"></div>').join('')}
          </div>
          <div class="text-center mb-8 transition-all duration-300 ${feedback === 'correct' ? 'scale-110' : feedback === 'wrong' ? 'animate-shake' : ''}">
            <div class="text-7xl font-bold text-purple-600 mb-2">${current.a} ${current.op} ${current.b}</div>
            <div class="text-4xl text-purple-400">= ?</div>
          </div>
          ${feedback ? `
            <div class="text-center mb-6 animate-pop">
              <div class="text-3xl font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-orange-500'}">${feedbackText}</div>
              ${feedback === 'wrong' ? `<div class="text-xl text-purple-500 mt-2">C'\u00E9tait <span class="font-bold text-purple-700">${current.answer}</span></div>` : ''}
            </div>
          ` : `
            <div>
              <input id="quiz-input" type="text" inputmode="numeric" pattern="[0-9]*" value="${answer}"
                class="w-full text-center text-6xl font-bold py-6 rounded-3xl outline-none bg-purple-50 text-purple-700 border-4 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all" placeholder="?" autocomplete="off">
              <button id="btn-validate" ${!answer ? 'disabled' : ''} class="w-full mt-6 py-5 rounded-2xl font-bold text-2xl transition-all ${
                answer ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }">\u2713 Valider</button>
            </div>
          `}
        </div>
      </div>
    `;
    wireEvents();
  }

  function wireEvents() {
    container.querySelector('#btn-quit')?.addEventListener('click', actions.onMenu);
    const input = container.querySelector('#quiz-input');
    if (input && !feedback) {
      input.focus();
      setTimeout(() => input.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      input.addEventListener('input', (e) => { answer = e.target.value.replace(/[^0-9]/g, ''); });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && answer && !feedbackLocked) handleSubmit(); });
    }
    container.querySelector('#btn-validate')?.addEventListener('click', () => { if (answer && !feedbackLocked) handleSubmit(); });
  }

  function handleSubmit() {
    if (feedbackLocked) return;
    feedbackLocked = true;
    const current = questions[index];
    const isCorrect = parseInt(answer) === current.answer;
    feedback = isCorrect ? 'correct' : 'wrong';
    const texts = isCorrect ? KIDS_FEEDBACK.correct : KIDS_FEEDBACK.wrong;
    feedbackText = texts[Math.floor(Math.random() * texts.length)];
    if (isCorrect) { streak++; maxStreak = Math.max(maxStreak, streak); } else { streak = 0; }
    results.push({ ...current, userAnswer: parseInt(answer), correct: isCorrect });
    render();
    setTimeout(nextQuestion, 2000);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      actions.onFinish(results, maxStreak);
      return;
    }
    index++;
    answer = '';
    feedback = null;
    feedbackLocked = false;
    render();
  }

  render();
}
