"use client"
import React from 'react'
import {useCoverImage} from "@/hooks/use-cover-image";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { SingleImageDropzone} from "@/components/upload/single-image";
import {useEdgeStore} from "@/lib/edgestore";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useParams} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";

const CoverImageModal = () => {
    const params = useParams()
    const coverImage = useCoverImage()
    const [file , setFile] = React.useState<File>();
    const [isSubmiting, setIsSubmitting] = React.useState<boolean>(false);
    const { edgestore } = useEdgeStore();

    const update = useMutation(api.documents.update)

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose
    }

    const onChange = async (file?: File){
        if(file){
            setIsSubmitting(true);
            setFile(file)

            const res = await edgestore.publicFiles.upload({
                file
            })

            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url
            })

            onClose()
        }
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-center text-lg font-semibold"}>
                            Cover Image
                    </DialogTitle>
                </DialogHeader>
                <SingleImageDropzone className={"w-full outline-none"} disabled={isSubmiting} value={file} onChange={onChange}/>
            </DialogContent>
        </Dialog>
    )
}
export default CoverImageModal
