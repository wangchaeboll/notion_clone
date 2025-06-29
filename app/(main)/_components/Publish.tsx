"use client"
import React from 'react'
import {Doc} from "@/convex/_generated/dataModel";
import useOrigin from "@/hooks/use-origin";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, Copy, Globe} from "lucide-react";

interface PublishProp {
    initialData : Doc<"documents">
}

const Publish = ({ initialData }: PublishProp) => {
    const origin = useOrigin()
    const update = useMutation(api.documents.update)
    const [copied, setCopied] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = async () => {
        setIsSubmitting(true)

        const promise = update({id: initialData._id, isPublished:true})
            .finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            success: "Page successfully Published!",
            error: "Failed to publish!",
            loading: "Trying to publish...",
        })
    }

    const onUnPublish = async () => {
        setIsSubmitting(true)

        const promise = update({id: initialData._id, isPublished:false})
            .finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            success: "Page unpublished!",
            error: "Failed to unpublish!",
            loading: "Trying to unpublish...",
        })
    }

    const  onCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)

        setTimeout(() => { setCopied(false)}, 1000)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant={"ghost"}>
                    Publish {initialData.isPublished && (
                        <Globe className={"text-sky-500 w-4 h-4 ml-2"}/>
                )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={"w-72"} align={"end"} alignOffset={8} forceMount>
                {initialData.isPublished ? (
                    <div className={"space-y-4"}>
                        <div className={"flex items-center gap-x-2"}>
                            <Globe className={"text-sky-500 animate-pulse h-4 w-4"}/>
                            <p className={"text-xs font-medium text-sky-500"}>This note is live on web</p>
                        </div>
                        <div className="flex item-center">
                            <input disabled className={"flex-1 px-2 text-xs border rounded-l-md"} type="text" value={url}/>
                            <Button className={"h-8 rounded-l-none"} disabled={copied} onClick={onCopy}>{copied ? (<Check className={"h-4 w-4 "}/>): <Copy className={"h-4 w-4 "}/>}</Button>
                        </div>
                        <Button size={"sm"} disabled={isSubmitting} className={"w-full text-xs"} onClick={onUnPublish}>Unpublish</Button>
                    </div>

                ) : (
                    <div className={"flex flex-col items-center justify-center"}>
                        <Globe className={"h-8 w-8 text-muted-foreground mb-2"}/>
                        <p className={"text-sm font-medium mb-2"}>Publish this note</p>
                        <span className={"text-xs text-muted-foreground mb-4"}>share your work with other</span>
                        <Button size={"sm"} className={"w-full text-xs"}  disabled={isSubmitting} onClick={onPublish}>Publish</Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
export default Publish
