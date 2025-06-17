"use client"
import React from 'react'
import {Doc} from "@/convex/_generated/dataModel";

interface TitleProps {
    initialData :  Doc<"documents">
}

const Title = ( initialData: TitleProps) => {
    return (
        <div>Title</div>
    )
}
export default Title
