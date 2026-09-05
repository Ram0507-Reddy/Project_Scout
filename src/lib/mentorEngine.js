// Gemini-Powered Project Audit, Academic Evaluator & Viva Defense Engine
// Performs deep repository analysis, technical & academic health scoring, and viva interrogation

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

async function callGemini(contents, systemInstruction = "") {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in environment variables.");
  }

  const payload = {
    contents: contents,
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      responseMimeType: "application/json"
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error("Empty response received from Gemini.");
  }

  return JSON.parse(textOutput);
}

/**
 * 1. Comprehensive Project Health Check & Academic Audit
 */
export async function auditProjectHealth(projectContext, repoData) {
  const systemInstruction = `
You are the Head of University Computer Science Project Examination Board and a Senior Principal Engineer.
Your job is to audit a student's final-year project repository against rigorous technical and academic standards.

You must distinguish between a working hobby app and an academically defensible capstone project.
Analyze the provided project intent, problem statement, academic tier (UG/PG/PhD), repository file tree, dependency manifest, and README.

Output strictly valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "technicalScore": number (0-100),
  "academicScore": number (0-100),
  "categoryScores": {
    "architecture": number (0-100),
    "implementation": number (0-100),
    "testing": number (0-100),
    "documentation": number (0-100),
    "researchAndNovelty": number (0-100),
    "security": number (0-100),
    "vivaReadiness": number (0-100)
  },
  "findings": {
    "critical": [
      { "title": string, "description": string, "area": string, "fix": string }
    ],
    "needsAttention": [
      { "title": string, "description": string, "area": string, "fix": string }
    ],
    "good": [
      { "title": string, "description": string, "area": string }
    ]
  },
  "academicEvaluation": {
    "problemClarity": { "status": "Strong" | "Moderate" | "Weak", "comment": string },
    "noveltyAndGap": { "status": "Strong" | "Moderate" | "Weak", "comment": string },
    "methodologyEvaluation": { "status": "Strong" | "Moderate" | "Weak", "comment": string },
    "reproducibility": { "status": "Strong" | "Moderate" | "Weak", "comment": string }
  },
  "estimatedImplementationStages": {
    "frontend": number (percentage 0-100),
    "backend": number (percentage 0-100),
    "mlOrCoreLogic": number (percentage 0-100),
    "testing": number (percentage 0-100),
    "documentation": number (percentage 0-100)
  },
  "prioritizedNextSteps": [
    {
      "step": number,
      "task": string,
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "rationale": string,
      "targetFiles": [string]
    }
  ],
  "mentorChallenge": {
    "issue": string,
    "whyItMatters": string,
    "actionPrompt": string
  }
}
`;

  const userPrompt = `
=== STUDENT PROJECT CONTEXT ===
Problem Statement: ${projectContext.problem || "Not specified"}
Proposed Solution: ${projectContext.solution || "Not specified"}
What is built so far: ${projectContext.builtSoFar || "Prototype"}
Student's Plan: ${projectContext.plan || "Build MVP and test"}
Academic Context: ${projectContext.academicLevel || "Undergraduate (UG)"} - ${projectContext.department || "Computer Science"}
Focus Areas: ${(projectContext.focusAreas || []).join(", ") || "General development"}

=== CONNECTED GITHUB REPOSITORY ===
Repo Name: ${repoData.owner}/${repoData.name}
Repo Description: ${repoData.description || "N/A"}
Total Files: ${repoData.fileTree?.length || 0}
File Tree:
${JSON.stringify((repoData.fileTree || []).slice(0, 80), null, 2)}

Dependencies Manifest:
${JSON.stringify(repoData.dependencies || {}, null, 2)}

Repository README.md:
${(repoData.readme || "No README.md found in repository").slice(0, 2500)}

Conduct the technical and academic audit now. Be constructively rigorous.
`;

  return await callGemini(
    [{ parts: [{ text: userPrompt }] }],
    systemInstruction
  );
}

/**
 * 2. Harsh Viva Defense Simulator & Examiner Q&A Generator
 */
