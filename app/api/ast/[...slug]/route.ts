import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { getPostContent } from '@/lib/oss';
import { encodePostPath, decodePostPath } from '@/lib/url-utils';

// 验证 slug 是否为有效的文章路径
function isValidSlug(slug: string[]): boolean {
  // 至少需要一个部分
  if (slug.length < 1) return false;
  
  // 检查路径中是否包含非法字符
  const invalidChars = /[<>:"|?*\u0000-\u001F]/g;
  if (slug.some(part => invalidChars.test(part))) return false;
  
  return true;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    // console.log('Original slug:', params.slug);
    
    // 验证 slug
    if (!isValidSlug(params.slug)) {
      console.log('Invalid slug detected:', params.slug);
      return NextResponse.json(
        { error: 'Invalid article path' },
        { status: 400 }
      );
    }

    // 使用统一的URL编码工具处理路径
    const encodedSlug = encodePostPath(params.slug);
    const decodedSlug = decodePostPath(encodedSlug);
    
    // 确保文件名以.md结尾
    if (!decodedSlug[decodedSlug.length - 1].endsWith('.md')) {
      decodedSlug[decodedSlug.length - 1] += '.md';
    }
    
    const slug = decodedSlug.join('/');
    // console.log('Combined slug:', slug);
    
    // 构建 OSS 路径
    const ossPath = `Blog/${slug}`;
    // console.log('OSS path:', ossPath);

    try {
      const fileContents = await getPostContent(ossPath);
      const { content } = matter(fileContents);
      
      // 改进的标题提取逻辑，排除代码块中的内容
      const headings: { level: number; text: string }[] = [];
      const lines = content.split('\n');
      let inCodeBlock = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 检查是否进入或离开代码块
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          continue;
        }
        
        // 只在非代码块区域处理标题
        if (!inCodeBlock && line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 0;
          const text = line.replace(/^#+\s+/, '').trim();
          if (level > 0 && text) {
            headings.push({ level, text });
          }
        }
      }

      return NextResponse.json({ headings });
    } catch (error) {
      console.error(`File not found in OSS: ${ossPath}`);
      return NextResponse.json(
        { error: 'File not found', path: ossPath },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error processing AST:', error);
    return NextResponse.json(
      { error: 'Failed to process AST', details: (error as Error).message },
      { status: 500 }
    );
  }
}
