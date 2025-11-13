import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(projectRoot, '..');
const distDir = path.join(projectRoot, 'dist');
const worktreeDir = path.join(repoRoot, '.gh-pages-temp');
const deployBranch = 'gh-pages';

function run(command, options = {}) {
  execSync(command, {
    stdio: 'inherit',
    ...options,
  });
}

function runSilent(command, options = {}) {
  return execSync(command, {
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  }).trim();
}

function ensureDirectory(pathToEnsure) {
  if (!existsSync(pathToEnsure)) {
    mkdirSync(pathToEnsure, { recursive: true });
  }
}

function cleanDirectory(directory) {
  for (const entry of readdirSync(directory)) {
    if (entry === '.git') {
      continue;
    }

    rmSync(path.join(directory, entry), { recursive: true, force: true });
  }
}

function ensureBranchExists() {
  try {
    runSilent(`git rev-parse --verify ${deployBranch}`, { cwd: repoRoot });
    return true;
  } catch (error) {
    try {
      run(`git fetch origin ${deployBranch}:${deployBranch}`, { cwd: repoRoot });
      return true;
    } catch (fetchError) {
      return false;
    }
  }
}

function addWorktree(branchExists) {
  if (branchExists) {
    run(`git worktree add --force --checkout ${worktreeDir} ${deployBranch}`, { cwd: repoRoot });
  } else {
    run(`git worktree add --force -B ${deployBranch} ${worktreeDir}`, { cwd: repoRoot });
  }
}

function copyDistToWorktree() {
  if (!existsSync(distDir)) {
    throw new Error('Build directory "dist" not found. Did you run npm run build?');
  }

  cleanDirectory(worktreeDir);
  cpSync(distDir, worktreeDir, { recursive: true });

  // Ensure GitHub Pages skips Jekyll processing
  writeFileSync(path.join(worktreeDir, '.nojekyll'), '');

  // Provide SPA fallback
  const indexPath = path.join(worktreeDir, 'index.html');
  if (existsSync(indexPath)) {
    copyFileSync(indexPath, path.join(worktreeDir, '404.html'));
  }
}

function commitAndPush() {
  const status = runSilent('git status --porcelain', { cwd: worktreeDir });
  if (!status) {
    console.log('No changes to deploy. Skipping commit.');
    return;
  }

  run('git add --all', { cwd: worktreeDir });
  run(`git commit -m "Deploy to GitHub Pages"`, { cwd: worktreeDir });
  run(`git push origin ${deployBranch}`, { cwd: worktreeDir });
}

function removeWorktree() {
  try {
    run(`git worktree remove --force ${worktreeDir}`, { cwd: repoRoot });
  } catch (error) {
    console.warn('Warning: Failed to remove worktree. You may need to remove it manually.', error.message);
  }

  if (existsSync(worktreeDir)) {
    rmSync(worktreeDir, { recursive: true, force: true });
  }
}

function main() {
  const currentBranch = runSilent('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot });

  console.log(`Current branch: ${currentBranch}`);

  try {
    console.log('\n📦 Building project...');
    run('npm run build', { cwd: projectRoot });

    ensureDirectory(worktreeDir);

    console.log('\n🌿 Preparing Git worktree...');
    const branchExists = ensureBranchExists();
    addWorktree(branchExists);

    console.log('\n📁 Copying build output to gh-pages worktree...');
    copyDistToWorktree();

    console.log('\n🚀 Committing and pushing to GitHub Pages...');
    commitAndPush();

    console.log('\n✅ Deployment complete.');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exitCode = 1;
  } finally {
    console.log('\n🧹 Cleaning up worktree...');
    removeWorktree();

    try {
      run(`git checkout ${currentBranch}`, { cwd: repoRoot });
    } catch (checkoutError) {
      console.warn(`Warning: Failed to switch back to branch ${currentBranch}.`, checkoutError.message);
    }
  }
}

main();
