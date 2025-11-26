const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Phase 파일 목록
const phaseFiles = [
  '.github/issues/phase1-issues.md',
  '.github/issues/phase2-issues.md',
  '.github/issues/phase3-issues.md',
  '.github/issues/phase4-issues.md'
];

// 각 Phase 파일을 읽어서 개별 Task로 분리
function parsePhaseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // ## [Phase로 시작하는 부분을 기준으로 분리
  const tasks = [];
  const taskMatches = content.split(/(?=## \[Phase \d+\] Task \d+\.\d+:)/);

  // 첫 번째는 헤더이므로 제외
  for (let i = 1; i < taskMatches.length; i++) {
    const taskContent = taskMatches[i].trim();

    // Title 추출
    const titleMatch = taskContent.match(/## (\[Phase \d+\] Task \d+\.\d+: .+)/);
    if (!titleMatch) continue;

    const title = titleMatch[1];

    // Labels 추출
    const labelsMatch = taskContent.match(/\*\*Labels\*\*: `(.+?)`/);
    const labels = labelsMatch ? labelsMatch[1].split('`, `').join(',') : '';

    // Body 추출 (Title과 Labels 제외한 나머지)
    let body = taskContent
      .replace(/## \[Phase \d+\] Task \d+\.\d+: .+\n\n/, '')
      .replace(/\*\*Labels\*\*: `.+`\n\n/, '')
      .trim();

    // --- 구분자 제거
    body = body.replace(/^---\n\n/, '').replace(/\n\n---$/, '');

    tasks.push({ title, labels, body });
  }

  return tasks;
}

// GitHub 이슈 생성
function createIssue(task, dryRun = false) {
  const { title, labels, body } = task;

  // body를 임시 파일로 저장
  const tempFile = path.join(__dirname, 'temp-issue-body.md');
  fs.writeFileSync(tempFile, body, 'utf-8');

  try {
    const labelsArg = labels ? `--label "${labels}"` : '';
    const command = `gh issue create --title "${title}" ${labelsArg} --body-file "${tempFile}"`;

    if (dryRun) {
      console.log(`[DRY RUN] Would create issue: ${title}`);
      console.log(`  Labels: ${labels}`);
      console.log(`  Command: ${command}`);
      return null;
    } else {
      console.log(`Creating issue: ${title}...`);
      const result = execSync(command, { encoding: 'utf-8' });
      console.log(`  ✓ Created: ${result.trim()}`);
      return result;
    }
  } catch (error) {
    console.error(`  ✗ Failed to create issue: ${title}`);
    console.error(`  Error: ${error.message}`);
    return null;
  } finally {
    // 임시 파일 삭제
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

// 메인 실행
function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('='.repeat(60));
  console.log('GitHub Issues 생성 스크립트');
  console.log('='.repeat(60));

  if (dryRun) {
    console.log('[DRY RUN MODE] 실제로 이슈를 생성하지 않습니다.\n');
  }

  let totalTasks = 0;
  let createdIssues = 0;

  phaseFiles.forEach((filePath, index) => {
    console.log(`\n[Phase ${index + 1}] Processing: ${filePath}`);
    console.log('-'.repeat(60));

    const tasks = parsePhaseFile(filePath);
    console.log(`  Found ${tasks.length} tasks`);

    tasks.forEach((task, taskIndex) => {
      totalTasks++;

      // 이슈 생성 (API rate limit을 고려하여 약간의 지연)
      const result = createIssue(task, dryRun);

      if (result && !dryRun) {
        createdIssues++;
        // 1초 대기 (rate limit 방지)
        execSync('timeout /t 1 > nul 2>&1 || sleep 1', { shell: true });
      }
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log('완료!');
  console.log('='.repeat(60));
  console.log(`  총 Task 수: ${totalTasks}`);

  if (!dryRun) {
    console.log(`  생성된 이슈: ${createdIssues}`);
    console.log(`  실패한 이슈: ${totalTasks - createdIssues}`);
  }

  console.log('\n이슈 확인: https://github.com/stephenwon/whs-todolist/issues');
}

// 실행
main();
