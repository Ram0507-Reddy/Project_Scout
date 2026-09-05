import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { auditProjectHealth, generateVivaDefenseSuite, auditDocumentationGaps } from '../src/lib/mentorEngine.js';

describe('Academic & Viva Defense Mentor Engine Tests', () => {
  const mockProjectContext = {
    problem: 'Crop foliar disease triage using deep learning on edge devices',
    solution: 'Lightweight MobileNetV3 model deployed on Raspberry Pi with offline caching',
    builtSoFar: 'Model training pipeline and FastAPI backend',
    plan: 'Complete React frontend and run field benchmarks',
    academicLevel: 'Undergraduate (UG)',
    department: 'Computer Science & Engineering',
    focusAreas: ['Edge AI', 'Computer Vision', 'Embedded Systems']
  };

  const mockRepoData = {
    owner: 'agri-tech-lab',
    name: 'crop-disease-detection',
    url: 'https://github.com/agri-tech-lab/crop-disease-detection',
    fileTree: [
      'README.md',
      'package.json',
      'requirements.txt',
      'src/App.jsx',
      'src/components/CameraView.jsx',
      'backend/main.py',
      'backend/routes/predict.py',
      'tests/test_predict.py',
      'Dockerfile',
      '.github/workflows/ci.yml'
    ],
    readme: `# Crop Disease Detection\n\n## Problem Statement\nCrop diseases reduce yield.\n\n## Architecture\nEdge inference.\n\n## Setup\nnpm install\n\n## Testing\nnpm test\n\n## Evaluation & Benchmarks\nLatency: 45ms\n\n## References\nIEEE AgriTech 2025`,
    dependencies: {
      backend: ['fastapi', 'torch', 'tflite'],
      frontend: ['react', 'lucide-react']
    }
  };

  test('auditProjectHealth computes valid scoring ranges and findings', async () => {
    const audit = await auditProjectHealth(mockProjectContext, mockRepoData);
    
    assert.ok(typeof audit.overallScore === 'number');
    assert.ok(audit.overallScore >= 0 && audit.overallScore <= 100);
    assert.ok(audit.technicalScore >= 0 && audit.technicalScore <= 100);
    assert.ok(audit.academicScore >= 0 && audit.academicScore <= 100);
    assert.ok(audit.categoryScores.architecture >= 0);
    assert.ok(audit.categoryScores.implementation >= 0);
    assert.ok(audit.categoryScores.testing >= 0);
    assert.ok(audit.categoryScores.documentation >= 0);
    assert.ok(Array.isArray(audit.prioritizedNextSteps));
    assert.ok(audit.academicEvaluation.problemClarity);
  });

  test('generateVivaDefenseSuite generates grounded file-anchored questions', async () => {
    const audit = await auditProjectHealth(mockProjectContext, mockRepoData);
    const viva = await generateVivaDefenseSuite(mockProjectContext, mockRepoData, audit);

    assert.ok(typeof viva.vivaReadinessScore === 'number');
    assert.ok(Array.isArray(viva.questions));
    assert.ok(viva.questions.length >= 3);

    // Verify every question has a code anchor, danger answer, and ideal strategy
    for (const q of viva.questions) {
      assert.ok(q.id);
      assert.ok(q.question);
      assert.ok(q.codeOrFileAnchor);
      assert.ok(q.dangerAnswer);
      assert.ok(q.idealDefenseStrategy);
      assert.ok(q.category);
    }

    assert.ok(viva.defenseCheatSheet.noveltyPitch);
    assert.ok(viva.defenseCheatSheet.limitationDefense);
    assert.ok(viva.defenseCheatSheet.techChoiceJustification);
  });

  test('auditDocumentationGaps evaluates 10-point capstone rubric and generates drafts', async () => {
    const docAudit = await auditDocumentationGaps(mockProjectContext, mockRepoData);

    assert.ok(typeof docAudit.documentationScore === 'number');
    assert.strictEqual(docAudit.checklist.length, 10);

    // Verify all 10 items conform to standard status and draft outputs
    for (const item of docAudit.checklist) {
      assert.ok(item.item);
      assert.ok(['PASS', 'WARNING', 'FAIL'].includes(item.status));
      assert.ok(item.comment);
      assert.ok(item.draftContent);
    }
  });
});
