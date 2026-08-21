'use client'
import { api } from "@/convex/_generated/api";
import usePresence, { PresenceState } from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { Id } from "@/convex/_generated/dataModel";
interface iAppProps {
    roomId: Id<"posts">;
    userId: string;
}
export default function PostPresence({ roomId, userId }: iAppProps) {
    const presenceState: PresenceState[] | undefined = usePresence(api.presence, roomId, userId);
    if (!presenceState || presenceState.length === 0) return null;


    return (
        <div className="flex items-center gap-2">
            <p className="text-xs tracking-wide text-muted-foreground">正在观看</p>
            <div className="text-black">
                <FacePile presenceState={presenceState ?? []} />
            </div>
        </div>

    );
}