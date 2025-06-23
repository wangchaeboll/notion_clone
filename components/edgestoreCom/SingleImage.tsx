import {SingleImageDropzone} from "@/components/upload/single-image";

const SingleImage = () => {
    return (
        <SingleImageDropzone
            height={200}
            width={200}
            dropzoneOptions={{
                maxSize: 1024 * 1024 * 1, // 1 MB
            }}
        />
    );
};

export default SingleImage;
