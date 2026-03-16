// backend/src/ml/mlService.js
import axios from "axios";

const ML_URL = "http://localhost:5001";

const PRIORITY_BONUS = { HIGH: 4, MEDIUM: 2, LOW: 0 };

export const mlScoreAndSort = async (complaints) => {
  if (!complaints || complaints.length === 0) return [];

  const plain = complaints.map(c => c.toObject?.() ?? c);

  try {
    const response = await axios.post(
      `${ML_URL}/score`,
      { complaints: plain },
      { timeout: 10000 }
    );

    const { scored, model_info } = response.data;
    console.log(`[mlService] Scored ${scored.length} complaints`);
    return scored;

  } catch (err) {
    console.warn("[mlService] Python ML down — JS fallback");
    return jsFallbackSort(plain);
  }
};

// Fallback mirrors exact same formula: votes + priority_bonus
const jsFallbackSort = (complaints) => {
  const scored = complaints.map(c => ({
    ...c,
    _urgencyScore: (c.votes?.length ?? 0) + (PRIORITY_BONUS[c.priority] ?? 0),
    _rank: 0,
  }));

  scored.sort((a, b) => b._urgencyScore - a._urgencyScore);
  return scored.map((c, i) => ({ ...c, _rank: i + 1 }));
};

export const triggerRetrain = async () => {
  try {
    const res = await axios.post(`${ML_URL}/retrain`, {}, { timeout: 30000 });
    return res.data;
  } catch (err) {
    console.error("[mlService] Retrain failed:", err.message);
    throw err;
  }
};