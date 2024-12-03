import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-4xl font-bold mb-4">404 - 页面未找到</h2>
      <p className="text-gray-600 mb-6">抱歉，您访问的页面不存在。</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}
