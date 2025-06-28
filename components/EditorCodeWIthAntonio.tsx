// "use client"
// import React from 'react'
// import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
// import { Block } from "@blocknote/core";
// import { useCreateBlockNote , useBlockNote} from "@blocknote/react";
//
// interface EditorProps {
//     onChange: ( value : string ) => void;
//     initialContent?: string;
//     editable?: boolean;
// }
//
// const EditorCodeWIthAntonio = ({onChange, initialContent, editable}: EditorProps) => {
//     const [block, setBlock] = React.useState<Block[]>([]);
//
//     // const editor: BlockNoteEditor = useCreateBlockNote()
//     const editors: BlockNoteEditor = useBlockNote({
//         editable,
//         initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[]: undefined,
//         onEditorContentChange: ( editor ) => {
//             onChange(JSON.stringify(editor.topLevelBlockss, null, 2))
//         }
//     })
//
//     return(
//         <div>
//             <BlockNoteView
//                 editor={editors}
//             />
//         </div>
//     )
// }
// export default EditorCodeWIthAntonio
