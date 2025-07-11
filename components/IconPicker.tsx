"use client"
import React from 'react'

import EmojiPicker from "emoji-picker-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface IconPickerProps {
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}

const IconPicker = ({ onChange, children}: IconPickerProps) => {

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className={"p-0 w-full border-none shadow-none"}>
                <EmojiPicker height={350} onEmojiClick={(data) => onChange(data.emoji)}/>
            </PopoverContent>
        </Popover>
    )
}
export default IconPicker
