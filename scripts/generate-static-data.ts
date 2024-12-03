import { generateStaticDataFile } from "@/lib/utils/generate-static-data";

// 开发环境生成静态数据的脚本
async function main() {
  console.log("Generating static data...");
  try {
    await generateStaticDataFile();
    console.log("Static data generated successfully!");
  } catch (error) {
    console.error("Error generating static data:", error);
    process.exit(1);
  }
}

main();
