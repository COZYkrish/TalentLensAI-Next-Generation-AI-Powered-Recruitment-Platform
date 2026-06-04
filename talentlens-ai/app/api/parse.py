from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.resume_parser import extract_text_from_pdf
from ..services.skill_extractor import extract_entities
from ..core.models import ParseResumeResponse

router = APIRouter()

@router.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    text = extract_text_from_pdf(content)
    entities = extract_entities(text)
    
    return ParseResumeResponse(
        text=text,
        skills=entities["skills"],
        experience=entities["experience"],
        education=entities["education"]
    )
