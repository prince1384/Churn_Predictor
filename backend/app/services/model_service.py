import os
import pandas as pd
from catboost import CatBoostClassifier

# ✅ Dynamically resolve model path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "models", "catboost_model.cbm")

model = None

def load_model():
    """
    Load the CatBoost model from the models directory.
    """
    global model
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Did you train & save it?"
        )
    model = CatBoostClassifier()
    model.load_model(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")

def predict_from_csv(csv_file: str, output_dir: str = None):
    """
    Make predictions from a CSV file using the loaded model and save the result.
    """
    if model is None:
        raise RuntimeError("❌ Model is not loaded. Call load_model() first.")

    # Load CSV into dataframe
    data = pd.read_csv(csv_file)

    # Run predictions
    preds = model.predict(data)
    # Probabilities for binary classification (prob of class 1/churn)
    try:
        proba = model.predict_proba(data)
        # CatBoost returns shape (n_samples, 2); take probability of positive class
        churn_prob = proba[:, 1]
    except Exception:
        churn_prob = None

    # Create result DataFrame by augmenting original data so the UI can show full rows
    result_df = data.copy()
    result_df.insert(0, "User_ID", [f"U{i+1:04d}" for i in range(len(result_df))])
    result_df["Predicted_Target"] = preds
    if churn_prob is not None:
        result_df["churn_probability"] = churn_prob

    # If output_dir is provided, save CSV there
    if output_dir:
        output_path = f"{output_dir}/predicted.csv"
        result_df.to_csv(output_path, index=False)
        return output_path

    # Otherwise, just return the DataFrame
    return result_df
# ✅ Load model on import
load_model()
