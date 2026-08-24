import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getToken, preloadAuthQuery } from "@/lib/auth-server";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import BlogList from "@/components/web/home/BlogList";
export const metadata: Metadata = {
  title: "博客 | nextjs 16 教程",
  description: "阅读我们的最新文章和见解",
  category: "网页开发",
};

// 数据获取函数，缓存指令写在这里
async function getMyPosts(token: string | undefined) {
  const preloadedData = await preloadAuthQuery(api.posts.getPostsByMe);
  return preloadedData;
}

export default async function Home() {
  const token = await getToken();
  const preloadedData = await getMyPosts(token);

  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">你的博客</h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">来自你的见解、想法和趋势!</p>
      </div>
      <BlogList preloadedData={preloadedData} token={token} />
    </div>
  );
}
