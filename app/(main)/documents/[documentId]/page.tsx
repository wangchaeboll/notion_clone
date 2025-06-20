"use client"
import React from 'react'
import {Id} from "@/convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Toolbar from "@/components/Toolbar";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">
    }
}

const DocumentIdPage = ( { params }:DocumentIdPageProps) => {
    const doc = useQuery(api.documents.getById, {
        documentId: params.documentId
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
            <div className={"h-[35vh]"}/>
            <div className={"md:max-w-3xl lg:max-w-4xl mx-auto"}>
                <Toolbar initialData={doc}/>
            </div>
        </div>
    )
}
export default DocumentIdPage
