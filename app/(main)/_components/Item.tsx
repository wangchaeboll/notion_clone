'use client'
import React from 'react'
import {ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {router} from "next/client";
import {toast} from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useUser} from "@clerk/clerk-react";

interface itemProps{
    id?: Id<"documents">;
    label: string;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearched?: boolean;
    level?: number;
    onExpand?: () => void;
    onClick?: () => void;
    icon: LucideIcon
}

const Item = ({ id, documentIcon, active, level = 0 , onExpand, expanded, isSearched, label, onClick, icon : Icon } :itemProps) => {
    const { user } = useUser();
    const create = useMutation(api.documents.create)
    const archive = useMutation(api.documents.archive)

    const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                event.stopPropagation();
                onExpand?.()
    }

    const onArchived = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>):Promise<void> => {
        event.stopPropagation();

        if(!id) return

        const toastId = toast.loading("Moving to trash")
        try {
            const trash = archive({id});
            toast.success("Note moved to trash", {id: toastId})

        }catch (e){
            toast.error("Failed to archive note", {id: toastId})
        }

        return
    }


    const onCreate = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>):Promise<void> => {
        event.stopPropagation();
        if(!id) return

        // const promise = create({ title: "Untitled", parentDoc: id}).then((documentId):void => {
        //     if(!expanded){
        //         onExpand?.()
        //     }
        // }).then((documentId) => router.push(`/documents/${documentId}`))
        const toastId = toast.loading('Creating a new note')
        try{
            const documentId = await create({ title: "Untitled", parentDoc: id})
            if(!expanded){
                onExpand?.()
             }
            toast.success('Note created successfully', {id: toastId})
            // await router.push(`/documents/${documentId}`)
        }catch(e){
            toast.error('Failed to create a new note', {id: toastId})
            throw new Error('Error at creating note in sidebar')
        }

        // toast.promise(promise, {
        //     loading: 'Creating a new note',
        //     success: 'Note created successfully',
        //     error: 'Failed to create a new note'
        // })
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;
    return (
        <div onClick={onClick} role={'button'} style={{ paddingLeft: level ? `${(level*12)+12}px`:"12px"}}
             className={cn('group hover:bg-primary/5 flex items-center text-muted-foreground font-medium min-h-[27px] cursor-pointer text-sm py-1 pr-3 w-full'
             , active && "bg-primary/5 text-primary"
             )}
        >
            {!!id && (
                <div onClick={handleExpand} className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1" role={'button'} >
                    <ChevronIcon className={'h-4 w-4 shrink-0 text-muted-foreground/50'}/>
                </div>
            )}
            {/*reusing for DOCUMENT_ICON*/}
            {documentIcon ? (<div className={"mr-2 text-[18px] shrink-0"}>{documentIcon}</div>) : (<Icon className={'mr-2 h-[18px] shrink-0 text-muted-foreground'}/>) }
            <span className={'truncate'}>
                {label}
            </span>
            {isSearched && (
                <kbd className={"ml-auto pointer-event-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"}>
                    <span className={'text-xs'}>Ctrl</span>K
                </kbd>
            )}
            {!!id && (
                <div role={'button'} onClick={onCreate} className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                            <div className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-neutral-300 ml-auto">
                                <MoreHorizontal className={"h-4 w-4 text-muted-foreground"}/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={'w-60 z-[99999]'} align={"start"} side={"right"} forceMount>
                            <DropdownMenuItem onClick={onArchived}>
                                <Trash className={"h-4 w-4 mr-2"}/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <div className={"text-xs text-muted-foreground p-2"}>
                                Last edited by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className={"opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300"}>
                        <Plus className={'h-4 w-4 text-muted-foreground'}/>
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: {level?: number}){
    return(
        <div style={{ paddingLeft: level ? `${(level*12)+25}px`: "12px"}} className={'flex gap-x-2 py-[3px]'}>
            <Skeleton className={'h-4 w-4'}/>
            <Skeleton className={'h-4 w-[30%]'}/>
        </div>
    )
}

export default Item
