"use client"
import React from 'react'
import {Doc} from "@/convex/_generated/dataModel";
import IconPicker from "@/components/IconPicker";
import {Button} from "@/components/ui/button";
import {ImageIcon, Smile, X} from "lucide-react";
import {useMutation} from "convex/react";
import TextAreaAutosize from "react-textarea-autosize"
import {api} from "@/convex/_generated/api";
import {useCoverImage} from "@/hooks/use-cover-image";
import {toast} from "sonner";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?:  boolean;
}

const Toolbar = ({initialData, preview}: ToolbarProps) => {
    const inputRef = React.useRef<React.ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [value,setValue] = React.useState(initialData.title || "Untitled");

    const coverImage = useCoverImage();

    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);

    const enableInput = () => {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    }

    const disableInput = () => setIsEditing(false)

    const onInput = (value: string) => {
        setValue(value);
        update({id : initialData._id, title: value || "Untitled"})
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput()
        }
    }

    const onSelect = (icon: string ) => {
        const promise = update({
            id: initialData._id,
            icon
        })

        toast.promise(promise, {
            loading: "Adding Icon",
            success: "Icon Added",
            error: "Failed to add Icon",
        })

    }

    const onRemoveIcon = () => {
        const promise = removeIcon({
            id: initialData._id
        })

        toast.promise(promise, {
            loading: "Removing Icon",
            success: "Icon removed",
            error: "Failed to remove Icon",
        })
    }

    return (
        <div className={"pl-[54px] group relative w-full"}>
            {!!initialData.icon && !preview && (
                <div className={"flex items-center gap-x-2 group/icon pt-6"}>
                    <IconPicker onChange={onSelect}>
                        <p className={"text-6xl hover:opacity-75 transition"}>
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button onClick={onRemoveIcon} className={"rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"} size={"icon"} variant={"outline"}>
                        <X className={"h-4 w-4"}/>
                    </Button>
                </div>
            )}
            {!!initialData.icon && preview && (
                <p className={"text-6xl pt-6"}>
                    {initialData.icon}
                </p>
            )}
            <div className={"opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4"}>
                {!initialData.icon && !preview && (
                    <IconPicker onChange={onSelect} asChild>
                        <Button className={"text-muted-foreground text-xs"} variant={"outline"} size={"sm"}>
                            <Smile className={"h-4 w-4 mr-2"}/>
                            Add Icon
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button className={"text-muted-foreground text-xs"} onClick={coverImage.onOpen} variant={"outline"} size={"sm"}>
                        <ImageIcon className={"h-4 w-4 mr-2"}/> Add Cover
                    </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <TextAreaAutosize ref={inputRef} onBlur={disableInput} onKeyDown={onKeyDown} value={value} onChange={(e) => onInput(e.target.value)} className={"text-5xl w-full bg-transparent font-bold break-words outline-none text-[#3F3F3F] resize-none"}/>
            ):(
                <div className={"pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F]"} onClick={enableInput} >
                    {initialData.title}
                </div>
            )}
        </div>
    )
}
export default Toolbar
