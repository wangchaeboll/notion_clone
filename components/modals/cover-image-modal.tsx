"use client"
import React from 'react'
import {useCoverImage} from "@/hooks/use-cover-image";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";

const CoverImageModal = () => {
    const coverImage = useCoverImage()

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-center text-lg font-semibold"}>
                            Cover Image
                    </DialogTitle>
                </DialogHeader>
                TODO: Upload Image
            </DialogContent>
        </Dialog>
    )
}
export default CoverImageModal
