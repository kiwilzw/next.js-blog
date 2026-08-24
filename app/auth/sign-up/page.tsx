'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/app/schemas/auth";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });
    const onSubmit = (data: z.infer<typeof signUpSchema>) => {
        startTransition(async () => {
            await authClient.signUp.email(
                {
                    email: data.email,
                    name: data.name,
                    password: data.password,
                },
                {
                    onSuccess: () => {
                        toast.success("注册成功");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("注册失败");
                    }
                }
            )
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>注册</CardTitle>
                <CardDescription>
                    创建一个账号
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>姓名</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="请输入姓名" {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
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
                        <Button type="submit" disabled={isPending} variant="secondary" className="w-full cursor-pointer">
                            {isPending ? <>
                                <Loader2 className="animate-spin size-4" />
                                <span>注册中...</span>
                            </> : <span>注册</span>}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
