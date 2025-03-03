"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold">CurhatinAja</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary">
                            Login
                        </Link>
                        <Button size="sm" className="rounded-full bg-white text-gray-800 hover:bg-gray-100 py-4">
                            <Link href={"/register"}>
                                Register
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

