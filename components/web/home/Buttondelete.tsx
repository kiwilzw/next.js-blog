'use client'
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Buttondelete({ postId }: { postId: Id<"posts"> }) {
  const [isPending, setIsPending] = useState(false);
  const deletePostMutation = useMutation(api.posts.deletePost);
  const router = useRouter();

  async function handleDeletePost() {
    setIsPending(true);
    try {
      await deletePostMutation({ postId });
      router.refresh(); // ✅ 刷新当前页面，让服务端重新获取数据
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button variant="outline" className="w-full hover:cursor-pointer" onClick={handleDeletePost}>
      {isPending ? (<><Loader2 className="animate-spin size-4" /><span>删除中...</span></>) : <span>删除</span>}
    </Button>
  )
}
