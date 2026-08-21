import { Id } from "@/convex/_generated/dataModel";
import { z } from "zod";
const commentSchema = z.object({
    body:z.string().min(3,"内容至少需要3个字符"),
    postId: z.custom<Id<"posts">>(),
})
export { commentSchema }
