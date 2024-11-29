const OSS = require('ali-oss');
require('dotenv').config({ path: '.env.local' });


const client = new OSS({
    // region填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: process.env.OSS_REGION,
    // 从环境变量中获取访问凭证。
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    // bucket填写Bucket名称。
    bucket: process.env.OSS_BUCKET
});

// 列出指定目录下的所有对象
export async function listObjects(prefix: string = 'Blog/'): Promise<string[]> {
    try {
        const result = await client.list({
            prefix,
            delimiter: '/'
        });
        return result.objects?.map((obj:any) => obj.name) || [];
    } catch (error) {
        console.error('Error listing objects:', error);
        return [];
    }
}

// 获取所有博客分类
export async function getBlogCategories(): Promise<string[]> {
    try {
        const result = await client.list({
            prefix: 'Blog/',
            delimiter: '/'
        });
        return result.prefixes || [];
    } catch (error) {
        console.error('Error getting blog categories:', error);
        return [];
    }
}

// 获取特定分类下的所有文章
export async function getCategoryPosts(category: string): Promise<string[]> {
    try {
        const result = await client.list({
            prefix: `Blog/${category}/`,
            delimiter: '/'
        });
        return (result.objects || [])
            .filter((obj: any) => obj.name.endsWith('.md'))
            .map((obj: any) => obj.name);
    } catch (error) {
        console.error('Error getting category posts:', error);
        return [];
    }
}

// 获取特定文章的内容
export async function getPostContent(path: string): Promise<string> {
    try {
        const result = await client.get(path);

        return result.content.toString('utf-8');
    } catch (error) {
        console.error('Error getting post content:', error);
        throw error;
    }
}
