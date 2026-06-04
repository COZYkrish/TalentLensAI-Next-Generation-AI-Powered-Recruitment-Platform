import requests
import json
import time

BASE_URL = "http://localhost:8080/api/v1"

print("========================================")
print("TALENTLENS E2E INTEGRATION TEST")
print("========================================")

# 1. Register Recruiter
print("\n1. Registering Recruiter...")
recruiter_data = {
    "name": "Jane Recruiter",
    "email": f"recruiter_{int(time.time())}@example.com",
    "password": "password123",
    "companyName": "Tech Corp",
    "role": "RECRUITER"
}
res = requests.post(f"{BASE_URL}/auth/register", json=recruiter_data)
print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")
assert res.status_code == 200, f"Recruiter registration failed: {res.text}"
recruiter_token = res.json()["token"]
recruiter_id = res.json()["id"]
print(f"Success! Token length: {len(recruiter_token)}")

# 2. Register Candidate
print("\n2. Registering Candidate...")
candidate_data = {
    "name": "John Doe",
    "email": f"candidate_{int(time.time())}@example.com",
    "password": "password123",
    "role": "CANDIDATE"
}
res = requests.post(f"{BASE_URL}/auth/register", json=candidate_data)
assert res.status_code == 200, f"Candidate registration failed: {res.text}"
candidate_token = res.json()["token"]
candidate_id = res.json()["id"]
print(f"Success! Candidate ID: {candidate_id}")

# 3. Create Job (as Recruiter)
print("\n3. Creating Job (as Recruiter)...")
job_data = {
    "title": "Senior Full Stack Engineer",
    "department": "Engineering",
    "location": "Remote",
    "description": "We are looking for a Senior Full Stack Engineer. You must be proficient in React, Next.js, Java, and Spring Boot.",
    "requirements": "5+ years of experience with React, Java, and PostgreSQL. Docker experience is a plus."
}
headers = {"Authorization": f"Bearer {recruiter_token}"}
res = requests.post(f"{BASE_URL}/jobs", json=job_data, headers={"Authorization": f"Bearer {recruiter_token}"})
print(f"Job Status Code: {res.status_code}")
print(f"Job Response: {res.text}")
assert res.status_code == 200, f"Job creation failed: {res.text}"
job_id = res.json()["id"]
print(f"✅ Success! Job ID: {job_id}")

# 4. Apply for Job (as Candidate)
print("\n4. Submitting Application & Calling AI Service...")
print("This step automatically calls FastAPI to parse the PDF and generate match scores.")
with open("mock_resume.pdf", "rb") as f:
    files = {"resume": ("mock_resume.pdf", f, "application/pdf")}
    data = {"candidateId": str(candidate_id)}
    headers_cand = {"Authorization": f"Bearer {candidate_token}"}
    res = requests.post(f"{BASE_URL}/applications/job/{job_id}/apply", data=data, files=files, headers=headers_cand)

assert res.status_code == 200, f"Application failed: {res.text}"
app_response = res.json()
app_id = app_response["id"]
print("✅ Application submitted successfully!")
print(f"   AI Match Score: {app_response.get('aiMatchScore')}%")

# 5. Fetch Interview Questions (as Recruiter)
print("\n5. Fetching AI Interview Questions (as Recruiter)...")
res = requests.get(f"{BASE_URL}/applications/{app_id}/interview-questions", headers=headers)
assert res.status_code == 200, f"Failed to fetch interview questions: {res.text}"
questions = res.json().get("questions", [])
print(f"✅ Success! Generated {len(questions)} interview questions.")
for i, q in enumerate(questions[:2], 1):
    print(f"   Q{i} [{q['type']}]: {q['question']}")
if len(questions) > 2:
    print("   ...")

# 6. Schedule Interview (as Recruiter)
print("\n6. Scheduling Interview (as Recruiter)...")
interview_data = {
    "applicationId": app_id,
    "dateTime": "2026-06-05T10:00:00",
    "duration": "45 min",
    "type": "VIDEO",
    "interviewers": ["John D.", "Jane S."]
}
res = requests.post(f"{BASE_URL}/interviews", json=interview_data, headers=headers)
print(f"Status Code: {res.status_code}")
assert res.status_code == 200, f"Interview scheduling failed: {res.text}"
interview_id = res.json()["id"]
print(f"✅ Success! Interview ID: {interview_id}, Status: {res.json()['status']}")

# 7. Complete Interview & Submit Feedback (as Recruiter)
print("\n7. Completing Interview & Submitting Feedback (as Recruiter)...")
feedback_data = {
    "score": 92,
    "feedbackNotes": "Excellent system architecture responses. Fast learner."
}
res = requests.put(f"{BASE_URL}/interviews/{interview_id}/feedback", json=feedback_data, headers=headers)
print(f"Status Code: {res.status_code}")
assert res.status_code == 200, f"Feedback submission failed: {res.text}"
assert res.json()["status"] == "COMPLETED", f"Expected COMPLETED status but got: {res.json()['status']}"
print(f"✅ Success! Interview Status: {res.json()['status']}, Score: {res.json()['score']}%")

# 8. Evaluate Candidate Practice Response (as Candidate)
print("\n8. Evaluating Candidate Practice Answer (as Candidate)...")
practice_data = {
    "question": "Can you describe a complex problem you solved using React?",
    "answer": "I built a large scale dashboard with virtualization rendering 10000 nodes, reducing paint times by 40% using useMemo and memoized components."
}
res = requests.post(
    f"{BASE_URL}/applications/{app_id}/evaluate-answer", 
    json=practice_data, 
    headers={"Authorization": f"Bearer {candidate_token}"}
)
print(f"Status Code: {res.status_code}")
assert res.status_code == 200, f"Practice answer evaluation failed: {res.text}"
eval_result = res.json()
print(f"✅ Success! AI Practice Score: {eval_result.get('score')}%")
print(f"   AI Strengths: {eval_result.get('strengths')}")
print(f"   AI Improvement Areas: {eval_result.get('improvements')}")
print(f"   AI Reasoning: {eval_result.get('reasoning')}")

print("\n🎉 ALL E2E TESTS PASSED! FULL PIPELINE VERIFIED! 🎉")
