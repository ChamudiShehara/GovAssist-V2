# backend/src/ml/python/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import load_or_train, predict_scores, train
import traceback

app = Flask(__name__)
CORS(app)

print("[ML Service] Loading model on startup...")
pipeline = load_or_train()
print("[ML Service] Ready.")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "complaint-ml-scorer",
        "scoring": "votes + priority_bonus (HIGH=4, MEDIUM=2, LOW=0)"
    })

@app.route("/score", methods=["POST"])
def score():
    global pipeline
    try:
        data       = request.get_json()
        complaints = data.get("complaints", [])

        if not complaints:
            return jsonify({"error": "No complaints provided"}), 400

        scores = predict_scores(pipeline, complaints)

        scored = []
        for complaint, s in zip(complaints, scores):
            scored.append({**complaint, "_urgencyScore": round(float(s), 4)})

        scored.sort(key=lambda c: c["_urgencyScore"], reverse=True)

        for i, c in enumerate(scored):
            c["_rank"] = i + 1

        print(f"[ML] Scored {len(scored)} complaints")
        print(f"[ML] Top 3: {[(c.get('title','?')[:30], c['_urgencyScore']) for c in scored[:3]]}")

        return jsonify({
            "scored": scored,
            "model_info": {
                "type": "RandomForest",
                "scoring": "votes + priority_bonus",
                "bonuses": {"HIGH": 4, "MEDIUM": 2, "LOW": 0},
                "n_complaints": len(scored),
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/retrain", methods=["POST"])
def retrain():
    global pipeline
    try:
        pipeline = train()
        return jsonify({
            "message": "Model retrained from dataset.csv",
            "scoring": "votes + priority_bonus (HIGH=4, MEDIUM=2, LOW=0)",
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("[ML Service] Starting on http://localhost:5001")
    app.run(port=5001, debug=False)