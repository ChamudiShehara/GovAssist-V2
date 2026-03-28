// backend/src/rag/retriever.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getEmbedding, cosineSimilarity } from "./embedder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, "index.json");

let _index = null;
const MIN_CONFIDENCE = 0.45; // min hybrid score to accept suggestion

const loadIndex = () => {
  if (_index) return _index;

  if (!fs.existsSync(indexPath)) {
    throw new Error("RAG index not found. Run buildIndex.js first.");
  }

  _index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  console.log(`[RAG] Index loaded: ${_index.length} departments`);
  return _index;
};

// Keyword / synonym / example scoring
const keywordScore = (entry, query) => {
  const q = query.toLowerCase();
  let score = 0;

  for (const kw of entry.keywords || []) if (q.includes(kw.toLowerCase())) score += 2;
  for (const syn of entry.synonyms || []) if (q.includes(syn.toLowerCase())) score += 3;
  for (const ex of entry.complaintExamples || []) {
    const exWords = ex.toLowerCase().split(" ");
    const qWords = q.split(" ");
    const shared = qWords.filter((w) => w.length > 3 && exWords.includes(w)).length;
    score += shared * 0.5;
  }
  return score;
};

// Retrieve top N departments for a complaint title
export const retrieveTopDepartments = async (complaintTitle, topN = 3) => {
  const index = loadIndex();
  const queryEmbedding = await getEmbedding(complaintTitle);

  const scores = [];

  for (const entry of index) {
    let maxVectorSim = 0;
    for (const chunk of entry.chunks) {
      const sim = cosineSimilarity(queryEmbedding, chunk.embedding);
      if (sim > maxVectorSim) maxVectorSim = sim;
    }

    const kwBoost = keywordScore(entry, complaintTitle) * 0.1;
    const hybridScore = maxVectorSim * 0.6 + kwBoost * 0.4;

    scores.push({
      department: entry.department,
      description: entry.description,
      hybridScore,
      vectorScore: maxVectorSim,
      keywordBoost: kwBoost,
      complaintExamples: entry.complaintExamples.slice(0, 3),
    });
  }

  scores.sort((a, b) => b.hybridScore - a.hybridScore);

  const top = scores.slice(0, topN).filter((d) => d.hybridScore >= MIN_CONFIDENCE);

  console.log(
    `[RAG] Top matches for "${complaintTitle}":`,
    top.map((t) => `${t.department} (${t.hybridScore.toFixed(3)})`)
  );

  return top;
};

// Build text context for RAG (optional)
export const buildRagContext = async (complaintTitle) => {
  const topDepts = await retrieveTopDepartments(complaintTitle, 3);
  if (!topDepts.length) return { context: "", topDepts: [] };

  const context = topDepts
    .map(
      (d, i) =>
        `Option ${i + 1}: "${d.department}"
Description: ${d.description}
Examples: ${d.complaintExamples.join(" | ")}`
    )
    .join("\n\n");

  return { context, topDepts };
};