'use server'
import z from "zod";
import { postSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { updateTag } from "next/cache";
// import { getImageUrlAction } from "@/convex/posts";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
    try {
        const parsed = postSchema.safeParse(values);
        if (!parsed.success) {
            throw new Error("Invalid input");
        }
        const token = await getToken();
        const imageUrl = await fetchMutation(api.posts.generateImageUploadUrl, {}, { token });

        const uploadResult = await fetch(imageUrl, {
            method: "POST",
            headers: {
                "Content-Type": parsed.data.image!.type
            },
            body: parsed.data.image,
        })
        if (!uploadResult.ok) {
            return {
                error: "Failed to upload image"
            }
        }
        const { storageId } = await uploadResult.json();
        await fetchMutation(api.posts.createPost, {
            body: parsed.data.content,
            title: parsed.data.title,
            imageStorageId: storageId,
            describe: parsed.data.describe ?? ""
        }, { token });
    } catch (e) {
        return {
            error: "Failed to create post"
        };
    }
    redirect("/blog");
}

export async function getPostsAction() {
    const token = await getToken();
    const posts = await fetchQuery(api.posts.getPosts, {}, { token });
    return posts;
}

export async function uploaderAction(file: File) {
    const token = await getToken();
    const uploadUrl = await fetchMutation(api.posts.generateImageUploadUrl, {}, { token });
    const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file
    });
    if (!uploadResult.ok) throw new Error("上传失败");
    const { storageId } = await uploadResult.json();
    const imageUrl = await fetchQuery(api.posts.getImageUrlQuery, { storageId });
    return imageUrl;
}