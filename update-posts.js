const { execSync } = require('child_process');
const { downloadAllFiles } = require('./lib/oss')


// 定义下载外部资源的函数
async function downloadResources() {
  console.log('开始下载外部资源...');

  await downloadAllFiles();

  console.log('外部资源下载完成！');
}

// 定义 Git 操作的函数
function commitAndPush() {
  console.log('开始执行 Git 操作...');

  try {
    // 检查 public/posts 是否有更改
    const diffOutput = execSync('git diff --name-only public/posts').toString().trim();

    if (!diffOutput) {
      console.log('public/posts 没有需要提交的更改，跳过 Git 操作。');
      return;
    }

    // 添加 public/posts 下的更改
    execSync('git add public/posts', { stdio: 'inherit' });

    // 提交更改
    execSync(`git commit -m "updated at ${new Date().toISOString()}"`, { stdio: 'inherit' });

    // 推送更改
    execSync('git push', { stdio: 'inherit' });

    console.log('Git 操作完成！');
  } catch (error) {
    console.error('Git 操作失败，请检查！', error.message);
    process.exit(1);
  }
}

// 执行任务
async function main() {
  await downloadResources();
  commitAndPush();
}

main();
