import fs from 'fs/promises';
import path from 'path';

const OSS = require('ali-oss');

const client = new OSS({
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'oss-cn-hangzhou',
    // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    // 填写Bucket名称。
    bucket: 'tazdingo-ob-vault'
});


const localDir = path.join(process.cwd(), 'public', 'posts');

// 定义时间间隔（毫秒）
const THROTTLE_INTERVAL = 5 * 60 * 1000; // 5 分钟
let lastDownloadTime = 0; // 上次执行时间

async function getFileLastModified(filePath: string) {
    try {
        const stats = await fs.stat(filePath);
        return stats.mtime;
    } catch (err) {
        return 0;
    }
}

export async function downloadAllFiles() {
    const currentTime = Date.now();

    // 检查节流时间
    if (currentTime - lastDownloadTime < THROTTLE_INTERVAL) {
        console.log(`Download skipped: Throttled. Next download available in ${Math.ceil((THROTTLE_INTERVAL - (currentTime - lastDownloadTime)) / 1000)} seconds.`);
        return;
    }

    console.log('Starting download...');
    let marker;
    try {
        while (true) {
            let result: any = await client.list({
                prefix: '',
                'max-keys': 1000,
                marker: marker
            });

            const files = result.objects;
            if (files.length === 0) break;

            for (let file of files) {
                const ossFilePath = file.name;
                const localFilePath = path.join(localDir, ossFilePath);

                const localFileLastModified = await getFileLastModified(localFilePath);
                const ossFileHead = await client.head(ossFilePath);
                const ossFileLastModified = new Date(ossFileHead.res.headers['last-modified']);

                if (ossFileLastModified > localFileLastModified) {
                    const localFileDir = path.dirname(localFilePath);
                    try {
                        await fs.access(localFileDir);
                    } catch (err) {
                        await fs.mkdir(localFileDir, { recursive: true });
                    }

                    await client.get(ossFilePath, localFilePath);
                    console.log(`Downloaded: ${ossFilePath} to ${localFilePath}`);
                } else {
                    console.log(`File not updated: ${ossFilePath}`);
                }
            }

            if (result.isTruncated) {
                marker = result.nextMarker;
            } else {
                break;
            }
        }

        // 更新上次下载时间
        lastDownloadTime = currentTime;
        console.log('Download completed.');
    } catch (err) {
        console.error('Error downloading files:', err);
    }
}