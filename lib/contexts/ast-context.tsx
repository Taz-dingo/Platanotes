'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Heading {
  level: number;
  text: string;
}

interface ASTContextType {
  headings: Heading[];
  error: string | null;
  loading: boolean;
}

const ASTContext = createContext<ASTContextType>({
  headings: [],
  error: null,
  loading: true,
});

// 验证路径是否为有效的文章路径
function isValidPostPath(pathname: string): boolean {
  // 检查是否以 /posts/ 开头
  if (!pathname.startsWith('/posts/')) return false;

  // 移除 /posts/ 前缀
  const slug = pathname.replace('/posts/', '');
  
  // 排除根路径 /posts/
  if (!slug) return false;

  return true;
}

export function ASTProvider({ children }: { children: React.ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchAST = async () => {
      if (!isValidPostPath(pathname)) {
        setLoading(false);
        setHeadings([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const slug = pathname.replace('/posts/', '');
        const response = await fetch(`/api/ast/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load content');
        }

        if (data.headings) {
          setHeadings(data.headings);
        }
      } catch (error) {
        console.error('Failed to fetch AST:', error);
        setError('无法加载目录');
        setHeadings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAST();
  }, [pathname]);

  return (
    <ASTContext.Provider value={{ headings, error, loading }}>
      {children}
    </ASTContext.Provider>
  );
}

export function useAST() {
  return useContext(ASTContext);
}
