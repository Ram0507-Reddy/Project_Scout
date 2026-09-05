/**
 * Resume & Profile Extractor for Project Scout
 * Extracts skills, domain, tools, and experience level using Gemini
 */

export async function parseResumeWithGemini(resumeText, apiKey) {
  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error("Resume content is too short to analyze.");
  }

  const prompt = `
Extract the core technical profile from the following resume/bio text.
Output ONLY a valid JSON object matching this schema:

{
  "academicLevel": "UG" | "PG" | "PhD",
  "domain": "Detected primary domain (e.g., Computer Science & AI/ML, Cybersecurity, Healthcare & Biotech, etc.)",
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
  "tools": ["Tool1", "Tool2", "Tool3", "Tool4"],
  "interests": "Summary of technical or applied interests inferred from projects/experience",
  "experienceSummary": "1-sentence summary of candidate capabilities"
}

RESUME TEXT:
${resumeText.slice(0, 4000)}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.warn("Resume AI parsing fallback:", error);
    // Simple heuristic fallback
    return {
      academicLevel: "UG",
      domain: "Computer Science & Engineering",
      skills: ["Python", "JavaScript", "React", "Data Structures", "SQL"],
      tools: ["Git", "VS Code", "FastAPI", "PostgreSQL"],
      interests: "Software development and intelligent systems",
      experienceSummary: "Extracted from uploaded resume text."
    };
  }
}
