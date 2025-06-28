"use client"
import React, { use } from 'react'
import {Id} from "@/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Toolbar from "@/components/Toolbar";
import Cover from "@/app/(main)/_components/Cover";
import {Skeleton} from "@/components/ui/skeleton";
// import EditorCodeWIthAntonio from "@/components/EditorCodeWIthAntonio";
import EditorNew from "@/components/EditorNew";

interface DocumentIdPageProps {
    params: Promise<{
        documentId: Id<"documents">
    }>
}

const DocumentIdPage = ( { params }:DocumentIdPageProps) => {
    const { documentId } = use(params);
    const doc = useQuery(api.documents.getById, {
        documentId: documentId
    })

    const update = useMutation(api.documents.update)

    const onChange = async (content: string) => {
        await update({
            id: documentId,
            content
        })
    }

    if (doc === undefined) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if( doc === null ) {
        return (
            <div>
                <Cover.Skeleton />
                <div className={"md:max-w-3xl lg:max-w-4xl mx-auto mt-10"}>
                    <div className={"space-y-4 pl-8 pt-4"}>
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-4 w-[60%]" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={"pb-40"}>
            <Cover url={doc.coverImage}/>
            <div className={"md:max-w-3xl lg:max-w-4xl mx-auto"}>
                <Toolbar initialData={doc}/>
                {/*<EditorCodeWIthAntonio onChange={onChange} initialContent={doc.content} editable/>*/}
                <EditorNew onChange={onChange} initialContent={doc.content} editable/>
                {/*<TestingEditor/>*/}
            </div>
        </div>
    )
}
export default DocumentIdPage
