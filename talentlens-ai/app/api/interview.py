from fastapi import APIRouter
from ..core.models import InterviewQuestionRequest, InterviewQuestionResponse
from ..services.insight_generator import generate_interview_questions

router = APIRouter()

@router.post("/interview-questions", response_model=InterviewQuestionResponse)
async def generate_questions(request: InterviewQuestionRequest):
    technical, behavioral = generate_interview_questions(request.resume_text, request.job_description)
    return InterviewQuestionResponse(
        technical=technical,
        behavioral=behavioral
    )
