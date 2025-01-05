"use client";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar"
import Axios from "axios"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Editor from "@/components/Editor";
import { Separator } from "@/components/ui/separator"
import { ExportMenu } from "@/components/ExportMenu";
import { User } from "firebase/auth";
export default function Page({ user }: { user: User }) {
    const { displayName, email, photoURL } = user;
    const [globalItem, setGlobalItem] = useState<any>(null);
    const getAllDocs = async() => {
       const docs = await Axios.get('/api')
       console.log(docs)
    }
    useEffect(()=>{
        if(email){
            getAllDocs()
        }
    },[])

    return (
        <SidebarProvider>
            <AppSidebar side="left" displayName={`${displayName}`} email={`${email}`} photoURL={`${photoURL}`} setGlobalItem={setGlobalItem} />
            {globalItem ? <>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden sm:block">
                                    <BreadcrumbLink href="#">
                                        My Documents
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden sm:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{globalItem.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="-mr-1 ml-auto flex items-center gap-2">
                            <ExportMenu />

                        </div>
                    </header>
                    <div className="p-4">
                        <Editor />
                    </div>
                </SidebarInset></> : <>
                <div className="flex justify-center items-center h-screen w-screen">
                    have some glitch
                </div>

            </>}

        </SidebarProvider>
    )
}
