import { readdir, realpath, stat, readFile } from 'node:fs/promises';
import path from 'node:path';

const allowedExtensions = new Set(['.md', '.markdown', '.txt', '.rst', '.adoc']);
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage', 'vendor', '.venv']);
const maxDocumentBytes = 256 * 1024;
const maxDocuments = 200;
const maxDepth = 4;

function isAllowedDocument(relativePath) {
  const segments = relativePath.split(/[\\/]/);
  const name = segments[segments.length - 1];
  return !segments.some((segment) => segment.startsWith('.'))
    && !/(?:secret|credential|password|private.?key|token)/i.test(name)
    && allowedExtensions.has(path.extname(name).toLowerCase());
}

function isWithinRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}

export function createProjectDocuments(configuredRoot) {
  const rootPath = typeof configuredRoot === 'string' ? configuredRoot.trim() : '';

  async function getRoot() {
    if (!rootPath) {
      throw new Error('Set QB_KNOWLEDGE_ROOT to an existing folder to enable project document tools.');
    }
    if (!path.isAbsolute(rootPath)) {
      throw new Error('QB_KNOWLEDGE_ROOT must be an absolute folder path.');
    }
    const root = await realpath(rootPath);
    if (!(await stat(root)).isDirectory()) {
      throw new Error('QB_KNOWLEDGE_ROOT must point to a folder.');
    }
    return root;
  }

  return {
    rootLabel: rootPath || '(not configured)',

    async list() {
      const root = await getRoot();
      const documents = [];

      async function walk(directory, depth) {
        if (depth > maxDepth || documents.length >= maxDocuments) return;
        const entries = await readdir(directory, { withFileTypes: true });
        entries.sort((left, right) => left.name.localeCompare(right.name));

        for (const entry of entries) {
          if (documents.length >= maxDocuments) break;
          if (entry.isSymbolicLink() || entry.name.startsWith('.')) continue;
          const fullPath = path.join(directory, entry.name);
          if (entry.isDirectory()) {
            if (!ignoredDirectories.has(entry.name.toLowerCase())) await walk(fullPath, depth + 1);
          } else if (entry.isFile()) {
            const relativePath = path.relative(root, fullPath);
            if (isAllowedDocument(relativePath)) {
              documents.push(relativePath.split(path.sep).join('/'));
            }
          }
        }
      }

      await walk(root, 0);
      return documents.sort();
    },

    async read(relativePath) {
      if (typeof relativePath !== 'string' || !relativePath.trim()) {
        throw new Error('Provide a relative document path.');
      }
      if (relativePath.length > 512) {
        throw new Error('Document path exceeds the 512-character limit.');
      }
      const segments = relativePath.trim().split(/[\\/]/);
      if (path.isAbsolute(relativePath) || /^[A-Za-z]:/.test(relativePath) || segments.some((segment) => !segment || segment === '.' || segment === '..')) {
        throw new Error('Document path must be a normalized path relative to QB_KNOWLEDGE_ROOT.');
      }
      if (!isAllowedDocument(relativePath)) {
        throw new Error('Only non-hidden Markdown and plain-text documents can be read.');
      }

      const root = await getRoot();
      const candidate = path.resolve(root, ...segments);
      if (!isWithinRoot(root, candidate)) {
        throw new Error('Document path is outside QB_KNOWLEDGE_ROOT.');
      }
      const resolved = await realpath(candidate);
      if (!isWithinRoot(root, resolved)) {
        throw new Error('Document path is outside QB_KNOWLEDGE_ROOT.');
      }
      const fileInfo = await stat(resolved);
      if (!fileInfo.isFile()) throw new Error('The requested document is not a file.');
      if (fileInfo.size > maxDocumentBytes) {
        throw new Error(`Document exceeds the ${maxDocumentBytes}-byte read limit.`);
      }

      return {
        relativePath: segments.join('/'),
        text: await readFile(resolved, 'utf8'),
      };
    },
  };
}
