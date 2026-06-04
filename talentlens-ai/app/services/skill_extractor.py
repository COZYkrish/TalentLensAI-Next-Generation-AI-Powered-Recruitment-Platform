import re
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# ── Tech skills dictionary ────────────────────────────────────────────
COMMON_SKILLS = {
    "python", "java", "react", "next.js", "spring boot", "fastapi", "sql", "aws",
    "docker", "machine learning", "kubernetes", "typescript", "javascript", "c++",
    "c#", "go", "ruby", "php", "html", "css", "tailwind", "node.js", "express",
    "django", "flask", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "git", "linux", "ci/cd", "agile", "scrum", "pytorch", "tensorflow", "nlp", "cv",
    "graphql", "rest api", "microservices", "azure", "gcp", "firebase", "sqlite",
    "pandas", "numpy", "scikit-learn", "keras", "hadoop", "spark", "kafka",
    "jenkins", "github actions", "terraform", "ansible", "bash", "powershell",
    "rust", "kotlin", "swift", "flutter", "react native", "vue.js", "angular",
    "spring", "hibernate", "jpa", "junit", "selenium", "jest", "cypress",
    "unity", "unreal engine", "blender", "figma", "sketch", "adobe xd",
    "jira", "confluence", "trello", "notion", "slack", "postman", "swagger",
    "elasticsearch", "cassandra", "dynamodb", "neo4j", "rabbitmq", "celery",
    "nginx", "apache", "webrtc", "socket.io", "grpc", "protobuf", "jwt",
    "oauth", "openai", "langchain", "huggingface", "data science", "deep learning",
    "computer vision", "natural language processing", "reinforcement learning",
    "tableau", "power bi", "excel", "r", "matlab", "spss", "statsmodels",
    "html5", "css3", "sass", "less", "webpack", "vite", "rollup", "babel",
    "redux", "zustand", "mobx", "recoil", "context api", "graphql apollo",
    "java spring", "maven", "gradle", "ant", "xml", "json", "yaml",
    "cloud computing", "devops", "mlops", "data engineering", "etl",
}

# ── Terms that spaCy wrongly labels as ORG ───────────────────────────
# (technologies, generic phrases, abbreviated months/courses, game engines, tools)
ORG_BLOCKLIST = {
    # Tech tools labelled as orgs by spaCy
    "sqlite", "unity", "blender", "mysql", "postgresql", "mongodb", "redis",
    "firebase", "elasticsearch", "hadoop", "spark", "kafka", "tensorflow",
    "pytorch", "keras", "numpy", "pandas", "flask", "django", "fastapi",
    "express", "react", "angular", "vue", "node", "nginx", "apache",
    "github", "gitlab", "bitbucket", "jira", "trello", "slack", "notion",
    "figma", "sketch", "postman", "swagger", "docker", "kubernetes",
    "aws", "azure", "gcp", "heroku", "vercel", "netlify",
    # Generic resume phrases spaCy mis-tags
    "data visualization tools & others", "data visualization", "others",
    "key skills", "skills", "summary", "objective", "projects", "achievements",
    "responsibilities", "tools", "technologies", "frameworks",
    # Academic/course names with months
    "data science & analytics feb", "data science", "analytics",
    "computer science", "information technology", "software engineering",
    # Abbreviations
    "pvt", "ltd", "inc", "llc", "corp", "co.", "pvt. ltd.", "pvt ltd",
    # Game/graphics engines
    "unreal engine",
}

# Pattern: lines with a year range (indicates job entry header)
# e.g.  "Software Engineer at Google  |  Jan 2022 – Present"
DATE_RANGE_RE = re.compile(
    r"(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4})"
    r"\s*[-–—to]+\s*"
    r"(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4}|present|current|now)",
    re.IGNORECASE,
)

# Pattern to detect experience section headers
EXPERIENCE_SECTION_RE = re.compile(
    r"^\s*(work\s*experience|experience|employment\s*history|professional\s*experience|internship[s]?)\s*$",
    re.IGNORECASE,
)

EDUCATION_SECTION_RE = re.compile(
    r"^\s*(education|academic\s*background|qualifications?|degrees?)\s*$",
    re.IGNORECASE,
)


def _is_blocklisted(text: str) -> bool:
    """Return True if the entity text is in the blocklist."""
    t = text.strip().lower()
    # Exact match
    if t in ORG_BLOCKLIST:
        return True
    # Partial match for skill names embedded in longer phrases
    for blocked in ORG_BLOCKLIST:
        if blocked in t and len(t) - len(blocked) < 12:
            return True
    return False


