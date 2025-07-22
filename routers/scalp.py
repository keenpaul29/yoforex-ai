import os
import uuid

from typing import List
from utils.security import get_current_user

from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Depends
from sqlalchemy.orm import Session

from utils.image_check import is_trading_chart
from utils.gemini_helper import analyze_image_with_gemini
from utils.db import get_db

import models
import schemas.scalp as schemas

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()


@router.post("/chart/")
async def analyze_chart(
    file: UploadFile = File(...),
    timeframe: str = Query(
        ...,
        enum=["M1", "M5", "M15", "M30", "H1"],
        description="Scalp timeframe"
    ),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1) Save upload
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] or ".png"
    path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    with open(path, "wb") as out_file:
        out_file.write(await file.read())

    # 2) Validate it’s a chart
    if not is_trading_chart(path):
        os.remove(path)
        raise HTTPException(status_code=400, detail="Please upload a valid trading chart image.")

    # 3) Analyze and cleanup
    try:
        result = analyze_image_with_gemini(path, timeframe)
    finally:
        os.remove(path)

    # 4) Persist into history
    record = models.ScalpAnalysisHistory(analysis=result, user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)

    # 5) Return the analysis JSON
    return result


@router.get("/history", response_model=List[schemas.ScalpAnalysisHistoryItem])
def get_scalp_history(
    limit: int = Query(50, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Return the most recent `limit` scalp analyses for the authenticated user, newest first.
    """
    rows = (
        db.query(models.ScalpAnalysisHistory)
          .filter(models.ScalpAnalysisHistory.user_id == current_user.id)
          .order_by(models.ScalpAnalysisHistory.created_at.desc())
          .limit(limit)
          .all()
    )
    return rows
