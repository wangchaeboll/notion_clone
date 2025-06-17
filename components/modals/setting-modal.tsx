'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader
} from '@/components/ui/dialog'

import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label"

import React from 'react'

export const SettingModal = () => {
    const settings = useSettings()

    return (
        <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className={"text-lg font-semibold"}>My Settings</h2>
                </DialogHeader>
                <div className={"flex items-center justify-between"}>
                    <div className={"flex flex-col gap-y-1"}>
                        <Label>
                            Appearance
                        </Label>
                        <span className={"text-[0.8rem] text-muted-foreground"}>
                            Customize how notion Nowtion looks on your device
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}