import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-4xl font-bold">404 - 页面未找到</h2>
      <p className="mb-6 text-gray-600">抱歉，您访问的页面不存在。</p>
      <Link
        href="/"
        className="rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
      >
        返回首页
      </Link>
    </div>
  );
}
