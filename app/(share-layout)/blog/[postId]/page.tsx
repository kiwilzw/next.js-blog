import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import PostPresence from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import PostSkeleton from "@/components/web/PostSkeleton";
import { MarkdownViewer } from "@/components/web/post/MarkdownViewer";

interface PostIdRouteProps {
    params: Promise<{ postId: Id<"posts"> }>
}

export async function generateMetadata({ params }: PostIdRouteProps): Promise<Metadata> {
    const { postId } = await params;
    const post = await fetchQuery(api.posts.getPostById, { postId });

    if (!post) {
        return {
            title: "文章不存在",
            description: "文章不存在",
            category: "网页开发",
        }
    }
    return {
        title: post.title,
        description: post.body,
        category: "网页开发",
    }
}
// page.tsx｜Server Component
async function loadPostData(postId: Id<"posts">, token: string | undefined) {
    'use cache'
    cacheLife("minutes");
    cacheTag("posts");

    const [post, preloadComments, userId] = await Promise.all([
        fetchQuery(api.posts.getPostById, { postId }),
        preloadQuery(api.comments.getCommentsByPostId, { postId }),
        fetchQuery(api.presence.getUserId, {}, { token })
    ])
    return { post, preloadComments, userId }
}
export default async function PostIdRoute({ params }: PostIdRouteProps) {

    const { postId } = await params;
    const token = await getToken();
    const { post, preloadComments, userId } = await loadPostData(postId, token);

    if (!post) {
        throw new Error("Post not found");
    }
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Link href="/blog" className={buttonVariants({
                variant: "outline",
                className: "mb-4"
            })}>
                <ArrowLeft className="size-4" />回到博客
            </Link>
            <Suspense fallback={<PostSkeleton />}>

                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
                    <Link href={`/blog/${postId}/image?img=${post.imageUrl ?? "/test.jpg"}`}>
                        <Image
                            src={post.imageUrl ?? "/test.jpg"}
                            alt={post.title}
                            fill
                            className="rounded-t-lg object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                            unoptimized={true}
                        />
                    </Link>
                </div>
                <div className="flex flex-col space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">发布于 {new Date(post._creationTime).toLocaleDateString()}</p>
                        {userId && <PostPresence roomId={post._id} userId={userId} />}
                    </div>
                </div>
                <Separator className="my-8" />
                {/* <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.body}</p> */}
                <MarkdownViewer content={post.body} />
                <Separator className="my-8" />
                <CommentSection preloadComments={preloadComments} />
            </Suspense>

        </div>
    )
}