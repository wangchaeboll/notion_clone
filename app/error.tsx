"use client"
import React from 'react'
import Image from 'next/image'
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Error = () => {
    return (
        <div className={"h-full flex flex-col items-center justify-center space-y-4"}>
            <Image src={"/coffee.png"} width={"500"} height={"500"} alt={"Error"}/>
            <h2 className={"text-xl font-medium"}>Something went wrong</h2>
            <Button asChild>
                <Link href={"/documents"}>
                    Go Back
                </Link>
            </Button>
        </div>
    )
}
export default Error
