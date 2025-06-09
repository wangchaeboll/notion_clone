'use client'

import useScrollTop from "@/hooks/use-scroll-top";
import {cn} from "@/lib/utils";
import Logo from "@/app/_component/Logo";
import {Button} from "@/components/ui/button";
import {useConvexAuth} from "convex/react";
import {SignInButton, UserButton} from "@clerk/clerk-react";
import {Spinner} from "@/components/spinner";
import Link from "next/link";

const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const scrolled = useScrollTop()
    return (
        <div className={cn('z-50 bg-background fixed top-0 flex items-center w-full p-6', scrolled && 'border-b shadow-sm')}>
            <Logo/>
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                {isLoading && ( <Spinner/> )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode={'modal'}>
                            <Button variant={'ghost'} size={'sm'}>
                                Login
                            </Button>
                        </SignInButton>
                        <SignInButton mode={'modal'}>
                            <Button size={'sm'}>
                                Get Jotion free
                            </Button>
                        </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant={'ghost'} size={"sm"} asChild>
                            <Link href={"/documents"}>
                                Enter Jotion
                            </Link>
                        </Button>
                        <UserButton afterSignOutUrl={"/"}/>
                    </>
                )}
            </div>
        </div>
    )
}
export default Navbar
