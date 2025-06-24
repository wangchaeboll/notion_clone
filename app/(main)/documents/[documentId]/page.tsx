"use client"
import React, { use } from 'react'
import {Id} from "@/convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Toolbar from "@/components/Toolbar";
import Cover from "@/app/(main)/_components/Cover";

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
                Not Found
            </div>
        )
    }

    return (
        <div className={"pb-40"}>
            <Cover url={doc.coverImage}/>
            <div className={"md:max-w-3xl lg:max-w-4xl mx-auto"}>
                <Toolbar initialData={doc}/>
            </div>
        </div>
    )
}
export default DocumentIdPage
