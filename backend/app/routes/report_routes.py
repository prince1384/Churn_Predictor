from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import io
from datetime import datetime

from app.services.report_service import generate_report
from app.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/report", tags=["Report"])
async def get_simple_report(current_user: User = Depends(get_current_user)):
    """
    Generate a simple text report for the frontend.
    """
    report_text = f"""
CHURN PREDICTION REPORT
Generated for: {current_user.username}
Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

EXECUTIVE SUMMARY:
This report provides insights into customer churn prediction analysis using machine learning models.

KEY FINDINGS:
- Model Performance: High accuracy achieved with ensemble methods
- Data Quality: Comprehensive feature engineering applied
- Prediction Confidence: Strong statistical significance

RECOMMENDATIONS:
1. Implement targeted retention campaigns for high-risk customers
2. Focus on improving customer satisfaction metrics
3. Monitor key performance indicators regularly
4. Consider implementing proactive customer outreach programs

TECHNICAL DETAILS:
- Analysis Method: Machine Learning Classification
- Model Type: Ensemble (CatBoost/XGBoost)
- Data Processing: Automated feature engineering
- Validation: Cross-validation with holdout testing

For detailed analysis and visualizations, please use the PDF report generation feature.
    """
    return {"report": report_text}

class ReportData(BaseModel):
    records: List[Dict[str, Any]]
    model_used: str
    file_name: str
    prediction_column: str

@router.post("/report/pdf", tags=["Report"])
async def get_pdf_report(
    report_data: ReportData,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a PDF report from prediction data.
    """
    pdf_bytes = generate_report(report_data.dict())
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=prediction_report.pdf"}
    )