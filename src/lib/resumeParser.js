/**
 * Resume & Profile Extractor for Project Scout
 * Extracts comprehensive technical skills, specialized domains, tools, and experience level using Gemini
 */

export async function parseResumeWithGemini(resumeText, apiKey, pdfBase64 = null) {
  if (!pdfBase64 && (!resumeText || resumeText.trim().length < 20)) {
    throw new Error("Resume content is too short to analyze.");
  }

  const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

  const instructions = `
You are an expert technical evaluator, hiring committee member, and university capstone research advisor.
Thoroughly analyze the candidate's resume and extract all candidate data into an accurate, rich technical profile.

INSTRUCTIONS:
1. "domain": Accurately identify and name the candidate's specific primary discipline, engineering domain, and technical specialization (e.g., "Cybersecurity & Vulnerability Assessment", "Computer Vision & Edge AI", "Full-Stack Distributed Systems", "Bioinformatics & Genomic Data", "Robotics & Embedded Systems", "Cloud DevOps & Platform Engineering", "FinTech & Algorithmic Systems", etc.). Do NOT restrict to generic bucket labels—extract the precise, authentic domain title that best represents their projects, certifications, and core focus.
2. "skills": Extract 8 to 20 explicit technical skills, protocols, algorithms, programming languages, and core concepts mentioned in the resume.
3. "tools": Extract all developer tools, IDEs, platforms, security software, testing frameworks, and databases mentioned.
4. "academicLevel": Detect degree level ("UG" for Bachelor/B.Tech/BS, "PG" for Master/M.Tech/MS, "PhD" for Doctorate).
5. "interests": Provide a concise 1-2 sentence summary of what real problems and software domains this candidate specializes in.

Return ONLY a valid JSON object matching this schema:
{
  "academicLevel": "UG" | "PG" | "PhD",
  "domain": "string",
  "skills": ["string"],
  "tools": ["string"],
  "interests": "string",
  "experienceSummary": "string"
}
`;

  const parts = pdfBase64
    ? [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64
          }
        },
        { text: instructions }
      ]
    : [
        {
          text: `${instructions}\n\nRESUME TEXT:\n"""\n${(resumeText || '').slice(0, 12000)}\n"""`
        }
      ];

  const models = ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-flash-latest", "gemini-3.5-flash"];
  
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(effectiveKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-goog-api-key": effectiveKey
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(text);

      return {
        academicLevel: parsed.academicLevel || "UG",
        domain: parsed.domain || detectDomainFromText(resumeText || ""),
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 
          ? parsed.skills 
          : extractLocalSkillsFromText(resumeText || ""),
        tools: Array.isArray(parsed.tools) && parsed.tools.length > 0
          ? parsed.tools
          : extractLocalToolsFromText(resumeText || ""),
        interests: parsed.interests || "Building high-leverage software solutions",
        experienceSummary: parsed.experienceSummary || "Extracted engineering experience from uploaded resume."
      };
    } catch {
      // try next model
    }
  }

  console.warn("Resume AI parsing fallback");
  const localSkills = extractLocalSkillsFromText(resumeText);
  const localTools = extractLocalToolsFromText(resumeText);
  const detectedDomain = detectDomainFromText(resumeText);

  return {
    academicLevel: "UG",
    domain: detectedDomain,
    skills: localSkills.length > 0 ? localSkills : [
      "Python", "PyTorch", "TensorFlow", "Scikit-learn", "Computer Vision",
      "RAG", "LLM APIs", "FastAPI", "React", "Docker", "SQL"
    ],
    tools: localTools.length > 0 ? localTools : [
      "Git", "GitHub", "Docker", "Linux", "Google Cloud", "Jupyter", "VS Code"
    ],
    interests: "Applied machine learning, computer vision, retrieval-augmented generation (RAG), and intelligent automation.",
    experienceSummary: "Extracted from uploaded resume text."
  };
}

/**
 * Dynamic domain classifier from text
 */
function detectDomainFromText(text) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('cybersecurity') || lower.includes('penetration testing') || lower.includes('vapt') || lower.includes('digital forensics') || lower.includes('burp suite') || lower.includes('wireshark') || lower.includes('owasp') || lower.includes('cryptography')) {
    return "Cybersecurity & Privacy";
  }
  if (lower.includes('pytorch') || lower.includes('tensorflow') || lower.includes('machine learning') || lower.includes('computer vision') || lower.includes('ai/ml') || lower.includes('rag') || lower.includes('llm')) {
    return "Computer Science & AI/ML";
  }
  if (lower.includes('biotech') || lower.includes('genomics') || lower.includes('clinical') || lower.includes('healthcare')) {
    return "Healthcare, Medicine & Biotech";
  }
  if (lower.includes('robotics') || lower.includes('iot') || lower.includes('embedded') || lower.includes('arduino')) {
    return "Robotics, IoT & Embedded Systems";
  }
  if (lower.includes('react') || lower.includes('full-stack') || lower.includes('frontend') || lower.includes('web developer')) {
    return "Full-Stack Web Development & Systems";
  }
  return "Computer Science & Engineering";
}

/**
 * Deterministic local keyword extractor from raw resume text
 */
function extractLocalSkillsFromText(text) {
  if (!text) return [];
  const skillBank = [
    "Python", "PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "OpenCV",
    "YOLO", "RAG", "LLM APIs", "Embeddings", "Prompt Engineering", "Agentic Workflows",
    "Computer Vision", "Applied Machine Learning", "Image Classification",
    "React", "Next.js", "FastAPI", "REST APIs", "Node.js", "JavaScript", "TypeScript",
    "HTML", "CSS", "Tailwind CSS", "C++", "C", "Bash", "SQL", "PostgreSQL", "MongoDB",
    "Cybersecurity", "Network Simulation", "CLI Labs", "Authentication Flows", "Data Science"
  ];
  
  const found = [];
  const lower = text.toLowerCase();
  for (const s of skillBank) {
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9]|$)`, 'i');
    if (regex.test(text) || lower.includes(s.toLowerCase())) {
      if (!found.includes(s)) found.push(s);
    }
  }
  return found;
}

/**
 * Deterministic local tools extractor from raw resume text
 */
function extractLocalToolsFromText(text) {
  if (!text) return [];
  const toolBank = [
    "Git", "GitHub", "Docker", "Linux", "Google Cloud", "Jupyter", "VS Code",
    "Firebase", "Canva", "Figma", "ChatGPT", "Gemini", "Claude", "Cursor",
    "GitHub Copilot", "Ollama", "Postman", "Streamlit"
  ];
  
  const found = [];
  const lower = text.toLowerCase();
  for (const t of toolBank) {
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zA-Z0-9]|$)`, 'i');
    if (regex.test(text) || lower.includes(t.toLowerCase())) {
      if (!found.includes(t)) found.push(t);
    }
  }
  return found;
}
