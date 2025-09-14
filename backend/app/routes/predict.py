from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from fastapi.responses import JSONResponse
import os
import pandas as pd
from datetime import datetime
from enum import Enum

from app.services.model_service import predict_from_csv
from app.auth import get_current_user
from app.models.user import User

router = APIRouter()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

class ModelChoice(str, Enum):
    general = "General"
    life_insurance = "Life_Insurance"
    automobile_insurance = "Automobile_Insurance"

@router.post("/csv", tags=["Prediction"])
async def predict_csv(
    model_choice: ModelChoice = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)  # 👈 ensures JWT auth
):
    """
    Upload a CSV → run ML model → return predictions as JSON.
    Only accessible if user is authenticated (JWT required).
    """

    model_mapping = {
        ModelChoice.general: "catboost_model.cbm",
        ModelChoice.life_insurance: "life_insurance.cbm",
        ModelChoice.automobile_insurance: "automobile_insurance.joblib",
    }
    model_name = model_mapping[model_choice]

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Run prediction with ML model → CSV file path
    output_csv = predict_from_csv(file_path, model_name, OUTPUT_DIR)

    # Convert output CSV to JSON
    df = pd.read_csv(output_csv)
    records = df.to_dict(orient="records")  # [{col1:val1, col2:val2}, ...]

    # Determine prediction column robustly
    candidate_prediction_columns = [
        "prediction",
        "Predicted_Target",
        "predicted",
        "Predicted",
        "target",
        "label",
    ]

    prediction_col = next((c for c in candidate_prediction_columns if c in df.columns), None)

    if prediction_col is None:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Prediction column not found in output CSV.",
                "expected_any_of": candidate_prediction_columns,
                "available_columns": list(df.columns),
                "output_csv": output_csv,
            },
        )

    # Example: return class distribution for pie chart
    class_counts = df[prediction_col].value_counts().to_dict()

    return JSONResponse(content={
        "user": current_user.username,
        "timestamp": datetime.now().isoformat(),
        "records": records,           # full prediction rows
        "class_distribution": class_counts,  # for pie chart
        "prediction_column": prediction_col,
        "model_used": model_name,
    })