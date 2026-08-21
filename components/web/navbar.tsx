'use client'
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/web/theme-toggle";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/web/SearchInput";
export function Navbar() {
    const { isLoading, isAuthenticated } = useConvexAuth();
    const router = useRouter();
    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/">
                    <h1 className="text-3xl font-bold">
                        Next
                        <span className="text-primary ">Pro</span>
                    </h1>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                        首页
                    </Link>
                    <Link href="/blog" className={buttonVariants({ variant: "ghost" })}>
                        博客
                    </Link>
                    <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
                        创建博客
                    </Link>
                </div>
            </div>


            <div className="flex items-center gap-2">
                <SearchInput />
                {isLoading ? null : isAuthenticated ? (
                    <Button onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success("已退出登录");
                                router.push("/");
                            },
                            onError: (e) => {
                                toast.error(e.error.message);
                            }
                        }
                    })} className={buttonVariants({ variant: "secondary" })}>
                        退出登录
                    </Button>
                ) : (
                    <>
                        <Link href="/auth/sign-up" className={buttonVariants({ variant: "secondary" })}>
                            注册账号
                        </Link>
                        <Link href="/auth/login" className={buttonVariants({
                            variant: "secondary"
                        })}>
                            登录
                        </Link>
                    </>
                )
                }
                <ThemeToggle />
            </div>

        </nav>
    );
}