import React, {ElementRef, useEffect, useRef, useState} from 'react'

import {useMediaQuery} from "usehooks-ts";
import {useSearch} from "@/hooks/use-search";
import {useSettings} from "@/hooks/use-settings";


import {useParams, usePathname, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

import {toast} from "sonner";

import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";

import {ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash} from "lucide-react";
import UserItem from "@/app/(main)/_components/UserItem";
import Item from "@/app/(main)/_components/Item";
import DocumentList from "@/app/(main)/_components/DocumentList";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import TrashBox from "@/app/(main)/_components/TrashBox";
import Navbar from "@/app/(main)/_components/Navbar"



const Navigation = () => {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<'aside'>>(null);
    const navbarRef = useRef<ElementRef<'div'>>(null);
    const [isResetting,  setResetting] = useState<boolean>(false);
    const isMobile = useMediaQuery("(max-width: 768px)")
    const [isCollapsed, setCollapsed] = useState(isMobile);

    const search = useSearch()
    const setting = useSettings()

    const create = useMutation(api.documents.create)


    useEffect(()=>{
        setCollapsed(isMobile)
    }, [isMobile])

    useEffect(()=>{
        if(isMobile){
            collapsed()
        }else{
            resetWidth()
        }
    }, [isMobile])

    useEffect(() => {
        if(isMobile) collapsed()
    }, [pathname, isMobile]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizingRef.current) return;
        let newWidth = event.clientX;

        if(newWidth < 240 ) newWidth = 240;
        if(newWidth > 480) newWidth = 480;

        if(sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);

        }

    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    const resetWidth = () => {
        if(sidebarRef.current && navbarRef.current) {
            setCollapsed(false);
            setResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" :"240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0"  : "calc(100% - 240px)"
            );
            navbarRef.current.style.setProperty(
                "left",
                isMobile ? "100"  : "240px"
            );
            setTimeout(() => setResetting(false), 300)
        }
    }

    const collapsed = () => {
        if(sidebarRef.current && navbarRef.current) {
            setCollapsed(true);
            setResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty(
                "width", "100%"
            );
            navbarRef.current.style.setProperty(
                "left", "0"
            );
            setTimeout(() => setResetting(false), 300)
        }
    }

    const handleCreate = () => {
        const promise = create({
            title: 'Untitled'
        }).then((thisshitisdocumemtIdsowheneverucreatesomethingupdateorremovethisshitwillreturnthedocId) =>
            router.push(`/documents/${thisshitisdocumemtIdsowheneverucreatesomethingupdateorremovethisshitwillreturnthedocId}`));

        // console.log(promise) dont return value because no await REMEMBER!!

        toast.promise(promise, {
            loading: 'Creating a new note',
            success: 'Note created successfully',
            error: 'Failed to create a new note'
        })
    }

    return (
        <>
            <aside ref={sidebarRef}
                className={cn('group/sidebar h-full bg-secondary overflow-y-auto overflow-x-hidden relative flex w-60 flex-col z-[99999]',
                isResizingRef && "transition-all ease-in-out duration-300",
                isMobile && "w-0")}
            >
                <div role={'button'}
                     onClick={collapsed}
                     className={cn('h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 absolute top-4 right-4 opacity-0 group-hover/sidebar:opacity-100',
                     isMobile && "opacity-100"
                     )}
                >
                    <ChevronsLeft className={'h-6 w-6'}/>
                </div>
                <div className={cn('flex-1 opacity-100 transition-opacity', isCollapsed && "opacity-0")}>
                    <div>
                        <UserItem/>
                        <Item label={'Search'} isSearched icon={Search} onClick={search.onOpen} />
                        <Item label={'Setting'} icon={Settings} onClick={setting.onOpen} />
                        <Item onClick={handleCreate} label={'New Page'} icon={PlusCircle}/>
                    </div>
                    <div className={"mt-4"}>
                        <DocumentList/>
                        <Item label={"Add A page"} onClick={handleCreate} icon={Plus}/>

                        <Popover>
                            <PopoverTrigger className={"w-full my-4"}>
                                <Item label={"Trash"} icon={Trash}/>
                                <PopoverContent className={'p-0 w-72'} side={isMobile ? "bottom": "right"}>
                                    <TrashBox/>
                                </PopoverContent>
                            </PopoverTrigger>
                        </Popover>
                    </div>
                </div>

                <div onMouseDown={handleMouseDown} onClick={resetWidth} className={'opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'}/>
            </aside>
            <div onClick={resetWidth} ref={navbarRef} className={cn("absolute top-0 z-[99999] w-[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-150", isMobile && "left-0 w-full")}>
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ): (
                    <nav className={"bg-transparent px-3 py-2 w-full"}>
                        {isCollapsed && <MenuIcon role={'button'} className={"h-6 w-6 text-muted-foreground"}/>}
                    </nav>
                )}
            </div>

        </>
    )
}
export default Navigation
