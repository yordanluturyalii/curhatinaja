import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Home, MessageCircle, Settings } from 'lucide-react';
import Link from 'next/link';

const menus = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home
    },
    {
        title: "Setting",
        url: "/setting",
        icon: Settings
    }
];

const AppSidebar = () => {
    return (
        <Sidebar collapsible='icon' className='border-gray-300 bg-sidebar-gradient'>
            <SidebarHeader className="border-b border-gray-300">
                <div className="flex items-center p-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                    </div>
                    <div className="ml-3">
                        <p className="font-medium">Curhatin Aja</p>
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
                                            <Link href={menu.url}>
                                                <menu.icon />
                                                <span>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar