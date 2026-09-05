import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseGithubUrl, analyzeRepoTree, SAMPLE_REPOS } from '../src/lib/github.js';

describe('GitHub Ingestion Engine Unit Tests', () => {
  test('parseGithubUrl correctly parses standard GitHub URL', async () => {
    const result = await parseGithubUrl('https://github.com/Ram0507-Reddy/Project_Scout');
    assert.deepStrictEqual(result, {
      owner: 'Ram0507-Reddy',
      repo: 'Project_Scout'
    });
  });

  test('parseGithubUrl handles trailing slashes and http protocol', async () => {
    const result = await parseGithubUrl('http://github.com/agri-tech-lab/crop-disease-detection/');
    assert.deepStrictEqual(result, {
      owner: 'agri-tech-lab',
      repo: 'crop-disease-detection'
    });
  });

  test('parseGithubUrl handles clean shorthand repository identifiers', async () => {
    const result = await parseGithubUrl('devsec-ops/cloud-telemetry-triage');
    assert.deepStrictEqual(result, {
      owner: 'devsec-ops',
      repo: 'cloud-telemetry-triage'
    });
  });

  test('parseGithubUrl returns null on invalid or blank strings', async () => {
    const result1 = await parseGithubUrl('');
    const result2 = await parseGithubUrl('not-a-repo');
    assert.strictEqual(result1, null);
    assert.strictEqual(result2, null);
  });

  test('analyzeRepoTree accurately identifies frontend, backend, tests, and documentation', () => {
    const mockTree = [
      'README.md',
      'package.json',
      'src/App.jsx',
      'src/index.css',
      'backend/server.py',
      'tests/test_api.py',
      'Dockerfile',
      '.github/workflows/ci.yml'
    ];

    const stats = analyzeRepoTree(mockTree);
    assert.strictEqual(stats.totalFiles, 8);
    assert.strictEqual(stats.hasFrontend, true);
    assert.strictEqual(stats.hasBackend, true);
    assert.strictEqual(stats.hasTests, true);
    assert.strictEqual(stats.hasDocs, true);
    assert.strictEqual(stats.hasDocker, true);
    assert.strictEqual(stats.hasCI, true);
    assert.ok(stats.estimatedStages.architecture > 50);
  });

  test('SAMPLE_REPOS fixture integrity', () => {
    assert.ok(Array.isArray(SAMPLE_REPOS));
    assert.ok(SAMPLE_REPOS.length >= 2);
    const sample = SAMPLE_REPOS[0];
    assert.ok(sample.name);
    assert.ok(sample.owner);
    assert.ok(Array.isArray(sample.mockTree));
    assert.ok(typeof sample.mockReadme === 'string');
  });
});
