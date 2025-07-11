'use client'
import React from 'react'
import {useConvexAuth} from "convex/react";
import {Spinner} from "@/components/spinner";
import {redirect} from "next/navigation";
import Navigation from "@/app/(main)/_components/Navigation";
import {SearchCommand} from "@/components/search-command";


const MainLayout = ({children}: Readonly<{ children: React.ReactNode; }>) => {
    const {isAuthenticated, isLoading} = useConvexAuth();

    if(isLoading){
        return (
            <div className={"h-full flex items-center justify-center"}><Spinner size={'lg'}/></div>
        )
    }

    if(!isAuthenticated) return redirect('/')

    return (
        <div className={'h-full flex'}>
            <Navigation/>

            <main className={'flex-1 h-full overflow-y-scroll mt-6'}>
                <SearchCommand />
                {children}
            </main>
        </div>
    )
}
export default MainLayout