def _looks_like_real_org(text: str) -> bool:
    """
    Heuristic: a real org name usually:
    - Is 2–6 words long
    - Does NOT end with a bare month abbreviation ("Feb", "Mar …")
    - Is NOT a known technology name
    - Has at least one titlecased word
    """
    words = text.strip().split()
    if not (1 <= len(words) <= 7):
        return False
    # Reject if ends with a standalone month name
    month_re = re.compile(
        r"^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(uary|ruary|ch|il|e|y|ust|tember|ober|ember)?$",
        re.IGNORECASE,
    )
    if month_re.match(words[-1]):
        return False
    # Reject if ends with a standalone 4-digit year
    if re.match(r"^\d{4}$", words[-1]):
        return False
    # At least one word should start with uppercase
    if not any(w[0].isupper() for w in words if w):
        return False
    return True


def _extract_experience_from_sections(text: str) -> list[str]:
    """
    Strategy 1 — Section-based extraction:
    Find lines inside an Experience section that contain a date range,
    then grab the company name from those lines.
    """
    lines = text.splitlines()
    in_experience = False
    experience_blocks: list[str] = []

    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            continue
        if EXPERIENCE_SECTION_RE.match(stripped):
            in_experience = True
            continue
        if EDUCATION_SECTION_RE.match(stripped):
            in_experience = False
            continue

        if in_experience:
            # A line with a date range is very likely a job entry header
            if DATE_RANGE_RE.search(stripped):
                # Remove the date part; what's left is likely role + company
                clean = DATE_RANGE_RE.sub("", stripped).strip(" |·–—,")
                # Split "Role at Company" or "Role | Company" patterns
                at_split = re.split(r"\s+at\s+|\s+@\s+|\s*\|\s*", clean, maxsplit=1)
                candidate_org = at_split[-1].strip() if len(at_split) > 1 else clean
                if candidate_org and not _is_blocklisted(candidate_org) and _looks_like_real_org(candidate_org):
                    experience_blocks.append(candidate_org)

    return experience_blocks


def _extract_experience_from_ner(text: str) -> list[str]:
    """
    Strategy 2 — NER fallback with aggressive filtering:
    Only keep ORG entities that pass the blocklist + heuristic checks.
    """
    doc = nlp(text[:50000])  # cap for performance
    seen: set[str] = set()
    orgs: list[str] = []
    for ent in doc.ents:
        if ent.label_ != "ORG":
            continue
        name = ent.text.strip()
        norm = name.lower()
        if norm in seen:
            continue
        seen.add(norm)
        if _is_blocklisted(name):
            continue
        if not _looks_like_real_org(name):
            continue
        orgs.append(name)
    return orgs


def extract_entities(text: str) -> dict:
    """
    Extracts skills, education, and work experience from resume text.
    
    Experience uses a two-strategy approach:
    1. Section-based date-range detection (most accurate)
    2. Filtered NER as fallback if strategy 1 finds nothing
    """
    doc = nlp(text[:50000])
    text_lower = text.lower()

    # ── 1. Skills (keyword matching against curated list) ──────────────
    found_skills = sorted({skill for skill in COMMON_SKILLS if skill in text_lower})

    # ── 2. Work Experience ─────────────────────────────────────────────
    experience = _extract_experience_from_sections(text)
    if not experience:
        # Fall back to filtered NER
        experience = _extract_experience_from_ner(text)
    # Deduplicate, preserve order, cap at 10
    seen: set[str] = set()
    deduped_exp: list[str] = []
    for e in experience:
        k = e.lower()
        if k not in seen:
            seen.add(k)
            deduped_exp.append(e)
    experience = deduped_exp[:10]

    # ── 3. Education (sentence-level keyword heuristic) ────────────────
    edu_keywords = [
        "university", "college", "institute", "bachelor", "master", "phd",
        "b.s.", "m.s.", "degree", "b.tech", "m.tech", "bca", "mca",
        "b.e.", "m.e.", "diploma", "matriculation", "secondary", "higher secondary",
        "school of", "faculty of",
    ]
    education: list[str] = []
    seen_edu: set[str] = set()
    for sent in doc.sents:
        s = sent.text.strip()
        if any(kw in s.lower() for kw in edu_keywords):
            if s not in seen_edu and len(s) > 15:
                seen_edu.add(s)
                education.append(s)
    education = education[:5]

    return {
        "skills": found_skills,
        "experience": experience,
        "education": education,
    }
