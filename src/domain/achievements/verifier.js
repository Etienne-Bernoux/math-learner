export function verifierAchievements(stats, gameData) {
  const newAchievements = [];
  const { results, difficulty, currentStreak } = gameData;
  const correctCount = results.filter(r => r.correct).length;
  const isPerfect = correctCount === results.length;

  if (!stats.achievements.includes('first_game')) newAchievements.push('first_game');
  if (isPerfect && !stats.achievements.includes('perfect')) newAchievements.push('perfect');
  if (isPerfect && difficulty === 'expert' && !stats.achievements.includes('speed_demon')) newAchievements.push('speed_demon');
  if (currentStreak >= 5 && !stats.achievements.includes('streak_5')) newAchievements.push('streak_5');
  if (currentStreak >= 10 && !stats.achievements.includes('streak_10')) newAchievements.push('streak_10');
  if (stats.gamesPlayed + 1 >= 10 && !stats.achievements.includes('veteran')) newAchievements.push('veteran');
  if (stats.gamesPlayed + 1 >= 50 && !stats.achievements.includes('master')) newAchievements.push('master');
  if (isPerfect && stats.perfectGames + 1 >= 5 && !stats.achievements.includes('perfectionist')) newAchievements.push('perfectionist');
  if (stats.totalCorrect + correctCount >= 500 && !stats.achievements.includes('scholar')) newAchievements.push('scholar');
  if (stats.fastAnswers >= 10 && !stats.achievements.includes('lightning')) newAchievements.push('lightning');

  return newAchievements;
}
