'use client'

import React from 'react'
import Image from 'next/image';
import { useUser } from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {useMutation} from "convex/react";
import { api } from "@/convex/_generated/api"
import {toast} from "sonner";

const Page = () => {
    const { user } = useUser()
    const create = useMutation(api.documents.create)
    const onCreate = () => {
        const promise = create({
            title: 'Untitled'
        });

        toast.promise(promise, {
            loading: 'Creating a new note',
            success: 'Note created successfully',
            error: 'Failed to create a new note'
        })
    }
    return (
        <div className={'h-full flex flex-col items-center justify-center space-y-4'}>
            <h2 className={'font-semibold text-lg'}>This is where everything happened</h2>
            <Image
                src={'/empty.png'}
                height={300}
                width={300}
                alt={"Empty"}
            />
            <h3>Welcome to <span className={'font-bold'}>{user?.firstName}&apos;s</span> Nowtion</h3>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create A Note
            </Button>
        </div>
    )
}

export default Page
