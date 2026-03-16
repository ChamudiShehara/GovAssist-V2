# backend/src/ml/python/model.py
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import FunctionTransformer
import joblib
import os

MODEL_PATH   = os.path.join(os.path.dirname(__file__), "complaint_model.pkl")
DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.csv")

PRIORITY_MAP   = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}
PRIORITY_BONUS = {"HIGH": 4, "MEDIUM": 2, "LOW": 0}

# ── Compute raw score (votes + priority_bonus) ─────────────────────────────────

def compute_raw_score(votes: int, priority: str) -> float:
    return float(votes) + float(PRIORITY_BONUS.get(priority, 0))

# ── Extract single feature: raw_score ─────────────────────────────────────────

def extract_features(complaints: list[dict]) -> np.ndarray:
    """
    Single feature: raw_score = votes + priority_bonus
    Model learns to map this to urgency_score (0-1)
    """
    rows = []
    for c in complaints:
        votes    = len(c.get("votes", []))
        priority = c.get("priority", "MEDIUM")
        raw      = compute_raw_score(votes, priority)
        rows.append([raw])
    return np.array(rows, dtype=float)

# ── Extract features + labels from CSV ────────────────────────────────────────

def extract_features_from_csv(df: pd.DataFrame):
    """
    Compute raw_score from CSV votes + priority_bonus
    Model learns: raw_score → urgency_score
    """
    rows = []
    for _, row in df.iterrows():
        votes    = float(row["votes"])
        priority = str(row["priority"]).strip()
        raw      = compute_raw_score(int(votes), priority)
        rows.append([raw])

    X = np.array(rows, dtype=float)
    y = df["urgency_score"].astype(float).values
    return X, y

# ── Build pipeline ─────────────────────────────────────────────────────────────

def build_pipeline() -> Pipeline:
    return Pipeline([
        ("model", RandomForestRegressor(
            n_estimators=300,
            max_depth=10,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1,
        )),
    ])

# ── Load CSV ───────────────────────────────────────────────────────────────────

def load_csv() -> tuple:
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"dataset.csv not found at {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    df.columns = df.columns.str.strip()

    required = {"votes", "priority", "urgency_score"}
    missing  = required - set(df.columns)
    if missing:
        raise ValueError(f"dataset.csv missing columns: {missing}")

    print(f"[ML] Loaded dataset.csv — {len(df)} rows")
    print(f"[ML] Urgency range: {df['urgency_score'].min():.2f} – {df['urgency_score'].max():.2f}")
    print(f"[ML] Priority counts:\n{df['priority'].value_counts().to_string()}")

    # Show sample raw scores
    for _, row in df.head(5).iterrows():
        raw = compute_raw_score(int(row["votes"]), str(row["priority"]).strip())
        print(f"[ML] Sample: votes={int(row['votes'])} priority={row['priority']} "
              f"raw_score={raw} urgency={row['urgency_score']}")

    return extract_features_from_csv(df)

# ── Train ──────────────────────────────────────────────────────────────────────

def train() -> Pipeline:
    pipeline = build_pipeline()
    X, y     = load_csv()

    if len(y) >= 10:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        pipeline.fit(X_train, y_train)
        r2 = pipeline.score(X_test, y_test)
        print(f"[ML] ✅ Trained — R² {r2:.3f} "
              f"({len(X_train)} train / {len(X_test)} test)")
    else:
        pipeline.fit(X, y)
        print(f"[ML] ✅ Trained — {len(y)} samples")

    joblib.dump(pipeline, MODEL_PATH)
    print(f"[ML] Model saved → {MODEL_PATH}")

    return pipeline

# ── Load or train ──────────────────────────────────────────────────────────────

def load_or_train() -> Pipeline:
    csv_exists   = os.path.exists(DATASET_PATH)
    model_exists = os.path.exists(MODEL_PATH)

    if not csv_exists:
        raise FileNotFoundError("dataset.csv not found — cannot train")

    if not model_exists:
        print("[ML] No saved model — training now...")
        return train()

    csv_mtime   = os.path.getmtime(DATASET_PATH)
    model_mtime = os.path.getmtime(MODEL_PATH)

    if csv_mtime > model_mtime:
        print("[ML] CSV updated — retraining...")
        return train()

    print(f"[ML] Loading saved model from {MODEL_PATH}")
    return joblib.load(MODEL_PATH)

# ── Predict ────────────────────────────────────────────────────────────────────

def predict_scores(pipeline: Pipeline, complaints: list[dict]) -> list[float]:
    """
    Uses trained Random Forest to predict urgency scores.
    Input: raw_score = votes + priority_bonus
    Output: urgency_score 0.0-1.0 learned from dataset.csv
    """
    X      = extract_features(complaints)
    scores = pipeline.predict(X)
    return np.clip(scores, 0, 1).tolist()