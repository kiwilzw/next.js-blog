import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export function SearchInput() {
    const [term, setTerm] = useState("");
    const [open, setOpen] = useState(false);
    const result = useQuery(api.posts.searchPost, term.length >= 2 ? {limit: 5, term: term} : "skip");
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target.value;
        setTerm(t);
        if(t.length >= 2) {
            setOpen(true);
        }else {
            setOpen(false);
        }
    }
    return (
        <div className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search Posts..."
                    className="w-full pl-8 bg-background"
                    value={term}
                    onChange={handleInputChange}
                />
            </div>
            {open && (
                <div className="absolute top-full mt-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                   {result === undefined ? (
                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            搜索中...
                        </div>
                   ) : result.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                            暂无搜索结果
                        </p>
                   ) : (
                        <div className="py-1">
                            {result?.map((item) => (
                                <div key={item._id} className="px-2 py-1">
                                    <Link onClick={() => {setOpen(false);setTerm("")}} href={`/blog/${item._id}`} className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                                        <p className="font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground pt-1">{item.body.substring(0, 50)}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                   )}
                </div>
            )}
        </div>
    )
}