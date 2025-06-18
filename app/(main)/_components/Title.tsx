"use client"
import React from 'react'
import {Doc} from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {api} from "@/convex/_generated/api";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

interface TitleProps {
    initialData :  Doc<"documents">
}

const Title = ( { initialData }: TitleProps) => {
    const update = useMutation(api.documents.update);
    const [isEditing, setIsEditing ] = React.useState(false);
    const [title, setTitle ] = React.useState(initialData.title || "Untitled");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0);
    }

    const disableInput = () => {
        setIsEditing(false);
    }

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        await update({
            id: initialData._id,
            title: e.target.value || "Untitled"
        });
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") disableInput();
    }

    return (
        <div className={"flex items-center gap-x-1"}>
            {!!initialData.icon && <p>{initialData.icon}</p> }
            {isEditing ?
                (<Input ref={inputRef} value={title} onClick={enableInput} onBlur={disableInput} onChange={onChange} onKeyDown={onKeyDown} className={"h-7 px-2 !ring-0 !outline-none focus-visible:!ring-0 !focus-visible:!outline-none"} /> )
                :
                ( <Button onClick={enableInput} variant={"ghost"} className={"font-normal h-auto p-1"} size={"sm"} ><span className={"truncate"}>{initialData?.title}</span></Button>)}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton () {
    return (
        <Skeleton className={"h-9 w-16 rounded-md"}/>
    )
}
export default Title
