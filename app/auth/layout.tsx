import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen flex justify-center items-center">
                <div className="absolute top-5 left-5">
                    <Link href="/" className={buttonVariants({variant: "secondary"})}>
                        <ArrowLeft className="size-4" />
                        返回首页
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto">
                    {children}
                </div>  
            </div>
        </>
    );
}   