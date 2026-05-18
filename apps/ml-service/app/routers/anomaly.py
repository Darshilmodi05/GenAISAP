from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.models.anomaly_detector import AnomalyDetector
from app.models.narrative_generator import NarrativeGenerator
from app.utils.evidence_compiler import compiler

router = APIRouter(prefix="/anomaly", tags=["anomaly"])
detector = AnomalyDetector()
narrator = NarrativeGenerator()

class AnomalyRequest(BaseModel):
    data: List[float]
    context: str = "general"
    related_modules: Dict[str, float] = {}

class PostingRequest(BaseModel):
    postings: List[Dict[str, Any]]

@router.post("/detect-spikes")
async def detect_spikes(req: AnomalyRequest):
    try:
        indices = detector.detect_spikes(req.data)
        anomalies = []
        for idx in indices:
            val = req.data[idx]
            evidence = compiler.compile_evidence(
                {"type": "Spike", "value": val},
                {"related_modules": req.related_modules, "historical_avg": sum(req.data)/len(req.data) if req.data else 0}
            )
            narrative = narrator.generate_alert_narrative("Volume Spike", evidence)
            anomalies.append({
                "index": idx,
                "value": val,
                "evidence": evidence,
                "narrative": narrative,
                "severity": "warning"
            })
        return {"success": True, "anomalies": anomalies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/find-duplicates")
async def find_duplicates(req: PostingRequest):
    try:
        duplicates = detector.find_duplicate_postings(req.postings)
        return {"success": True, "duplicates": duplicates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
