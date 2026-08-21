import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    const data = Array.from({ length: 3 });
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((i: any, index) => (
                <Card key={index} className="pt-0">
                    <Skeleton className="w-full h-68 overflow-hidden" />
                    <CardContent>
                        <Skeleton className="w-full h-12" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="w-full h-10" />
                    </CardFooter>
                </Card>
            ))}

        </div>
    )
}