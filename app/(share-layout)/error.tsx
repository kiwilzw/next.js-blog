'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('路由捕获异常：', error);
  }, [error]);

  // 判定未登录/401 相关错误，可根据后端返回文案自行扩展匹配规则
  const isUnauthorized =
    error.message.includes('401') ||
    error.message.includes('未登录') ||
    error.message.includes('token') ||
    error.message.includes('授权') ||
    error.message.includes('登录失效');

  // 跳转登录页，可拼接回调地址，登录后返回当前页面
  const goLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {isUnauthorized ? (
        <>
          <h2 className="text-2xl font-bold mb-3">登录已失效，请重新登录</h2>
          <p className="text-gray-600 mb-6">访问该页面需要登录账号</p>
          <button
            onClick={goLogin}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            前往登录
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-3">页面发生异常</h2>
          <p className="text-gray-600 mb-2">{error.message || '未知异常，请稍后重试'}</p>
          {error.digest && (
            <p className="text-sm text-gray-400 mb-4">错误标识: {error.digest}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              重试页面
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              返回首页
            </button>
          </div>
        </>
      )}
    </div>
  );
}