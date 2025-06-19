"use client"
import React from 'react'
import { Id } from "@/convex/_generated/dataModel";
import {useRouter} from "next/navigation";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {ConfirmModal} from "@/components/modals/confirm-modal";

interface BannerProps {
    docId: Id<"documents">;
}

const Banner = ({ docId }:BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);
    const onRemove = () => {
        const promise = remove({ id: docId})

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        })

        router.push("/documents")
    }
    const onRestore = () => {
        const promise = restore({ id: docId})

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        })
    }
    return (
        <div className={"w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center"}>
            <p>This page is in the Trash.</p>
            <Button size={"sm"} className={"border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"} variant={"outline"} onClick={onRestore}>Restore Page</Button>
            <ConfirmModal onAction={onRemove}>
                <Button size={"sm"} className={"border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"} variant={"outline"}>Delete forever</Button>
            </ConfirmModal>
        </div>
    )
}
export default Banner
