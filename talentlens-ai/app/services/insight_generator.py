from typing import Tuple, List

# Basic list of tech skills to look for in job descriptions
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

def generate_interview_questions(resume_text: str, job_description: str) -> Tuple[List[str], List[str]]:
    """
    Generates personalized interview questions based on the candidate's resume and JD.
    """
    # Simple template-based generation since we don't have an LLM connected.
    jd_lower = job_description.lower()
    jd_skills = [skill for skill in TECH_SKILLS if skill in jd_lower]
    
    technical = []
    if jd_skills:
        # Ask about a couple of required skills
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
