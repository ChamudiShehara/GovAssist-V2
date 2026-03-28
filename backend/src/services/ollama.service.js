import axios from "axios";
import { buildRagContext } from "../rag/retriever.js";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3";

// 🔥 Garbage input detection
const isGarbageInput = (text) => {
  const cleaned = text.replace(/[^a-zA-Z]/g, "");

  if (cleaned.length < 3) return true;

  const uniqueChars = new Set(cleaned.toLowerCase());
  if (uniqueChars.size <= 2) return true;

  return false;
};

export const getDepartmentSuggestion = async (complaintTitle) => {
  try {
    // 🔥 Step 1: Garbage check
    if (isGarbageInput(complaintTitle)) {
      console.log("[AI] ❌ Garbage input");
      return { department: null };
    }

    console.log(`[RAG] Retrieving context for: "${complaintTitle}"`);
    const { context, topDepts } = await buildRagContext(complaintTitle);

    // 🔥 Step 2: No match
    if (!topDepts.length) {
      console.log("[RAG] ❌ No match");
      return { department: null };
    }

    // 🔥 Step 3: High confidence → skip LLM
    if (topDepts[0].hybridScore > 0.85) {
      return { department: topDepts[0].department };
    }

    // 🔥 Step 4: LLM fallback
    const prompt = `You are a Sri Lankan complaint routing assistant.

Choose the best department.

Options:
${topDepts.map((d) => d.department).join(", ")}

Complaint: "${complaintTitle}"

Answer ONLY the department name.`;

    const response = await axios.post(OLLAMA_URL, {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    });

    const rawText = response.data?.response?.trim();

    if (!rawText) {
      return { department: topDepts[0].department };
    }

    const llmSuggestion = rawText
      .replace(/['"\.]/g, "")
      .trim()
      .toLowerCase();

    const validated = topDepts.find(
      (d) => d.department.toLowerCase() === llmSuggestion
    );

    if (validated) {
      return { department: validated.department };
    }

    // fallback
    return { department: topDepts[0].department };

  } catch (error) {
    console.error("[getDepartmentSuggestion] Error:", error.message);
    throw error;
  }
};