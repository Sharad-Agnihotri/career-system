import sys
import json
import fitz  # PyMuPDF
import spacy
import os
import re

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback if download failed or not in path
    import subprocess
    subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

SKILL_DB = {
    "Frontend": ["react", "next.js", "typescript", "javascript", "html", "css", "tailwind", "vue", "angular", "redux"],
    "Backend": ["node.js", "python", "java", "go", "ruby", "php", "express", "django", "flask", "springboot"],
    "Database": ["postgresql", "mongodb", "mysql", "redis", "sqlite", "oracle", "dynamodb"],
    "Cloud/DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ci/cd", "github actions"],
    "AI/ML": ["pytorch", "tensorflow", "scikit-learn", "nlp", "pandas", "numpy", "opencv", "llm", "genai"]
}

def extract_text(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        return f"Error: {str(e)}"
    return text

def parse_resume(text):
    doc = nlp(text)
    
    # 1. Extract Skills
    found_skills = []
    text_lower = text.lower()
    for category, skills in SKILL_DB.items():
        for skill in skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                # Calculate "level" based on frequency or simple randomish realistic value for now
                count = text_lower.count(skill)
                level = min(40 + (count * 10), 95)
                found_skills.append({
                    "name": skill.capitalize() if len(skill) > 3 else skill.upper(),
                    "currentLevel": level,
                    "requiredLevel": 85,
                    "category": category
                })

    # 2. Extract Experience (Blocks)
    experience = []
    # Simple regex for dates
    date_pattern = r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})'
    
    # 3. Basic Scoring Logic
    score = min(40 + (len(found_skills) * 4), 98)
    ats_score = min(35 + (len(found_skills) * 5), 95)
    
    # 4. Strengths & Weaknesses
    strengths = []
    if len(found_skills) > 5: strengths.append(f"Strong technical stack with {len(found_skills)} key technologies detected.")
    if "Experience" in text: strengths.append("Professional experience section identified and formatted.")
    
    weaknesses = []
    if len(found_skills) < 3: weaknesses.append("Technical skill section appears thin; consider adding more keywords.")
    
    return {
        "score": score,
        "atsScore": ats_score,
        "careerIntent": "Software Engineer", # Default
        "strengths": strengths or ["Resume structure is clear."],
        "weaknesses": weaknesses or ["Could include more quantifiable achievements."],
        "skills": found_skills[:10],
        "suggestions": ["Add more industry-specific keywords.", "Quantify your achievements with percentages or numbers."],
        "experience": [],
        "education": [],
        "keywords": [s["name"] for s in found_skills],
    }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No PDF path provided"}))
        return

    pdf_path = sys.argv[1]
    raw_text = extract_text(pdf_path)
    
    if raw_text.startswith("Error:"):
        print(json.dumps({"success": False, "error": raw_text}))
        return

    analysis = parse_resume(raw_text)
    
    print(json.dumps({
        "success": True,
        "raw_text": raw_text[:2000], # Truncate for safety
        "analysis": analysis
    }))

if __name__ == "__main__":
    main()
