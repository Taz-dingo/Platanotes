import { ASTProvider } from '@/lib/contexts/ast-context';

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ASTProvider>
      {children}
    </ASTProvider>
  );
}
