import React from 'react'

import { ChevronsLeftRight} from "lucide-react";

import {SignOutButton, useUser} from "@clerk/clerk-react";

import {
    Avatar, AvatarImage
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

const UserItem = () => {
    const { user  } = useUser();
    return (
       <DropdownMenu>
           <DropdownMenuTrigger asChild>
               <div className="flex items-center justify-between text-sm p-3 w-full hover:bg-primary/5" role={'button'}>
                   <div className="gap-x-2 flex items-center max-w-[150px]">
                       <Avatar className={"h-8 w-8"}>
                           <AvatarImage src={user?.imageUrl}/>
                       </Avatar>
                       <span className={'font-medium line-clamp-1 text-start'}>{user?.fullName}&apos;s</span>
                   </div>
                   <ChevronsLeftRight className={'rotate-90 ml-2 text-muted-foreground h-4 w-4'}></ChevronsLeftRight>
                   <div></div>
               </div>
           </DropdownMenuTrigger>
           <DropdownMenuContent className={'w-80 z-[99999]'} align={'start'} alignOffset={11} forceMount>
               <div className={'flex flex-col space-y-4 p-2'}>
                   <p className="text-xs font-medium leading-none text-muted-foreground">
                       {user?.emailAddresses[0].emailAddress}
                   </p>
                   <div className="flex items-center gap-x-2">
                       <div className="rounded-md bg-secondary p-1">
                           <Avatar className={"h-8 w-8"}>
                               <AvatarImage src={user?.imageUrl}/>
                           </Avatar>
                       </div>
                       <div className="space-y-1">
                           <p className="text-sm line-clamp-1">
                               {user?.fullName}&apos;s Nowtion
                           </p>
                       </div>
                   </div>
               </div>
               <DropdownMenuSeparator/>
               <DropdownMenuItem className={'flex flex-col items-center justify-center'}>
                   <Button asChild className={'cursor-pointer'}>
                       <SignOutButton/>
                   </Button>
               </DropdownMenuItem>
           </DropdownMenuContent>
       </DropdownMenu>
    )
}
export default UserItem
