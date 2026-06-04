from pydantic import BaseModel
from typing import Optional, List

class ParseResumeResponse(BaseModel):
    text: str
    skills: List[str]
    education: List[str]
    experience: List[str]

class MatchScoreRequest(BaseModel):
    resume_text: str
    job_description: str

class MatchScoreResponse(BaseModel):
    match_score: float
    missing_skills: List[str]
    ai_quality_insights: str
    reasoning: Optional[str] = None

class InterviewQuestionRequest(BaseModel):
    resume_text: str
    job_description: str

class InterviewQuestionResponse(BaseModel):
    technical: List[str]
    behavioral: List[str]

class EvaluateAnswerRequest(BaseModel):
    question: str
    candidate_answer: str
    job_description: str

class EvaluateAnswerResponse(BaseModel):
    score: float
    strengths: List[str]
    improvements: List[str]
    reasoning: str

