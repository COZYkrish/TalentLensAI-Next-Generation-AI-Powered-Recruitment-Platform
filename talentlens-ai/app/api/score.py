from fastapi import APIRouter
from ..core.models import MatchScoreRequest, MatchScoreResponse
from ..services.embedding_engine import calculate_match_score
from ..services.skill_extractor import extract_entities
from ..services.insight_generator import generate_skill_gaps

router = APIRouter()

@router.post("/match-score", response_model=MatchScoreResponse)
async def match_score(request: MatchScoreRequest):
    # 1. Semantic match score
    score = calculate_match_score(request.resume_text, request.job_description)
    
    # 2. Skill Gap Analysis
    entities = extract_entities(request.resume_text)
    missing_skills, insights = generate_skill_gaps(entities["skills"], request.job_description)
    
    return MatchScoreResponse(
        match_score=score,
        missing_skills=missing_skills,
        ai_quality_insights=insights,
        reasoning="Semantic similarity and skill gap analysis combined."
    )

