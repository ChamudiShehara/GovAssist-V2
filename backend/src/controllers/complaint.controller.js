import Complaint from "../models/Complaint.js";
import Citizen from "../models/Citizen.js";
import Department from "../models/Department.js";
import { buildRagContext } from "../rag/retriever.js"; // 🔥 use new RAG service
import { mlScoreAndSort } from "../ml/mlService.js";

// ----------------- Department Matching -----------------
const matchDepartment = (departments, suggestedName) => {
  if (!suggestedName) return null;

  const normalize = (str) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

  const stripSpaces = (str) => normalize(str).replace(/\s/g, "");

  const suggested = normalize(suggestedName);
  const suggestedNoSpace = stripSpaces(suggestedName);

  // 1️⃣ Exact match
  let match = departments.find((d) => normalize(d.name) === suggested);
  if (match) return match;

  // 2️⃣ Match ignoring spaces
  match = departments.find((d) => stripSpaces(d.name) === suggestedNoSpace);
  if (match) return match;

  // 3️⃣ Substring match (partial)
  match = departments.find(
    (d) =>
      suggested.includes(normalize(d.name)) ||
      normalize(d.name).includes(suggested)
  );
  if (match) return match;

  // 4️⃣ Shared words match
  const suggestedWords = suggested.split(" ").filter((w) => w.length > 2);
  let bestMatch = null,
    bestScore = 0;

  for (const dept of departments) {
    const deptWords = normalize(dept.name).split(" ").filter((w) => w.length > 2);
    const shared = suggestedWords.filter((w) =>
      deptWords.some((dw) => dw.includes(w) || w.includes(dw))
    ).length;

    if (shared > bestScore) {
      bestScore = shared;
      bestMatch = dept;
    }
  }

  // Only accept meaningful partial match
  if (bestMatch && bestScore >= 2) return bestMatch;

  // ❌ No confident match
  return null;
};

// ----------------- Add Complaint -----------------
export const addComplaint = async (req, res) => {
  const { title, description, phoneNumber, address, district, department, priority } =
    req.body;

  try {
    if (!req.user)
      return res.status(401).json({ error: "Citizen not authenticated" });

    const citizen = req.user;
    let departmentId = department || null;

    // Auto-suggest department if not selected manually
    if (!departmentId) {
      try {
        const allDepartments = await Department.find({});
        const suggestion = await buildRagContext(title); // 🔥 use RAG
        const matched = matchDepartment(allDepartments, suggestion?.topDepts?.[0]?.department);

        if (matched) departmentId = matched._id;
        // If no match, leave null → frontend prompts manual selection
      } catch (err) {
        console.warn("RAG fallback failed during addComplaint:", err.message);
      }
    }

    const newComplaint = new Complaint({
      citizen: citizen._id,
      name: citizen.name,
      email: citizen.email,
      title,
      description,
      phoneNumber,
      address,
      district,
      department: departmentId,
      priority,
    });

    await newComplaint.save();
    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (error) {
    console.error("Error adding complaint:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Suggest Department -----------------
export const suggestDepartment = async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim())
    return res.status(400).json({ error: "Title is required" });

  try {
    const allDepartments = await Department.find({});
    if (!allDepartments.length)
      return res.status(404).json({ error: "No departments available in database" });

    const suggestion = await buildRagContext(title); // 🔥 use RAG
    const suggestedName = suggestion?.topDepts?.[0]?.department;

    console.log(`[Controller] RAG suggested: "${suggestedName}"`);
    console.log(
      `[Controller] DB departments: ${allDepartments.map((d) => d.name).join(", ")}`
    );

    const matched = matchDepartment(allDepartments, suggestedName);

    res.json({
      suggestedDepartment: matched ? matched.name : null,
      suggestedDepartmentId: matched ? matched._id : null,
      message: matched
        ? "Department matched successfully"
        : "No matching department found. Please select manually.",
    });
  } catch (err) {
    console.error("[suggestDepartment] ERROR:", err.message);
    res.status(500).json({ error: "Error suggesting department", detail: err.message });
  }
};

// ----------------- Delete Complaint -----------------
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Update Complaint Status -----------------
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json({ message: "Complaint status updated", complaint });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Get Complaints By Citizen -----------------
export const getComplaintsByCitizen = async (req, res) => {
  try {
    const citizenId = req.user.id;
    const complaints = await Complaint.find({ citizen: citizenId })
      .populate("department", "name")
      .exec();
    if (!complaints.length) return res.status(404).json({ error: "No complaints found" });
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Get Complaints By Department -----------------
export const getComplaintsByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const complaints = await Complaint.find({ department: departmentId })
      .populate("department", "name")
      .populate("citizen", "name")
      .exec();

    if (!complaints.length)
      return res.status(404).json({ error: "No complaints found for this department" });

    const sorted = await mlScoreAndSort(complaints);
    console.log(`[Controller] Returning ${sorted.length} sorted complaints`);

    res.json(sorted);
  } catch (error) {
    console.error("Error fetching complaints by department:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Vote Complaint -----------------
export const voteComplaint = async (req, res) => {
  const { complaintId, voteType } = req.body;
  try {
    const citizen = req.user;
    if (!citizen) return res.status(401).json({ error: "Citizen not authenticated" });

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (complaint.votes.includes(citizen._id))
      return res.status(400).json({ error: "You have already voted on this complaint" });

    complaint.votes.push(citizen._id);
    await complaint.save();

    res.json({ message: `Complaint ${voteType}d successfully`, complaint });
  } catch (error) {
    console.error("Error voting on complaint:", error);
    res.status(500).json({ error: "Server error" });
  }
};