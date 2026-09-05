import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseResumeWithGemini } from '../src/lib/resumeParser.js';

describe('Resume & Profile Extractor Unit Tests', () => {
  test('parseResumeWithGemini throws descriptive error on empty inputs', async () => {
    await assert.rejects(
      async () => {
        await parseResumeWithGemini('', '');
      },
      {
        message: 'Resume content is too short to analyze.'
      }
    );
  });

  test('parseResumeWithGemini falls back gracefully and extracts domain, skills, and tools', async () => {
    const rawResumeText = `
      John Doe - Senior Undergraduate Student in Computer Science
      Skills: Python, FastAPI, React, Docker, SQL, Machine Learning, PyTorch, OpenCV
      Tools: VS Code, Git, GitHub, Postman, Linux, Figma
      Projects: Built a real-time object detection pipeline with OpenCV and YOLO.
    `;

    // Calling with empty API key triggers the deterministic local extractor fallback
    const profile = await parseResumeWithGemini(rawResumeText, '');

    assert.ok(profile);
    assert.strictEqual(profile.academicLevel, 'UG');
    assert.ok(profile.domain.includes('Computer Science') || profile.domain.includes('AI/ML'));
    assert.ok(Array.isArray(profile.skills));
    assert.ok(profile.skills.includes('Python'));
    assert.ok(profile.skills.includes('React'));
    assert.ok(profile.tools.includes('Docker'));
    assert.ok(Array.isArray(profile.tools));
    assert.ok(profile.tools.includes('Git'));
    assert.ok(profile.tools.includes('Linux'));
  });

  test('parseResumeWithGemini identifies cybersecurity domain from security keywords', async () => {
    const rawResume = `
      Alice Smith - Information Security Analyst
      Skills: Penetration Testing, VAPT, Cryptography, Network Security, Python
      Tools: Burp Suite, Wireshark, Linux, Git, Docker
    `;

    const profile = await parseResumeWithGemini(rawResume, '');

    assert.ok(profile);
    assert.strictEqual(profile.domain, 'Cybersecurity & Privacy');
    assert.ok(profile.skills.includes('Python'));
    assert.ok(profile.tools.includes('Linux'));
  });
});
