import { Metadata } from "next";
import BlogListClient from "@/components/web/blog/BlogListClient";

export const metadata: Metadata = {
  title: "博客 | nextjs 16 教程",
  description: "阅读我们的最新文章和见解",
  category: "网页开发",
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">我们的博客</h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">来自我们团队的见解、想法和趋势!</p>
      </div>
      <BlogListClient />
    </div>
  );
}
