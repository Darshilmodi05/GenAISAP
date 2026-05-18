from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.models.forecaster import Forecaster

router = APIRouter(prefix="/forecast", tags=["forecast"])
forecaster = Forecaster()

class ForecastRequest(BaseModel):
    series: List[float]
    periods: int = 3

@router.post("/predict")
async def predict(req: ForecastRequest):
    try:
        predictions = forecaster.predict_next(req.series, req.periods)
        return {
            "success": True,
            "original_series": req.series,
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
