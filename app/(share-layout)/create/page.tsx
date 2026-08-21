'use client'
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { createBlogAction, uploaderAction, 
    // uploaderAction
 } from "@/app/actions";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Content } from "@tiptap/react";
export default function CreateRoute() {
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState<Content>("")
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            content: "",
            image: undefined,
            describe:""
        }
    });
    
    const uploader = async (file: File) => {
        console.log("触发uploader", file);
        const imageUrl =await uploaderAction(file)
        
        return imageUrl ?? ""
    };
    // const onImageRemove = async (url: string) => {
    //     console.log("url",url)
    // }
    function onSubmit(values: z.infer<typeof postSchema>) {
        console.log(JSON.stringify(values, null, 2))
        startTransition(async () => {
            await createBlogAction(values);
        });
    }
    return (
        <div className="py-12 scroll-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">创建帖子</h1>
                <p className="text-xl text-muted-foreground pt-4">分享你的想法</p>
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>创建博客文章</CardTitle>
                    <CardDescription>
                        创建一个新的博客文章
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>标题</FieldLabel>
                                        <Input required aria-invalid={fieldState.invalid} placeholder="请输入标题" {...field} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="describe"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>描述</FieldLabel>
                                        <Input required aria-invalid={fieldState.invalid} placeholder="请简单描述一下" {...field} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>内容</FieldLabel>
                                        {/* <Textarea aria-invalid={fieldState.invalid} placeholder="请输入内容" {...field} /> */}
                                        <MinimalTiptapEditor
                                            value={value}
                                            onChange={(content) => {
                                                setValue(content)
                                                field.onChange(content)
                                            }}
                                            className="w-full"
                                            editorContentClassName="p-5"
                                            output="markdown"
                                            placeholder="请输入内容..."
                                            autofocus={true}
                                            editable={true}
                                            editorClassName="focus:outline-hidden"
                                            uploader={uploader}
                                            onPaste={(e,slice) => {
                                                console.log("e触发onPaste", e);
                                                console.log("slice触发onPaste", slice);
                                            }}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="image"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>封面图片<span className="text-sm text-muted-foreground">(最大1MB)</span></FieldLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            aria-invalid={fieldState.invalid}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                field.onChange(file);
                                            }}
                                            className="cursor-pointer"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Button type="submit" disabled={isPending} variant="secondary" className="w-full cursor-pointer">
                                {isPending ? <>
                                    <Loader2 className="animate-spin size-4" />
                                    <span>创建中...</span>
                                </> : <span>创建</span>}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
}