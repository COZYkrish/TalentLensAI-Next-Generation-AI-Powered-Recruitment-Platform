import fitz  # PyMuPDF

doc = fitz.open()
page = doc.new_page()

text = """
John Doe
Senior Software Engineer
Email: john.doe@example.com

EXPERIENCE
Software Engineer at Tech Corp (2020 - 2024)
- Developed responsive web applications using React, Next.js, and TypeScript.
- Implemented robust REST APIs using Java and Spring Boot.

SKILLS
- JavaScript, TypeScript, Python, Java
- React, Next.js, Tailwind CSS
- Spring Boot, Docker, PostgreSQL

EDUCATION
B.S. Computer Science - University of State (2016-2020)
"""

page.insert_text((50, 50), text)
doc.save("mock_resume.pdf")
print("mock_resume.pdf created successfully.")
