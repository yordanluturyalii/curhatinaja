"use client"

import type React from "react"

import {useState, useEffect, useRef} from "react"
import {useParams, useRouter, useSearchParams} from "next/navigation"
import {Send, Clock} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Avatar} from "@/components/ui/avatar"
import {Progress} from "@/components/ui/progress"
import createChat, {getChats} from "@/actions/chat";
import Markdown from "react-markdown";
import {updateSession} from "@/actions/session";
import Image from "next/image";

interface Message {
    id: string
    role: "user" | "ai"
    content: string | undefined
}

export default function ChatPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [sessionEnded, setSessionEnded] = useState(false)
    const [progress, setProgress] = useState(100)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "system-1",
            role: "ai",
            content: "Hai! Saya di sini untuk mengobrol dan membantumu curhat. Apa yang kamu rasakan hari ini?",
        },
    ])

    const [input, setInput] = useState("")

    const personality = searchParams.get("personality") || "santai"
    const role = searchParams.get("role") || "teman"
    const sessionId = params.id;

    const formatLabel = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const cachedTime = sessionStorage.getItem(`chat_time_${sessionId}`)
                if (cachedTime) {
                    const parsedTime = parseInt(cachedTime, 10)
                    if (!isNaN(parsedTime)) {
                        setTimeLeft(parsedTime)
                        setProgress(Math.round((parsedTime / 300) * 100))
                    }
                }

                const result = await getChats(Number(sessionId))
                if (result.data) {
                    const initialMessages: Message[] = [{
                        id: "system-1",
                        role: "ai",
                        content: "Hai! Saya di sini untuk mengobrol dan membantumu curhat. Apa yang kamu rasakan hari ini?",
                    }];

                    if (result.data.message && result.data.message.length > 0) {
                        const formattedMessages: Message[] = result.data.message.map((msg, index) => ({
                            id: `${msg.role}-${index}`,
                            role: msg.role as "user" | "ai",
                            content: msg.message
                        }))
                        setMessages([...initialMessages, ...formattedMessages]);
                    }

                    if (result.data.session) {
                        const {timeRemaining, ended} = result.data.session
                        setTimeLeft(timeRemaining !== undefined ? timeRemaining : 300)
                        setProgress(Math.round(((timeRemaining || 300) / 300) * 100))
                        setSessionEnded(ended || false)
                    }
                }
            } catch (error) {
                console.error("Failed to load chat history:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadChatHistory();
    }, [sessionId]);

    useEffect(() => {
        if (timeLeft && timeLeft > 0 && !sessionEnded && !isLoading) {
            const timer = setTimeout(() => {
                const newTimeLeft = timeLeft - 1
                setTimeLeft(newTimeLeft)
                setProgress(Math.round((newTimeLeft / 300) * 100))

                sessionStorage.setItem(`chat_time_${sessionId}`, newTimeLeft.toString())

                if (newTimeLeft % 10 === 0 || newTimeLeft <= 10) {
                    saveSessionStatus(Number(sessionId), newTimeLeft, false)
                }
            }, 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !sessionEnded) {
            setSessionEnded(true)
            saveSessionStatus(Number(sessionId), 0, true)
            router.push(`/chat/result/${Number(sessionId)}`)
        }
    }, [timeLeft, sessionEnded, isLoading, sessionId])

    const saveSessionStatus = async (sessionId: number, timeRemaining: number, ended: boolean) => {
        try {
            const formData = new FormData()
            formData.append("sessionId", sessionId.toString())
            formData.append("timeRemaining", timeRemaining.toString())
            formData.append("ended", ended.toString())

            await updateSession(formData)
        } catch (error) {
            console.error("Failed to save session status:", error)
        }
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages])

    const formatTime = (seconds: number | null) => {
        if (seconds === null) return "5:00"
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (submitting || sessionEnded || !input.trim()) return

        setSubmitting(true)

        try {
            const newUserMessage: Message = {
                id: `user-${messages.length + 1}`,
                role: "user",
                content: input,
            }

            setMessages(prev => [...prev, newUserMessage])

            const formData = new FormData();
            formData.append("message", input);
            formData.append("role", role);
            formData.append("personality", personality);
            formData.append("sessionId", sessionId.toString());

            setInput("")

            const result = await createChat(formData);

            if (result.data?.message) {
                const newAiMessage: Message = {
                    id: `ai-${messages.length + 2}`,
                    role: "ai",
                    content: result.data.message,
                }
                setMessages(prev => [...prev, newAiMessage])
            }
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading chat session...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex items-center justify-center min-h-screen p-4">
            <div
                className="flex flex-col h-[80vh] w-full max-w-5xl mx-auto bg-[#F8F5FF] rounded-xl shadow-md overflow-hidden border border-gray-200">
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
                                    <Clock className="w-4 h-4 text-purple-600"/>
                                    <span
                                        className="text-sm font-medium text-purple-600">{formatTime(timeLeft)} remaining</span>
                                </div>
                                <Button
                                    variant="destructive"
                                    className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full cursor-pointer"
                                    onClick={async () => {
                                        setSessionEnded(true)
                                        await saveSessionStatus(Number(sessionId), 0, true)
                                        router.push(`/chat/result/${Number(sessionId)}`)
                                    }}
                                >
                                    End Session
                                </Button>
                            </div>
                        </div>
                        <Progress value={progress} bgProgress={"bg-purple-600"}/>
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
                                    <div
                                        className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="text-purple-600 text-lg">🤖</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${
                                        message.role === "user" ? "bg-[#F3F0FF] text-gray-800" : "bg-white shadow-sm text-gray-800"
                                    }`}
                                >
                                    {
                                        message.role === "ai" ?
                                            <Markdown>{message.content}</Markdown> :
                                            <span>{message.content}</span>
                                    }
                                </div>
                                {message.role === "user" && (
                                    <Avatar className="w-8 h-8">
                                        <Image
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                            alt="User" className="rounded-full"/>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {sessionEnded && (
                            <div className="flex justify-center my-6">
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                                    <p className="font-medium">Session has ended</p>
                                    <p className="text-sm mt-1">Thank you for sharing.</p>
                                    <Button variant="outline" className="mt-3"
                                            onClick={() => router.push("/dashboard")}>
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
                            disabled={sessionEnded || submitting}
                            name={"message"}
                            className="flex-1 bg-[#F3F0FF] border-0 rounded-full text-gray-800 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                        />
                        <Button
                            type="submit"
                            disabled={sessionEnded || submitting || !input.trim()}
                            className="bg-purple-600 hover:bg-purple-700 rounded-full px-6 text-white"
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span className="mr-2">Send</span>
                                    <Send className="w-4 h-4"/>
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}