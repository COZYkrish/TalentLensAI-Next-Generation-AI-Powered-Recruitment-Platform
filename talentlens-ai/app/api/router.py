from fastapi import APIRouter
from . import parse, score, interview

router = APIRouter()
router.include_router(parse.router, tags=["Resume Parsing"])
router.include_router(score.router, tags=["AI Scoring"])
router.include_router(interview.router, tags=["AI Interview Questions"])
