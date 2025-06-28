"use client"
import React from 'react'
import {useCoverImage} from "@/hooks/use-cover-image";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/upload/single-image";
import {useEdgeStore} from "@/lib/edgestore";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useParams} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import {UploaderProvider, type UploadFn, useUploader} from "@/components/upload/uploader-provider";
import SingleImage from "@/components/edgestoreCom/SingleImage";
import Drop from "@/components/edgestoreCom/Drop";
import MultiImage from "@/components/edgestoreCom/MultiImage";
import MultiFile from "@/components/edgestoreCom/MultiFile";

const CoverImageModal = () => {
    const params = useParams()
    const coverImage = useCoverImage()
    const [file , setFile] = React.useState<File>();
    const [isSubmiting, setIsSubmitting] = React.useState<boolean>(false);
    const { edgestore } = useEdgeStore();

    const update = useMutation(api.documents.update)


    const uploadFn: UploadFn = React.useCallback(
        async ({ file, onProgressChange, signal }) => {
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file,
                signal,
                onProgressChange,
                options: {
                    replaceTargetUrl: coverImage.url,
                },
            });
            // you can run some server action or api here
            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url
            });
            // to add the necessary data to your database
            return res;
        },
        [edgestore],
    );

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose()
    }


    // @ts-ignore
    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-center text-lg font-semibold"}>
                            Cover Image
                    </DialogTitle>
                </DialogHeader>
                <UploaderProvider uploadFn={uploadFn} autoUpload onUploadCompleted={onClose}>
                    <SingleImage/>
                    {/*<MultiImage/>*/}
                    {/*<MultiFile/>*/}
                    {/*<Drop/>*/}
                </UploaderProvider>
                {/*<SingleImageDropzone className={"w-full outline-none"} disabled={isSubmiting} value={file} onChange={onChange}/>*/}
            </DialogContent>
        </Dialog>
    )
}
export default CoverImageModal
