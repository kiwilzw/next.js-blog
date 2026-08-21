
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import Loading from "./loading";
import BlogList from "@/components/web/home/BlogList";


export const metadata: Metadata = {
  title: "博客 | nextjs 16 教程",
  description: "阅读我们的最新文章和见解",
  category: "网页开发",
}
export default async function Home() {

  const token = await getToken();
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">你的博客</h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">来自你的见解、想法和趋势!</p>
      </div>
      <Suspense fallback={<Loading />}>
        <LoadBlogList token={token} />
      </Suspense>
    </div>
  )
}

async function LoadBlogList({ token }: { token: string | undefined }) {
  'use cache'
  cacheLife("minutes");
  cacheTag("MyPosts");
  const preloadedData = await preloadQuery(api.posts.getPostsByMe, {}, { token });


  return (
    <BlogList preloadedData={preloadedData} token={token} />
  )
}
