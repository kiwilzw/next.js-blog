import { z } from "zod";
export const signUpSchema = z.object({
    name:z.string().min(3,"姓名至少需要3个字符").max(30,"姓名最多30个字符"),
    email:z.email("请输入正确的邮箱格式"),
    password:z.string().min(8,"密码至少需要8个字符").max(30,"密码最多30个字符")
})

export const loginSchema = z.object({
    email:z.email("请输入正确的邮箱格式"),
    password:z.string().min(8,"密码至少需要8个字符").max(30,"密码最多30个字符")
})