'use client'

import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="bg-gradient-to-b from-purple-100 via-purple-200 to-purple-100">
      <AppSidebar />
      <SessionProvider>
        <SidebarTrigger />
        {children}
      </SessionProvider>
    </SidebarProvider>
  )
}