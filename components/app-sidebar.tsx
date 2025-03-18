"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarSeparator,
} from "./ui/sidebar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import {DoorClosed, Home, MessageCircle, Settings} from "lucide-react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {signOut} from "next-auth/react";

const menus = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Setting",
        url: "/setting",
        icon: Settings,
    },
]

const AppSidebar = () => {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" className="border-gray-300 bg-sidebar-gradient">
            <SidebarHeader className="border-b border-gray-300">
                <div className="flex items-center p-4">
                    <div
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-800">
                            <MessageCircle className="h-5 w-5 text-white"/>
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="font-medium text-purple-800">Curhatin Aja</p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                menus.map((menu) => (
                                    <SidebarMenuItem key={menu.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={menu.url}
                                                className={cn(
                                                    "transition-colors hover:text-purple-800",
                                                    pathname === menu.url && "text-purple-800 hover:text-red-800",
                                                )}
                                            >
                                                <menu.icon/>
                                                <span
                                                    className={cn(pathname === menu.url && "font-semibold")}>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator/>
            <SidebarFooter>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuButton className="transition-colors cursor-pointer">
                                        <DoorClosed className="w-4 h-4"/>
                                        <span>Log Out</span>
                                    </SidebarMenuButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent className={"bg-white border-none"}>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure want to do log out?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className={"cursor-pointer"}>No</AlertDialogCancel>
                                        <AlertDialogAction
                                            className={"bg-purple-700 text-white cursor-pointer"} onClick={() => signOut()}>Yes</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar

