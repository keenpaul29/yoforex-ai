import os
import uuid
from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from utils.security import get_current_user

from utils.image_check import is_trading_chart
from utils.gemini_helper import analyze_image_with_gemini
from utils.db import get_db

import models
import schemas.swing as schemas

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()

@router.post("/chart/")
async def analyze_chart(
    file: UploadFile = File(...),
    timeframe: str = Query(..., enum=["H1", "D1", "W1"], description="Swing timeframe"),
    db: Session = Depends(get_db)
):
    # 1) Save upload
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] or ".png"
    path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    with open(path, "wb") as out:
        out.write(await file.read())

    # 2) Validate it’s a chart
    if not is_trading_chart(path):
        os.remove(path)
        raise HTTPException(400, detail="Please upload a valid trading chart image.")

    # 3) Analyze and cleanup
    try:
        result = analyze_image_with_gemini(path, timeframe)
    finally:
        os.remove(path)

    
    # 4) Persist into history
    # NOTE: No user_id is set here since upload is not user-specific anymore. You may want to set a default user or handle this differently if user_id is required.
    # record = models.SwingAnalysisHistory(analysis=result, user_id=current_user.id)
    # db.add(record)
    # db.commit()
    # db.refresh(record)

    # 5) Return the analysis JSON
    return result



@router.get("/history",  response_model=List[schemas.SwingAnalysisHistoryItem])
def get_swing_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Return the most recent `limit` analyses for the authenticated user, newest first.
    """
    rows = (
        db.query(models.SwingAnalysisHistory)
          .filter(models.SwingAnalysisHistory.user_id == current_user.id)
          .order_by(models.SwingAnalysisHistory.created_at.desc())
          .limit(limit)
          .all()
    )
    return rows