'use client'

import { loginSchema } from "@/app/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    function onSubmit(data: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            await authClient.signIn.email(
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    onSuccess: () => {
                        toast.success("登录成功");
                        window.location.assign("/");
                    },
                    onError: () => {
                        toast.error("登录失败");
                    }
                }
            )
        })

    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>登录</CardTitle>
                <CardDescription>
                    登录账号
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>邮箱</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} type="email" placeholder="请输入邮箱" {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>密码</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} type="password" placeholder="请输入密码" {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Button type="submit" disabled={isPending} variant="secondary">{
                            isPending ?
                                (<>
                                    <Loader2 className="animate-spin size-4" />
                                    <span>登录中...</span>
                                </>) :
                                <span>登录</span>
                        }</Button>
                        <Button variant="secondary" onClick={() => router.push("/auth/sign-up")} className="w-full cursor-pointer">
                            <Link href="/auth/sign-up">
                                去注册
                            </Link>
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}