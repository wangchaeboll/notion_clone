import React from 'react'
import Navbar from "@/app/_component/Navbar";

const Layout = ({children,}: Readonly<{children: React.ReactNode; }>) => {
    return (
        <div className={'h-full'}>
            <Navbar/>
            <main className={'h-full pt-40'}>{children}

            </main>
        </div>
    )
}
export default Layout

