import { z } from "zod";
const postSchema = z.object({
    title:z.string().min(3,"标题至少需要3个字符").max(50,"标题最多50个字符"),
    content:z.string().min(8,"内容至少需要8个字符"),
    describe:z.string().optional(),
    image:z.instanceof(File).refine(file=>file.size>0,"请选择图片").refine(file=> file.size<=1024*1024*1,"图片大小不能超过1MB"),
})
export { postSchema }
