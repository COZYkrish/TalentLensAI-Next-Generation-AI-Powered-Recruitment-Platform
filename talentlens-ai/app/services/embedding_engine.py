from sentence_transformers import SentenceTransformer
import numpy as np

# Load a lightweight pre-trained model for sentence embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

def calculate_match_score(resume_text: str, job_description: str) -> float:
    """
    Calculates the semantic match score between a resume and a job description.
    Uses sentence-transformers to generate embeddings and calculate cosine similarity.
    """
    if not resume_text or not job_description:
        return 0.0

    # Generate embeddings
    embeddings = model.encode([resume_text, job_description])
    
    # Calculate cosine similarity
    resume_emb = embeddings[0]
    jd_emb = embeddings[1]
    
    similarity = np.dot(resume_emb, jd_emb) / (np.linalg.norm(resume_emb) * np.linalg.norm(jd_emb))
    
    # Scale similarity to roughly [0, 100] range for easier interpretation
    score = max(0.0, float(similarity) * 100)
    
    return round(score, 2)

