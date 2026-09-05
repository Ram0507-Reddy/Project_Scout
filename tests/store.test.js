import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { useAppStore } from '../src/lib/store.js';

describe('Zustand State Store Unit Tests', () => {
  test('initial state contains default profile and navigation tab', () => {
    const state = useAppStore.getState();
    assert.strictEqual(state.activeTab, 'discovery');
    assert.strictEqual(state.profile.academicLevel, 'UG');
    assert.ok(Array.isArray(state.profile.skills));
    assert.ok(Array.isArray(state.opportunities));
    assert.strictEqual(state.repoData, null);
  });

  test('setProfile correctly updates profile state', () => {
    useAppStore.getState().setProfile({
      domain: 'Cloud DevOps & Platform Engineering',
      academicLevel: 'PG',
      skills: ['Go', 'Kubernetes', 'Terraform', 'Prometheus']
    });

    const updatedProfile = useAppStore.getState().profile;
    assert.strictEqual(updatedProfile.domain, 'Cloud DevOps & Platform Engineering');
    assert.strictEqual(updatedProfile.academicLevel, 'PG');
    assert.strictEqual(updatedProfile.skills.length, 4);
    assert.ok(updatedProfile.skills.includes('Kubernetes'));
  });

  test('setActiveTab switches active platform view', () => {
    useAppStore.getState().setActiveTab('viva');
    assert.strictEqual(useAppStore.getState().activeTab, 'viva');

    useAppStore.getState().setActiveTab('health');
    assert.strictEqual(useAppStore.getState().activeTab, 'health');

    useAppStore.getState().setActiveTab('docs');
    assert.strictEqual(useAppStore.getState().activeTab, 'docs');
  });

  test('toggleSaveProject saves and removes bookmarked opportunity', () => {
    const mockOpp = {
      id: 'test-opp-101',
      title: 'Real-Time Edge Telemetry Triage',
      domain: 'Cybersecurity'
    };

    // Save project
    useAppStore.getState().toggleSaveProject(mockOpp);
    let saved = useAppStore.getState().savedProjects;
    assert.ok(saved.some(p => p.id === 'test-opp-101'));

    // Toggle off (remove)
    useAppStore.getState().toggleSaveProject(mockOpp);
    saved = useAppStore.getState().savedProjects;
    assert.ok(!saved.some(p => p.id === 'test-opp-101'));
  });
});
