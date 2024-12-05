import { downloadAllObjects } from "@/lib/services/oss";

async function main() {
  console.log("开始从 OSS 同步数据...");
  try {
    await downloadAllObjects();
    console.log("数据同步完成！");
  } catch (error) {
    console.error("数据同步失败:", error);
    process.exit(1);
  }
}

main();
