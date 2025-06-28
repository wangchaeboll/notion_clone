"use client"
import React from 'react'
import {Id} from "@/convex/_generated/dataModel";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import {useUser} from "@clerk/clerk-react";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Trash} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

interface MenuProps {
    docId: Id<"documents">
}

const Menu = ({ docId }:MenuProps) => {
    const router = useRouter()
    const { user } = useUser()

    const archive = useMutation(api.documents.archive)

    const onArchive = () => {
        const promise = archive({ id: docId })

        toast.promise(promise, {
            success: "Note move to trash!",
            loading: "Moving to trash..",
            error: "Failed to archive note!",
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant={"ghost"}>
                    <MoreHorizontal className={"h-4 w-4"}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-60 z-[99999]"} align={"end"} alignOffset={8} forceMount>
                <DropdownMenuItem className={"cursor-pointer"} onClick={onArchive}>
                    <Trash className={"h-4 w-4 mr-2"}/> Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

Menu.Skeleton = function MenuSkeleton(){
    return (
        <Skeleton className={"h-10 w-10"}/>
    )
}
export default Menu
