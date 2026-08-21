import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
export const createPost = mutation({
  args: { title: v.string(), body: v.string(), imageStorageId: v.id("_storage"), describe:v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("未登录，无法创建文章");
    }
    const blogArticle = await ctx.db.insert("posts", {
      body: args.body,
      title: args.title,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
      describe: args.describe
    })
    return blogArticle;
  },
});
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null
        return {
          ...post,
          imageUrl: resolvedImageUrl,
        }
      })
    )
  },
})
export const getPostsByMe = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("未登录，无法查看自己的文章");
    }
    const posts = await ctx.db.query("posts").filter((q) => q.eq(q.field("authorId"), user._id)).order("desc").collect();
    return Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null
        return {
          ...post,
          imageUrl: resolvedImageUrl,
        }
      })
    )
  },
})

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("未登录，无法上传图片");
    }
    return await ctx.storage.generateUploadUrl()
  }
})

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }
    const resolvedImageUrl =
      post?.imageStorageId !== undefined
        ? await ctx.storage.getUrl(post.imageStorageId)
        : null
    return {
      ...post,
      imageUrl: resolvedImageUrl,
    }
  }

})
interface SearchPostResult {
  _id: Id<"posts">;
  title: string;
  body: string;
}
export const searchPost = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;
    const results: Array<SearchPostResult> = [];
    const seen = new Set();
    const pushDocs = (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body
        });
        if (results.length >= limit) break;
      }
    }
    const titleDocs = await ctx.db.query("posts").withSearchIndex("search_title", (q) => q.search('title', args.term)).take(limit);
    pushDocs(titleDocs);  
    if (results.length < limit) {
      const bodyDocs = await ctx.db.query("posts").withSearchIndex("search_body", (q) => q.search('body', args.term)).take(limit);
      pushDocs(bodyDocs);
    }
    return results;
  }
})

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("未登录，无法删除文章");
    }
    const post = await ctx.db.get("posts", args.postId);
    if (!post) {
      throw new ConvexError("文章不存在");
    }
    if (post.authorId !== user._id) {
      throw new ConvexError("您没有权限删除该文章");
    }
    await ctx.db.delete("posts", args.postId);
  }
})

export const getImageUrlQuery = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});