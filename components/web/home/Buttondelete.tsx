'use client'
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

interface POST {
  imageUrl: string | null;
  _id: Id<"posts">;
  _creationTime: number;
  imageStorageId?: Id<"_storage"> | undefined;
  title: string;
  body: string;
  authorId: string;
}

export function Buttondelete({ postId, token }: { postId: Id<"posts">; token: string | undefined }) {
  const [isPending, startTransition] = useTransition();
  const deletePostMutation = useMutation(api.posts.deletePost);
  function handleDeletePost() {
    startTransition(async () => {
      await deletePostMutation({ postId });
    })
  }
  return (
    <Button variant="outline" className="w-full hover:cursor-pointer" onClick={handleDeletePost}>{
      isPending ?
        (<>
          <Loader2 className="animate-spin size-4" />
          <span>删除中...</span>
        </>) :
        <span>删除</span>
    }</Button>
  )
}