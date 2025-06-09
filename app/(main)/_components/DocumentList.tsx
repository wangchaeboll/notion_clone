'use client'

import React, {useState} from 'react'
import {Doc, Id} from "@/convex/_generated/dataModel";
import {useParams, useRouter} from "next/navigation";
import { useQuery } from 'convex/react';
import Item from './Item';
import {api} from "@/convex/_generated/api";
import {FileIcon} from "lucide-react";
import {cn} from "@/lib/utils";

interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?: Doc<"documents">[]
}

const DocumentList = ({ parentDocumentId, level = 0}: DocumentListProps) => {
    const param = useParams()
    const router =  useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }));
    };

    const docs = useQuery(api.documents.getSidebar, {
        parentDoc: parentDocumentId
    })

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    if(docs === undefined) {
        return(
            <>
                <Item.Skeleton level={level}/>
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level}/>
                        <Item.Skeleton level={level}/>
                    </>
                )}
            </>
        )
    }

    return (
        <>
            <p style={{ paddingLeft: level ? `${(level*12)+25}px` : undefined}} className={cn("hidden text-sm font-medium text-muted-foreground/80", level === 0 && "hidden", expanded && "last:block")}>
                No Pages Inside
            </p>
            {docs.map((doc) =>
                (
                    <div key={doc._id}>
                        <Item
                            id={doc._id}
                            onClick={():void => onRedirect(doc._id)}
                            label={doc.title}
                            icon={FileIcon}
                            documentIcon={doc.icon}
                            active={param.documentId === doc._id}
                            level={level}
                            onExpand={()=>onExpand(doc._id)}
                            expanded={expanded[doc._id]}
                        />
                        {expanded[doc._id] && (
                            <DocumentList parentDocumentId={doc._id} level={level + 1}/>
                        )}
                    </div>
                )
            )}
        </>
    )
}
export default DocumentList
