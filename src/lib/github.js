// GitHub Repository Ingestion Engine
// Fetches repository structure, README, dependency manifests, and detects frameworks

export const SAMPLE_REPOS = [
  {
    name: "crop-disease-detection",
    owner: "agri-tech-lab",
    description: "Deep Learning & Edge CV for crop foliar disease triage",
    url: "https://github.com/agri-tech-lab/crop-disease-detection",
    academicLevel: "Undergraduate (UG)",
    language: "Python / React",
    mockTree: [
      "README.md",
      "package.json",
      "requirements.txt",
      "src/App.jsx",
      "src/components/CameraView.jsx",
      "src/components/TriageCard.jsx",
      "backend/main.py",
      "backend/routes/predict.py",
      "backend/models/leaf_classifier.tflite",
      "backend/utils/preprocess.py",
      "docs/architecture.png",
      ".gitignore"
    ],
    mockReadme: `# Crop Disease Detection & Automated Alerting System

A mobile-friendly prototype to classify foliar crop diseases from plant leaf images.

## Features
- Upload/capture leaf photo
- Classify into 5 common disease classes (Tomato Early Blight, Late Blight, Healthy, etc.)
- FastAPI inference endpoint
- React frontend with Tailwind CSS

## Tech Stack
- Frontend: React 18, Vite
- Backend: FastAPI, TensorFlow Lite, OpenCV
- Deployment: Docker

## Setup
\`\`\`bash
cd backend && pip install -r requirements.txt
python main.py
\`\`\`
`,
    mockDependencies: {
      backend: ["fastapi", "uvicorn", "tensorflow-lite", "opencv-python-headless", "pydantic", "numpy"],
      frontend: ["react", "react-dom", "lucide-react", "zustand"]
    }
  },
  {
    name: "cloud-telemetry-triage",
    owner: "devsec-ops",
    description: "Real-time edge vulnerability triage and alert deduplication",
    url: "https://github.com/devsec-ops/cloud-telemetry-triage",
    academicLevel: "Postgraduate (PG)",
    language: "Python / Rust",
    mockTree: [
      "README.md",
      "requirements.txt",
      "Cargo.toml",
      "src/collector.rs",
      "src/filter.rs",
      "backend/server.py",
      "backend/routes/telemetry.py",
      "backend/engine/triage.py",
      "backend/engine/cve_lookup.py",
      "tests/test_triage.py",
      "tests/test_collector.rs",
      "Dockerfile",
      "docker-compose.yml"
    ],
    mockReadme: `# Edge-Optimized Real-Time Vulnerability Triage for Distributed Telemetry

High-throughput distributed telemetry filtering engine designed to reduce alert fatigue by 80% using local edge deduplication and CVE contextual weighting.

## Research Motivation
Alert fatigue in distributed cloud telemetry environments leads to critical delay in zero-day containment (CSA 2025).

## Architecture
- Rust eBPF edge collector
- Python asynchronous triage engine
- Local SQLite cache for offline buffering
`,
    mockDependencies: {
      backend: ["fastapi", "aiohttp", "sqlalchemy", "pytest", "cryptography"],
      edge: ["tokio", "serde", "redb"]
    }
  }
];

