import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// 验证 slug 是否为有效的文章路径
function isValidSlug(slug: string[]): boolean {
  // 至少需要两个部分（目录和文件）
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
    console.log('Original slug:', params.slug);
    
    // 验证 slug
    if (!isValidSlug(params.slug)) {
      console.log('Invalid slug detected:', params.slug);
      return NextResponse.json(
        { error: 'Invalid article path' },
        { status: 400 }
      );
    }

    // 先解码每个路径段，然后再组合
    const decodedSlug = params.slug.map(segment => decodeURIComponent(segment));
    console.log('Decoded slug:', decodedSlug);
    
    // 确保文件名以.md结尾
    if (!decodedSlug[decodedSlug.length - 1].endsWith('.md')) {
      decodedSlug[decodedSlug.length - 1] += '.md';
    }
    
    const slug = decodedSlug.join('/');
    console.log('Combined slug:', slug);
    
    // 使用 path.normalize 来确保路径格式正确
    const normalizedPath = path.normalize(slug).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(process.cwd(), 'public', 'posts', normalizedPath);
    console.log('Full path:', fullPath);

    // 检查文件是否存在
    try {
      await fs.access(fullPath);
    } catch (error) {
      console.error(`File not found: ${fullPath}`);
      return NextResponse.json(
        { error: 'File not found', path: fullPath },
        { status: 404 }
      );
    }
    
    const fileContents = await fs.readFile(fullPath, 'utf8');
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
    console.error('Error processing AST:', error);
    return NextResponse.json(
      { error: 'Failed to process AST', details: (error as Error).message },
      { status: 500 }
    );
  }
}
