"use client"
import React, { useState, useEffect} from 'react'
import { SettingModal } from "@/components/modals/setting-modal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) { return null }
    return (
        <>
            <SettingModal />
        </>
    )
}
