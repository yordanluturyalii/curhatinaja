"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Send, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface Message {
    id: string
    role: "user" | "ai"
    content: string
}

export default function ChatPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [timeLeft, setTimeLeft] = useState(300)
    const [sessionEnded, setSessionEnded] = useState(false)
    const [progress, setProgress] = useState(100)

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "system-1",
            role: "ai",
            content: "Hi there! I'm here to chat and help you vent. How are you feeling today?",
        },
        {
            id: "user-1",
            role: "user",
            content: "Akhir-akhir ini aku merasa sangat tertekan dengan pekerjaan. Rasanya seperti tidak ada habisnya.",
        },
        {
            id: "ai-2",
            role: "ai",
            content: "Aku mendengarkan. Menurutmu, apa yang membuatmu merasa tertekan di tempat kerja?",
        },
        {
            id: "user-2",
            role: "user",
            content: "Banyak deadline yang menumpuk, atasan selalu menambah beban kerja, dan tim kami kurang komunikasi.",
        },
        {
            id: "ai-3",
            role: "ai",
            content:
                "Kedengarannya memang berat. Tekanan kerja bisa sangat menantang. Apakah kamu sudah mencoba berbicara dengan atasan atau tim mu tentang beban kerja ini?",
        },
    ])

    const [input, setInput] = useState("")

    const personality = searchParams.get("personality") || "santai"
    const role = searchParams.get("role") || "teman"

    const formatLabel = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    useEffect(() => {
        if (timeLeft > 0 && !sessionEnded) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
                setProgress(((timeLeft - 1) / 300) * 100)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !sessionEnded) {
            setSessionEnded(true)
        }
    }, [timeLeft, sessionEnded])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (sessionEnded || !input.trim()) return

        const newUserMessage: Message = {
            id: `user-${messages.length + 1}`,
            role: "user",
            content: input,
        }
        setMessages([...messages, newUserMessage])

        const newAiMessage: Message = {
            id: `ai-${messages.length + 2}`,
            role: "ai",
            content: "Terima kasih sudah berbagi. Aku mendengarkan.",
        }

        setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, newAiMessage])
        }, 1000)

        setInput("")
    }

    return (
        <div className="w-full flex items-center justify-center min-h-screen p-4">
            <div className="flex flex-col h-[80vh] max-w-5xl mx-auto bg-[#F8F5FF] rounded-xl shadow-md overflow-hidden border border-gray-200">
                {/* Header */}
                <header className="p-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Current Session</h1>
                                <p className="text-sm text-gray-600">
                                    AI Role: {formatLabel(role)} | Personality: {formatLabel(personality)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-[#F3F0FF] px-3 py-1.5 rounded-full">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-600">{formatTime(timeLeft)} remaining</span>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                                    onClick={() => setSessionEnded(true)}
                                >
                                    End Session
                                </Button>
                            </div>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-100" />
                    </div>
                </header>

                {/* Chat Container */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 bg-white rounded-t-xl">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                            >
                                {message.role === "ai" && (
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="text-purple-600 text-lg">🤖</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${
                                        message.role === "user" ? "bg-[#F3F0FF] text-gray-800" : "bg-white shadow-sm text-gray-800"
                                    }`}
                                >
                                    {message.content}
                                </div>
                                {message.role === "user" && (
                                    <Avatar className="w-8 h-8">
                                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User" className="rounded-full" />
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {sessionEnded && (
                            <div className="flex justify-center my-6">
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                    <p className="font-medium">Session has ended</p>
                                    <p className="text-sm mt-1">Thank you for sharing.</p>
                                    <Button variant="outline" className="mt-3" onClick={() => router.push("/dashboard")}>
                                        Return to Dashboard
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-300">
                    <form onSubmit={onSubmit} className="max-w-4xl mx-auto flex gap-3">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={sessionEnded ? "Session has ended" : "Type your message..."}
                            disabled={sessionEnded}
                            className="flex-1 bg-[#F3F0FF] border-0 rounded-full text-gray-800 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                        />
                        <Button
                            type="submit"
                            disabled={sessionEnded || !input.trim()}
                            className="bg-purple-600 hover:bg-purple-700 rounded-full px-6 text-white"
                        >
                            <span className="mr-2">Send</span>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

