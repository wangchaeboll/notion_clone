import React from 'react'
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import {en} from "@blocknote/core/locales";
import {useEdgeStore} from "@/lib/edgestore";

interface EditorProps {
    onChange: ( value : string ) => void;
    initialContent?: string;
    editable?: boolean;
}

const EditorOld = ({onChange, initialContent, editable}: EditorProps) => {
    const [block, setBlock] = React.useState<Block[]>([]);
    const locale = en;
    const { edgestore } = useEdgeStore();

    const handleUplaod = async (file: File) => {
        const res = await edgestore.publicFiles.upload({
            file
        })

        return res.url
    }

    // const editor: BlockNoteEditor = useCreateBlockNote()
    const editors: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[]: undefined,
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                // We override the empty document placeholder
                emptyDocument: "Start typing..",
            },
        },
        uploadFile: handleUplaod
    })
    return(
        <div>
            <BlockNoteView
                editable={editable}
                editor={editors}
                onChange={(editor) => {
                    onChange(JSON.stringify(editor.document, null, 2))
                }}
            />
        </div>
    )
}
export default EditorOld
