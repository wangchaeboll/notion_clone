import {Dropzone} from "@/components/upload/dropzone";

const Drop = () => {
    return (
        <Dropzone
            dropzoneOptions={{
                maxFiles: 5,
                maxSize: 1024 * 1024 * 2, // 2MB
                accept: {
                    'image/*': ['.jpeg', '.jpg', '.png'],
                },
            }}
        />
    );
};

export default Drop;
