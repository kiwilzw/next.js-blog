
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";
import { fetchAuthQuery } from "@/lib/auth-server";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

type POST = {
    _id: string;
    title: string;
    body: string;
    imageUrl: string;
};

export const metadata: Metadata ={
    title: "博客 | nextjs 16 教程",
    description:"阅读我们的最新文章和见解",
    category:"网页开发",
}
export default async function BlogPage() {

    return (
        <div className="py-12">
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">我们的博客</h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">来自我们团队的见解、想法和趋势!</p>
            </div>
            <Suspense fallback={<Loading />}>
                <LoadBlogList />
            </Suspense>
        </div>
    )
}

async function LoadBlogList() {
    'use cache'
    cacheLife("hours");
    cacheTag("posts");
    const data = await fetchQuery(api.posts.getPosts,{});
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((post) => (
                <Card key={post._id} className="pt-0 flex flex-col justify-between">
                    <div className="relative w-full h-72 overflow-hidden">
                        <Image
                            src={post.imageUrl ?? "/test.jpg"}
                            alt={post.title}
                            fill
                            className="rounded-t-lg object-cover"
                            unoptimized={true}
                        />
                    </div>
                    <CardContent>
                        <Link href={`/blog/${post._id}`}>
                            <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{post.describe}</p>
                    </CardContent>
                    <CardFooter>
                        <Link className={buttonVariants({
                            variant: "outline",
                            className: "w-full"
                        })} href={`/blog/${post._id}`}>
                            阅读更多
                        </Link>
                    </CardFooter>
                </Card>
            ))}

        </div>
    )
}