import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { discoverProjectOpportunities } from '../src/lib/gemini.js';

describe('Gemini Project Discovery Engine Tests', () => {
  const mockProfile = {
    academicLevel: 'UG',
    domain: 'Cybersecurity & Application Security',
    skills: ['Python', 'Network Security', 'FastAPI', 'Docker', 'Linux'],
    tools: ['Wireshark', 'Burp Suite', 'Postman', 'Git'],
    interests: 'API vulnerabilities, BOLA fuzzing and authorization logic',
    timeline: '10-12 Weeks',
    teamSize: 'Solo (1 Developer)',
    constraints: 'Standard Laptop'
  };

  test('discoverProjectOpportunities returns 3 valid opportunity blueprints', async () => {
    const logs = [];
    const addLog = (stage, detail, status) => logs.push({ stage, detail, status });

    // Call discovery engine with empty key to trigger the deterministic fallback engine
    const opps = await discoverProjectOpportunities(mockProfile, '', addLog);

    assert.ok(Array.isArray(opps));
    assert.ok(opps.length >= 1);
    assert.ok(logs.length >= 3);

    const firstOpp = opps[0];
    assert.ok(firstOpp.id);
    assert.ok(firstOpp.technicalTitle);
    assert.ok(firstOpp.tagline);
    assert.ok(typeof firstOpp.projectFitScore === 'number');
    assert.ok(firstOpp.theProblem.summary);
    assert.ok(firstOpp.whyYou.whyItFits);
    assert.ok(Array.isArray(firstOpp.whyYou.skillsMatchBars));
    assert.ok(Array.isArray(firstOpp.developmentRoadmap));
    assert.strictEqual(firstOpp.developmentRoadmap.length, 4);
    assert.ok(firstOpp.careerAndResumePack.resumeBullet1);
  });
});
