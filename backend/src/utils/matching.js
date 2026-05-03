const scoreRoommateMatch = (currentProfile, candidateProfile) => {
  let score = 0;

  const currentBudgetMid = (currentProfile.budgetMin + currentProfile.budgetMax) / 2;
  const candidateBudgetMid = (candidateProfile.budgetMin + candidateProfile.budgetMax) / 2;
  const budgetGap = Math.abs(currentBudgetMid - candidateBudgetMid);
  score += Math.max(0, 30 - Math.min(30, budgetGap / 1000));

  if (currentProfile.preferredLocation.toLowerCase() === candidateProfile.preferredLocation.toLowerCase()) {
    score += 20;
  }

  if (currentProfile.sleepHabit === candidateProfile.sleepHabit) {
    score += 15;
  } else if (currentProfile.sleepHabit === 'flexible' || candidateProfile.sleepHabit === 'flexible') {
    score += 8;
  }

  if (currentProfile.studyHabit === candidateProfile.studyHabit) {
    score += 15;
  } else if (currentProfile.studyHabit === 'flexible' || candidateProfile.studyHabit === 'flexible') {
    score += 8;
  }

  if (currentProfile.cleanliness === candidateProfile.cleanliness) {
    score += 10;
  }

  const sharedInterests = (currentProfile.interests || []).filter((interest) =>
    (candidateProfile.interests || []).includes(interest)
  ).length;
  score += Math.min(10, sharedInterests * 5);

  return Math.min(100, Math.round(score));
};

module.exports = { scoreRoommateMatch };
