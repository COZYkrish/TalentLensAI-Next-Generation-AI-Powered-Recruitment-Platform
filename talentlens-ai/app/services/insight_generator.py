import os
import json
from typing import Tuple, List
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load env variables from .env
load_dotenv()

# Initialize Gemini Client if key is present
try:
    if os.environ.get("GEMINI_API_KEY"):
        client = genai.Client()
    else:
        client = None
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    client = None

# Basic list of tech skills to look for in job descriptions (Fallback)
TECH_SKILLS = {
    "python", "java", "react", "next.js", "spring boot", "fastapi", "sql", "aws", 
    "docker", "machine learning", "kubernetes", "typescript", "javascript", "c++", 
    "c#", "go", "ruby", "php", "html", "css", "tailwind", "node.js", "express", 
    "django", "flask", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "git", "linux", "ci/cd", "agile", "scrum", "pytorch", "tensorflow", "nlp", "cv"
}

def generate_skill_gaps(resume_skills: List[str], job_description: str) -> Tuple[List[str], str]:
    """
    Extracts required skills from JD and compares with resume skills.
    Returns (missing_skills, ai_quality_insights).
    """
    if not client:
        # Fallback to local rule-based match if Gemini client is not initialized
        jd_lower = job_description.lower()
        jd_required_skills = [skill for skill in TECH_SKILLS if skill in jd_lower]
        
        resume_skills_lower = [s.lower() for s in resume_skills]
        
        missing_skills = [skill for skill in jd_required_skills if skill not in resume_skills_lower]
        
        if not jd_required_skills:
            insight = "The candidate's skills appear adequate, though the job description lacked specific technical requirements."
        elif not missing_skills:
            insight = "Excellent fit. The candidate possesses all the core technical skills explicitly mentioned in the job description."
        elif len(missing_skills) <= 2:
            insight = f"Strong candidate. They have most of the required skills but are missing: {', '.join(missing_skills)}."
        else:
            insight = f"Potential skill gap. The candidate is missing several key skills required for the role, including: {', '.join(missing_skills)}."
            
        return missing_skills, insight

    try:
        class SkillGapAnalysis(BaseModel):
            missing_skills: List[str]
            insights: str

        prompt = f"""
        You are an expert technical recruiter. Analyze the candidate's skills and the job description to identify missing skills and provide quality insights.
        
        Candidate Skills: {', '.join(resume_skills)}
        Job Description: {job_description}
        
        Provide a concise list of critical technical skills that are missing in the candidate's list but required for the job, and write a summary insight.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SkillGapAnalysis,
            ),
        )
        data = json.loads(response.text)
        return data.get("missing_skills", []), data.get("insights", "")
    except Exception as e:
        print(f"Error calling Gemini in generate_skill_gaps: {e}")
        return [], f"AI evaluation error: {e}"

def generate_interview_questions(resume_text: str, job_description: str) -> Tuple[List[str], List[str]]:
    """
    Generates personalized interview questions based on the candidate's resume and JD.
    """
    if not client:
        # Fallback to local rule-based match if Gemini client is not initialized
        jd_lower = job_description.lower()
        jd_skills = [skill for skill in TECH_SKILLS if skill in jd_lower]
        
        technical = []
        if jd_skills:
            sample_skills = jd_skills[:2]
            for skill in sample_skills:
                technical.append(f"Can you describe a complex problem you solved using {skill.title()}?")
            technical.append("How do you ensure code quality and performance in your technical projects?")
        else:
            technical = [
                "Can you walk us through the most challenging technical project you've worked on?",
                "How do you stay updated with the latest technologies and incorporate them into your work?",
                "Describe your process for debugging a critical issue in production."
            ]
            
        behavioral = [
            "Tell me about a time you had to disagree with a team member or manager. How did you handle it?",
            "Describe a situation where you had to learn a new technology or domain very quickly to meet a deadline.",
            "How do you prioritize tasks when you have multiple competing deadlines?"
        ]
        
        return technical, behavioral

    try:
        class GeneratedQuestions(BaseModel):
            technical: List[str]
            behavioral: List[str]

        prompt = f"""
        You are an AI recruiting assistant. Generate personalized technical and behavioral interview questions based on the candidate's resume and the job description.
        Focus on checking their specific technical experience, validating their projects, and diving into areas where their skills might be weak or missing.
        
        Resume Text: {resume_text}
        Job Description: {job_description}
        
        Generate exactly 3 technical questions and 2 behavioral questions.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeneratedQuestions,
            ),
        )
        data = json.loads(response.text)
        return data.get("technical", []), data.get("behavioral", [])
    except Exception as e:
        print(f"Error calling Gemini in generate_interview_questions: {e}")
        return ["Describe a challenging technical problem you solved."], ["How do you prioritize your tasks?"]

def evaluate_candidate_answer(question: str, candidate_answer: str, job_description: str) -> Tuple[float, List[str], List[str], str]:
    """
    Evaluates candidate response to a question against job description.
    """
    if not client:
        # Mock fallback if Gemini client is not initialized
        return 75.0, ["Clear response structure", "Relates to the core requirements"], ["Provide more concrete code or design examples"], "Mock grading output because Gemini API key is not configured."

    try:
        class AnswerEvaluation(BaseModel):
            score: float
            strengths: List[str]
            improvements: List[str]
            reasoning: str

        prompt = f"""
        You are a senior technical interviewer. Evaluate the candidate's answer to the interview question, in the context of the job description.
        Grade the answer out of 100, identify key strengths in their response, identify key improvement areas or topics they missed, and write a summary reasoning.
        
        Job Description: {job_description}
        Question Asked: {question}
        Candidate Answer: {candidate_answer}
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnswerEvaluation,
            ),
        )
        data = json.loads(response.text)
        return data.get("score", 70.0), data.get("strengths", []), data.get("improvements", []), data.get("reasoning", "")
    except Exception as e:
        print(f"Error calling Gemini in evaluate_candidate_answer: {e}")
        return 50.0, [], [], f"Evaluation failure: {e}"
