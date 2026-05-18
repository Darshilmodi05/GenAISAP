from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/classify", tags=["classification"])

class Transaction(BaseModel):
    description: str
    amount: float

@router.post("/module")
async def classify_module(tx: Transaction):
    """
    Heuristic classifier mapping transaction descriptions to SAP modules.
    Scores keywords to determine the most likely institutional cluster.
    """
    desc = tx.description.lower()
    
    scores = {
        "FICO": 0,
        "MM": 0,
        "SD": 0,
        "HCM": 0
    }
    
    # FICO Keywords (Finance & Controlling)
    fico_keys = ['vendor', 'payment', 'ledger', 'audit', 'tax', 'reconciliation', 'invoice', 'asset', 'accrual']
    for k in fico_keys:
        if k in desc: scores["FICO"] += 1
        
    # MM Keywords (Materials Management)
    mm_keys = ['stock', 'inventory', 'warehouse', 'po', 'goods', 'receipt', 'procurement', 'material']
    for k in mm_keys:
        if k in desc: scores["MM"] += 1
        
    # SD Keywords (Sales & Distribution)
    sd_keys = ['order', 'shipment', 'customer', 'billing', 'delivery', 'quote', 'sales', 'return']
    for k in sd_keys:
        if k in desc: scores["SD"] += 1
        
    # Find the winning module
    best_module = max(scores, key=scores.get)
    confidence = 0.5 + (scores[best_module] * 0.1) # Heuristic confidence
    
    if scores[best_module] == 0:
        return {"module": "ROOT", "confidence": 0.4, "note": "Heuristic fallback to ROOT node"}
        
    return {
        "module": best_module,
        "confidence": min(0.99, confidence),
        "scores": scores
    }