export async function parseGithubUrl(url) {
  try {
    const cleaned = url.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
    const parts = cleaned.split("/");
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchGithubRepoData(owner, repo, token = "") {
  // Check if it's one of our sample repos
  const sample = SAMPLE_REPOS.find(s => s.name.toLowerCase() === repo.toLowerCase() && s.owner.toLowerCase() === owner.toLowerCase());
  if (sample) {
    return {
      name: sample.name,
      owner: sample.owner,
      url: sample.url,
      isSample: true,
      fileTree: sample.mockTree,
      readme: sample.mockReadme,
      dependencies: sample.mockDependencies,
      stats: analyzeRepoTree(sample.mockTree),
      fetchedAt: new Date().toISOString()
    };
  }

  const headers = {
    "Accept": "application/vnd.github.v3+json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      if (repoRes.status === 404) throw new Error("Repository not found. Please check spelling or ensure repo is public.");
      if (repoRes.status === 403) throw new Error("GitHub API rate limit exceeded. Please add a Personal Access Token or try sample repos.");
      throw new Error(`GitHub API error (${repoRes.status}): ${repoRes.statusText}`);
    }
    const repoInfo = await repoRes.json();
    const defaultBranch = repoInfo.default_branch || "main";

    // 2. Fetch Git Tree (recursive)
    let fileTree = [];
    try {
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        fileTree = (treeData.tree || []).map(item => item.path);
      }
    } catch (e) {
      console.warn("Could not fetch full recursive tree, falling back to top level contents", e);
    }

    // 3. Fetch README.md
    let readme = "";
    try {
      const readmeRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/README.md`);
      if (readmeRes.ok) {
        readme = await readmeRes.text();
      } else {
        // try lowercase
        const readmeLowerRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/readme.md`);
        if (readmeLowerRes.ok) readme = await readmeLowerRes.text();
      }
    } catch {
      readme = "";
    }

    // 4. Fetch Package.json or Requirements.txt
    let dependencies = {};
    try {
      if (fileTree.includes("package.json")) {
        const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/package.json`);
        if (pkgRes.ok) {
          const pkgJson = await pkgRes.json();
          dependencies.frontend = Object.keys({ ...pkgJson.dependencies, ...pkgJson.devDependencies });
        }
      }
      if (fileTree.includes("requirements.txt") || fileTree.includes("backend/requirements.txt")) {
        const reqPath = fileTree.includes("requirements.txt") ? "requirements.txt" : "backend/requirements.txt";
        const reqRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${reqPath}`);
        if (reqRes.ok) {
          const reqText = await reqRes.text();
          dependencies.backend = reqText.split("\n").map(l => l.trim().split("==")[0].split(">=")[0]).filter(Boolean);
        }
      }
    } catch {
      // ignore dependency parsing errors
    }

    const stats = analyzeRepoTree(fileTree);

    return {
      name: repoInfo.name,
      owner: repoInfo.owner?.login || owner,
      description: repoInfo.description || "",
      stars: repoInfo.stargazers_count || 0,
      url: repoInfo.html_url,
      defaultBranch,
      fileTree,
      readme,
      dependencies,
      stats,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
}

export function analyzeRepoTree(fileTree = []) {
  const hasFrontend = fileTree.some(f => f.match(/^(frontend|src|client|ui|public)\//i) || f.endsWith(".jsx") || f.endsWith(".tsx") || f.endsWith(".vue"));
  const hasBackend = fileTree.some(f => f.match(/^(backend|server|api|services|routes)\//i) || f.endsWith(".py") || f.endsWith(".go") || f.endsWith(".rs") || f.endsWith(".java"));
  const hasModels = fileTree.some(f => f.match(/^(models|ml|weights|ai|notebooks)\//i) || f.endsWith(".h5") || f.endsWith(".tflite") || f.endsWith(".pt") || f.endsWith(".onnx") || f.endsWith(".ipynb"));
  const hasTests = fileTree.some(f => f.match(/^(tests|test|__tests__|spec)\//i) || f.includes("test_") || f.includes(".test.") || f.includes(".spec."));
  const hasDocs = fileTree.some(f => f.match(/^(docs|documentation|wiki)\//i) || f.toLowerCase().endsWith(".md") || f.endsWith(".pdf"));
  const hasDocker = fileTree.some(f => f.toLowerCase().includes("dockerfile") || f.includes("docker-compose"));
  const hasCI = fileTree.some(f => f.includes(".github/workflows"));

  // Estimate completion tiers based on presence of code files
  return {
    totalFiles: fileTree.length,
    hasFrontend,
    hasBackend,
    hasModels,
    hasTests,
    hasDocs,
    hasDocker,
    hasCI,
    estimatedStages: {
      architecture: hasBackend || hasFrontend ? 85 : 30,
      frontend: hasFrontend ? (fileTree.filter(f => f.match(/\.(jsx|tsx|vue|html)$/)).length > 4 ? 80 : 40) : 0,
      backend: hasBackend ? (fileTree.filter(f => f.match(/\.(py|ts|js|go|rs)$/)).length > 4 ? 75 : 35) : 0,
      mlModel: hasModels ? 60 : 0,
      testing: hasTests ? 55 : 10,
      documentation: hasDocs ? (fileTree.filter(f => f.endsWith(".md")).length > 2 ? 65 : 30) : 15
    }
  };
}
