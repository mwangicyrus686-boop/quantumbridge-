import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiServer } from './api-server.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const apiServer = createApiServer();

await new Promise((resolve, reject) => {
  apiServer.once('error', reject);
  apiServer.listen(5174, '127.0.0.1', resolve);
});

const viteEntry = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
const viteProcess = spawn(process.execPath, [viteEntry, '--host', 'localhost', '--strictPort'], {
  cwd: projectRoot,
  stdio: 'inherit',
});

let stopping = false;
const stop = (signal = 'SIGINT') => {
  if (stopping) return;
  stopping = true;
  viteProcess.kill(signal);
  apiServer.close();
};

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
viteProcess.on('error', (error) => {
  console.error('Could not start Vite:', error.message);
  stop('SIGTERM');
  process.exitCode = 1;
});
viteProcess.on('exit', (code) => {
  apiServer.close();
  process.exitCode = code ?? 0;
});