export async function generateVivaDefenseSuite(projectContext, repoData, auditResults) {
  const systemInstruction = `
You are an external university Viva Examiner known for asking tough, pinpoint technical and research methodology questions.
Your goal is to prepare the student so they cannot be caught off-guard during their project defense.

Generate personalized viva questions rooted directly in the vulnerabilities, missing documentation, architectural choices, and research gaps of their ACTUAL repository.

Output strictly valid JSON matching this schema:
{
  "vivaReadinessScore": number (0-100),
  "topExaminerRisks": [string],
  "questions": [
    {
      "id": string,
      "category": "Methodology" | "Novelty & Gap" | "Architecture & Tech" | "Evaluation & Metrics" | "Limitations & Failure Modes",
      "question": string,
      "whyExaminerAsks": string,
      "dangerAnswer": string,
      "idealDefenseStrategy": string,
      "codeOrFileAnchor": string
    }
  ],
  "defenseCheatSheet": {
    "noveltyPitch": string,
    "limitationDefense": string,
    "techChoiceJustification": string
  }
}
`;

  const userPrompt = `
Project Title/Problem: ${projectContext.problem || repoData.name}
Academic Level: ${projectContext.academicLevel || "UG"}
Repo Files: ${JSON.stringify((repoData.fileTree || []).slice(0, 50))}
Dependencies: ${JSON.stringify(repoData.dependencies || {})}
README Snippet: ${(repoData.readme || "").slice(0, 1500)}
Identified Audit Weaknesses: ${JSON.stringify(auditResults?.findings?.critical || [])}

Generate 6-8 sharp, realistic viva examination questions tailored specifically to their codebase and research claims.
`;

  return await callGemini(
    [{ parts: [{ text: userPrompt }] }],
    systemInstruction
  );
}

/**
 * 3. Documentation Gap Auditor & 1-Click Fixer
 */
export async function auditDocumentationGaps(projectContext, repoData) {
  const systemInstruction = `
You are a Technical Documentation Specialist & Academic Reviewer.
Audit the student's README and repository files against the standard 10-point Academic Capstone Documentation Checklist:
1. Clear Problem Statement
2. Objectives & Hypotheses
3. System Architecture & Dataflow
4. Installation & Environment Setup
5. API Endpoints & Contract Specs
6. Database Schema & Data Models
7. Baseline Comparison & Evaluation Metrics
8. Automated Testing & Verification Steps
9. Known Limitations & Edge Cases
10. Literature Citations & Academic References

Output strictly valid JSON matching this schema:
{
  "documentationScore": number (0-100),
  "checklist": [
    {
      "item": string,
      "status": "PASS" | "WARNING" | "FAIL",
      "comment": string,
      "suggestedFix": string,
      "draftContent": string
    }
  ],
  "recommendedReadmeUpdate": string
}
`;

  const userPrompt = `
Project Context: ${JSON.stringify(projectContext)}
Repo Name: ${repoData.name}
Current README:
${repoData.readme || "NO README PRESENT"}
`;

  return await callGemini(
    [{ parts: [{ text: userPrompt }] }],
    systemInstruction
  );
}

/**
 * 4. Grounded Mentor Chat Assistant
 */
export async function sendMentorChatMessage(messages, projectContext, repoData, auditResults) {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const systemInstruction = `
You are Problify AI Project Mentor — an elite senior software architect and university professor.
You are actively monitoring the student's project: "${projectContext.problem || repoData.name}".

CONTEXT GROUNDING:
- Academic Level: ${projectContext.academicLevel || "UG"}
- Repo: ${repoData.owner}/${repoData.name}
- Total Repo Files: ${repoData.fileTree?.length || 0}
- File Tree: ${JSON.stringify((repoData.fileTree || []).slice(0, 60))}
- Dependencies: ${JSON.stringify(repoData.dependencies || {})}
- README: ${(repoData.readme || "None").slice(0, 1000)}
- Audit Scores: Overall ${auditResults?.overallScore || 75}/100 | Technical ${auditResults?.technicalScore || 75} | Academic ${auditResults?.academicScore || 70}
- Key Gaps: ${JSON.stringify((auditResults?.findings?.critical || []).map(c => c.title))}

RULES FOR YOUR RESPONSES:
1. Never give generic boilerplate. Ground your answers specifically in their file tree, dependencies, and academic tier.
2. If they ask about code/architecture, reference their actual files (e.g. \`backend/main.py\`, \`src/App.jsx\`).
3. Always balance engineering pragmatism with academic rigor (novelty, metrics, viva defense).
4. Keep responses crisp, actionable, and structured with markdown code snippets when needed.
`;

  const formattedContents = messages.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }]
  }));

  const payload = {
    contents: formattedContents,
    generationConfig: {
      temperature: 0.4,
      topP: 0.95
    },
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    }
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Mentor API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
}
