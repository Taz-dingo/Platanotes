/**
 * URL编码工具函数
 */

/**
 * 检查字符串是否已经是URL编码格式
 */
export function isUrlEncoded(str: string): boolean {
  return /%[0-9A-F]{2}/i.test(str);
}

/**
 * 安全的URL编码：如果已经是编码格式则不重复编码
 */
export function safeUrlEncode(str: string): string {
  return isUrlEncoded(str) ? str : encodeURIComponent(str);
}

/**
 * 安全的URL解码：处理可能重复编码的情况
 */
export function safeUrlDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    // 如果解码失败，返回原字符串
    return str;
  }
}

/**
 * 处理文章路径的编码
 * @param segments 路径片段数组
 * @returns 编码后的路径片段数组
 */
export function encodePostPath(segments: string[]): string[] {
  return segments.map((segment) => safeUrlEncode(segment));
}

/**
 * 处理文章路径的解码
 * @param segments 路径片段数组
 * @returns 解码后的路径片段数组
 */
export function decodePostPath(segments: string[]): string[] {
  return segments.map((segment) => safeUrlDecode(segment));
}
