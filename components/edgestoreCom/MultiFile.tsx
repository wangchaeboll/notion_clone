import React from 'react'
import {FileUploader} from "@/components/upload/multi-file";

const MultiFile = () => {
    return (
        <FileUploader
            maxFiles={5}
            maxSize={1024 * 1024 * 1} // 1 MB
            accept={{
                'application/pdf': [],
                'text/plain': ['.txt'],
            }}
        />
    )
}
export default MultiFile
