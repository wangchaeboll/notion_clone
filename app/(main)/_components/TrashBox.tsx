"use client"
import React from 'react'

import {redirect, useParams, useRouter} from "next/navigation";

import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

import {toast} from "sonner";

import {Search, Undo, Trash} from "lucide-react";
import {Spinner} from "@/components/spinner";
import {Input} from "@/components/ui/input";
import {ConfirmModal} from "@/components/modals/confirm-modal";

const TrashBox = () => {
    const router = useRouter();
    const params = useParams()
    const docs = useQuery(api.documents.getTrash)
    const restore = useMutation(api.documents.restore)
    const remove =  useMutation(api.documents.remove)
    const [search, setSearch] = React.useState('')

    const filterDocs = docs?.filter((doc) => {
        return doc.title.toLowerCase().includes(search.toLowerCase())
    })

    const onClick = (documentId : Id<"documents">) => {
        router.push(`documents/${documentId}`)
    }

    const onRestore = async (e: React.MouseEvent<HTMLElement, MouseEvent>,documentId:Id<"documents">) => {
        e.stopPropagation()
        const toastId = toast.loading("Restoring Notes...")
        try{
            const doc = await restore({ id: documentId})
            toast.success("Note Restored!", {id: toastId})
        }catch (e) {
            toast.error("Failed to restore Note!", {id: toastId})
            throw new Error('Error to restore Note')
        }
    }
    const onRemove = ( documentId:Id<"documents">) => {
        const toastId = toast.loading("Deleting Notes...")
        try{
            const doc = remove({ id: documentId})
            toast.success("Note Deleted!", {id: toastId})
        }catch (e) {
            toast.error("Failed to Delete Note!", {id: toastId})
            throw new Error('Error to delete Note')
        }

        if(params.documentId === documentId){
            redirect("/documents")
        }
    };

    if(docs === undefined){
        return(
            <div className={'h-full items-center justify-center flex p-4'}>
                <Spinner size={"lg"}/>
            </div>
        )
    }

    return (
        <div className={'text-sm'}>
            <div className={"flex items-center gap-x-1 p-2"}>
                <Search className={"h-4 w-4"}/>
                <Input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className={"h-7 px-2 focus-visible:ring-transparent bg-secondary"}
                    placeholder={"Search by Page title..."}
                />
            </div>
            <div className={'my-2 px-1 pb-1'}>
                <p className={"hidden last:block text-xs text-center text-muted-foreground"}>No Documents Found</p>
                {filterDocs?.map((doc) => (
                    <div
                        key={doc._id}
                        role={"button"}
                        onClick={():void => onClick(doc._id)}
                        className={"text-sm rounded-sm w-full hover:bg-primary/5 flex items-center justify-between text-primary"}
                    >
                        <span className={'truncate pl-2'}>
                            {doc.title}
                        </span>
                        <div className="flex items-center">
                            <div className={"rounded-sm p-2 hover:bg-neutral-200"} role={'button'} onClick={(e) => onRestore(e, doc._id)}>
                                <Undo className={'h-4 w-4 text-muted-foreground'}/>
                            </div>
                            <ConfirmModal onAction={() => onRemove(doc._id)}>
                            <div className={"rounded-sm p-2 hover:bg-neutral-200"} role={'button'} ><Trash className={"h-4 w-4 text-muted-foreground"}/></div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrashBox
