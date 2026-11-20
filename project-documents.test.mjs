import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createProjectDocuments } from './project-documents.mjs';

test('lists and reads only supported, non-hidden project documents', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'quantumbridge-docs-'));
  try {
    await mkdir(path.join(root, 'notes'));
    await mkdir(path.join(root, 'node_modules', 'package'), { recursive: true });
    await writeFile(path.join(root, 'README.md'), 'Project overview');
    await writeFile(path.join(root, 'notes', 'plan.txt'), 'Project plan');
    await writeFile(path.join(root, 'settings.json'), '{"private":true}');
    await writeFile(path.join(root, '.env'), 'TOKEN=not-for-reading');
    await writeFile(path.join(root, 'node_modules', 'package', 'README.md'), 'Generated dependency');

    const documents = createProjectDocuments(root);
    assert.deepEqual(await documents.list(), ['README.md', 'notes/plan.txt']);
    assert.deepEqual(await documents.read('notes/plan.txt'), {
      relativePath: 'notes/plan.txt',
      text: 'Project plan',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects traversal and non-document paths', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'quantumbridge-docs-'));
  try {
    const documents = createProjectDocuments(root);
    await assert.rejects(documents.read('../outside.md'), /normalized path/);
    await assert.rejects(documents.read(`${'a'.repeat(513)}.md`), /512-character limit/);
    await assert.rejects(documents.read('.env'), /Only non-hidden/);
    await assert.rejects(documents.read('secrets.md'), /Only non-hidden/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('requires an explicitly configured absolute knowledge folder', async () => {
  await assert.rejects(createProjectDocuments().list(), /Set QB_KNOWLEDGE_ROOT/);
  await assert.rejects(createProjectDocuments('relative-folder').list(), /absolute folder path/);
});
