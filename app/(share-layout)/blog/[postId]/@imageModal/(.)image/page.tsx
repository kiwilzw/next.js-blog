'use client'
import { CircleX } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

export default function ImageModalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const imgSrc = searchParams.get('img') ?? '/test.jpg'

  // 关闭弹窗，回退上一页
  const closeModal = () => {
    router.back()
  }

  // ESC按键关闭弹窗
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [router])

  return (
    // 全屏遮罩层
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* 阻止冒泡，点击图片本身不会关闭弹窗 */}
      <div onClick={(e) => e.stopPropagation()} className="relative">
        {/* 关闭按钮 */}
        <button
          onClick={closeModal}
          className="absolute -top-10 right-0 text-white text-2xl cursor-pointer"
        >

          <CircleX />
        </button>
          <Image
            src={imgSrc}
            alt="preview"
            width={1400}
            height={900}
            unoptimized
            className="max-h-[88vh] w-auto object-contain rounded-xl"
          />
      </div>
    </div>
  )
}