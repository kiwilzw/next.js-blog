'use client'
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

type POST = {
  _id: string;
  title: string;
  body: string;
  imageUrl: string;
  describe?: string;
};

export default function BlogListClient() {
  const posts = useQuery(api.posts.getPosts);

  if (posts === undefined) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post) => (
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
            <Link
              className={buttonVariants({ variant: "outline", className: "w-full" })}
              href={`/blog/${post._id}`}
            >
              阅读更多
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
