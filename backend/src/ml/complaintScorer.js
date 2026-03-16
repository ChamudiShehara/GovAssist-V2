// backend/src/ml/complaintScorer.js
// JS fallback scorer — used when Python ML service is unavailable

const PRIORITY_SCORE = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const STATUS_SCORE   = { PENDING: 3, IN_PROGRESS: 2, RESOLVED: 1, REJECTED: 0 };

const extractFeatures = (complaint, maxVotes = 1, maxAgeDays = 30) => {
  const votes = complaint.votes?.length || 0;
  const priority = PRIORITY_SCORE[complaint.priority] || 2;
  const status   = STATUS_SCORE[complaint.status] ?? 3; // Defaults to PENDING (3)
  
  const ageMs = Date.now() - new Date(complaint.createdAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  const votesNorm    = Math.min(votes / Math.max(maxVotes, 1), 1);
  const priorityNorm = (priority - 1) / 2; // Norm to 0 - 1
  const recencyNorm  = Math.max(0, 1 - ageDays / Math.max(maxAgeDays, 1));
  const statusNorm   = status / 3;         // Norm to 0 - 1

  // Feature vector: [votes, priority, recency, status]
  return [votesNorm, priorityNorm, recencyNorm, statusNorm];
};

const generateLabels = (featureMatrix) =>
  featureMatrix.map(([votes, priority, recency, status]) =>
    0.30 * votes + 0.40 * priority + 0.20 * recency + 0.10 * status
  );

const trainModel = (featureMatrix, labels, options = {}) => {
  const { lr = 0.1, epochs = 500 } = options;
  const n = featureMatrix.length;
  
  // Default weights if no data
  if (n === 0) return { weights: [0.30, 0.40, 0.20, 0.10], bias: 0 };

  let weights = [0.25, 0.25, 0.25, 0.25];
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let dw = [0, 0, 0, 0], db = 0;
    for (let i = 0; i < n; i++) {
      const features = featureMatrix[i];
      const pred = features.reduce((s, f, j) => s + f * weights[j], bias);
      const err  = pred - labels[i];
      
      dw = dw.map((d, j) => d + (err * features[j]) / n);
      db += err / n;
    }
    weights = weights.map((w, j) => w - lr * dw[j]);
    bias -= lr * db;
  }
  return { weights, bias };
};

export const scoreAndSortComplaints = (complaints) => {
  if (!complaints || complaints.length === 0) {
    return { scored: [], model_info: null };
  }

  // Handle single complaint gracefully
  if (complaints.length === 1) {
    const single = { ...((complaints[0].toObject) ? complaints[0].toObject() : complaints[0]), _urgencyScore: 0.5, _rank: 1 };
    return {
      scored: [single],
      model_info: { note: "JS Fallback - Single complaint" }
    };
  }

  const maxVotes = Math.max(...complaints.map((c) => c.votes?.length || 0), 1);
  const maxAgeDays = Math.max(
    ...complaints.map((c) => {
      const ageMs = Date.now() - new Date(c.createdAt).getTime();
      return ageMs / (1000 * 60 * 60 * 24);
    }), 1
  );

  const featureMatrix = complaints.map((c) => extractFeatures(c, maxVotes, maxAgeDays));
  const labels        = generateLabels(featureMatrix);
  const { weights, bias } = trainModel(featureMatrix, labels);

  // Map to features array to match Python naming format
  const importances = {
    votes: Math.max(0, weights[0]),
    priority: Math.max(0, weights[1]),
    recency: Math.max(0, weights[2]),
    status: Math.max(0, weights[3])
  };

  console.log(`[ML-JS Fallback] weights — votes: ${importances.votes.toFixed(3)}, priority: ${importances.priority.toFixed(3)}, recency: ${importances.recency.toFixed(3)}, status: ${importances.status.toFixed(3)}`);

  // Calculate scores
  let scored = complaints.map((complaint, i) => {
    const features = featureMatrix[i];
    const score = Math.max(0, features.reduce((s, f, j) => s + f * weights[j], bias));
    return {
      ...(complaint.toObject ? complaint.toObject() : complaint),
      _urgencyScore: score,
    };
  });

  // Sort by Urgency Score, then Tie-Break by Vote Count
  scored.sort((a, b) => {
    if (Math.abs(b._urgencyScore - a._urgencyScore) > 0.0001) {
      return b._urgencyScore - a._urgencyScore;
    }
    return (b.votes?.length || 0) - (a.votes?.length || 0);
  });

  // Append Rank
  scored = scored.map((c, i) => ({ ...c, _rank: i + 1 }));

  return {
    scored,
    model_info: {
      n_complaints: scored.length,
      feature_importances: importances,
      note: "JS Fallback Linear Regression"
    }
  };
};