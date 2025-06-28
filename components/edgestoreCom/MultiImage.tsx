import React from 'react'
import {ImageUploader} from "@/components/upload/multi-image";

const MultiImage = () => {
    return (
        <ImageUploader
            maxFiles={10}
            maxSize={1024 * 1024 * 1} // 1 MB
        />
    )
}
export default MultiImage
