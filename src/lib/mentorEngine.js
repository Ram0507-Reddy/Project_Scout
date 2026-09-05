// Gemini-Powered Project Audit, Academic Evaluator & Viva Defense Engine
// Performs deep repository analysis, technical & academic health scoring, and viva interrogation

const GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash"
];

async function callGemini(contents, systemInstruction = "") {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured. Please enter your Gemini API key in settings.");
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

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) {
        continue;
      }

      textOutput = textOutput.replace(/^```json/, "").replace(/```$/, "").trim();
      return JSON.parse(textOutput);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to process with Gemini API across all model endpoints.");
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
You are a senior university External Viva Examination Committee Chair and Principal Technical Architect.
Your task is to interrogate the student directly on their ACTUAL GitHub repository, code structure, packages, and architecture.

STRICT INSTRUCTIONS:
1. Every question MUST be grounded in a specific file, dependency, architectural pattern, or claim found in their repository.
2. Under "codeOrFileAnchor", you MUST cite the exact file path from their repository (e.g., "src/lib/gemini.js", "package.json", "src/components/OpportunityCard.jsx", "README.md", etc.).
3. Do NOT ask generic textbook questions. Interrogate real implementation decisions:
   - Error handling & rate limiting in their API callers
   - State management complexity & caching
   - Missing unit tests & CI validation pipelines
   - Performance bottlenecks, dataflow, or security hygiene
   - Academic novelty vs. relying on existing off-the-shelf wrappers
4. Provide a "dangerAnswer" (what an unprepared student would say that leads to failure) and an "idealDefenseStrategy" (how to defend the engineering choice with technical precision).

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
=== CONNECTED REPOSITORY UNDER EXAMINATION ===
Repository: ${repoData.owner}/${repoData.name}
Repo URL: ${repoData.url || "https://github.com/" + repoData.owner + "/" + repoData.name}
Academic Level: ${projectContext.academicLevel || "UG"}
Total Indexed Code Files: ${repoData.fileTree?.length || 0}

Repository File Hierarchy:
${JSON.stringify((repoData.fileTree || []).slice(0, 100), null, 2)}

Active Dependencies & Libraries:
${JSON.stringify(repoData.dependencies || {}, null, 2)}

README.md Snippet:
${(repoData.readme || "No README present").slice(0, 3000)}

Audit Identified Risks:
${JSON.stringify(auditResults?.findings?.critical || [])}

Generate 6-8 tough, realistic viva interrogation questions derived directly from the code files and architecture listed above.
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
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("GEMINI_API_KEY missing. Please configure your key in settings.");

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

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) continue;

      const data = await res.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer) return answer;
    } catch {
      // try next model
    }
  }

  throw new Error("Unable to reach Gemini models for mentor chat.");
}
