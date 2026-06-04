from fastapi import APIRouter
from ..core.models import (
    InterviewQuestionRequest, 
    InterviewQuestionResponse,
    EvaluateAnswerRequest,
    EvaluateAnswerResponse
)
from ..services.insight_generator import (
    generate_interview_questions,
    evaluate_candidate_answer
)

router = APIRouter()

@router.post("/interview-questions", response_model=InterviewQuestionResponse)
async def generate_questions(request: InterviewQuestionRequest):
    technical, behavioral = generate_interview_questions(request.resume_text, request.job_description)
    return InterviewQuestionResponse(
        technical=technical,
        behavioral=behavioral
    )

@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer(request: EvaluateAnswerRequest):
    score, strengths, improvements, reasoning = evaluate_candidate_answer(
        request.question, request.candidate_answer, request.job_description
    )
    return EvaluateAnswerResponse(
        score=score,
        strengths=strengths,
        improvements=improvements,
        reasoning=reasoning
    )

