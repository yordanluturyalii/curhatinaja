"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Smile, Frown, Meh, Heart, AlertTriangle, Clock, FileText} from "lucide-react"
import Link from "next/link"
import React from "react";

const dummyData = {
    sentiment: "positive" as const,
    moods: [
        {
            mood: "Happy",
            percentage: 65,
            icon: <Smile className="h-5 w-5"/>,
            color: "bg-green-500",
        },
        {
            mood: "Anxious",
            percentage: 25,
            icon: <AlertTriangle className="h-5 w-5"/>,
            color: "bg-yellow-500",
        },
        {
            mood: "Loving",
            percentage: 10,
            icon: <Heart className="h-5 w-5"/>,
            color: "bg-pink-500",
        },
    ],
    summary:
        "Based on our conversation, it seems you were discussing your recent job interview and the stress you've been feeling about the outcome. You expressed various emotions throughout our chat, with predominant feelings of happiness and anxiety. I noticed patterns in your communication style that suggest you're generally optimistic about the situation despite some nervousness about the waiting period.",
    suggestion:
        `
         - Buat To Do list
         - Rajin Makan
         - Rajin Makan
        `
}

export default function ResultsPage() {
    const {sentiment, moods, summary, suggestion} = dummyData

    const getSentimentIcon = () => {
        switch (sentiment) {
            case "positive":
                return <Smile className="h-12 w-12 text-green-500"/>
            case "negative":
                return <Frown className="h-12 w-12 text-red-500"/>
            case "neutral":
                return <Meh className="h-12 w-12 text-yellow-500"/>
        }
    }

    const getSentimentColor = () => {
        switch (sentiment) {
            case "positive":
                return "bg-green-100 border-green-200 text-green-800"
            case "negative":
                return "bg-red-100 border-red-200 text-red-800"
            case "neutral":
                return "bg-yellow-100 border-yellow-200 text-yellow-800"
        }
    }

    return (
        <main className="w-full flex items-center justify-center min-h-screen p-4">
            <Card className="w-full shadow-lg border-none">
                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-xl font-bold mb-4 text-purple-700">Chat Analysis Results</CardTitle>
                </CardHeader>

                <Tabs defaultValue="sentiment" className="">
                    <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
                        <TabsTrigger
                            value="sentiment"
                            className="rounded-full px-6 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                        >
                            Sentiment
                        </TabsTrigger>
                        <TabsTrigger
                            value="mood"
                            className="rounded-full px-6 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                        >
                            Mood
                        </TabsTrigger>
                        <TabsTrigger
                            value="summary"
                            className="rounded-full px-6 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                        >
                            Summary
                        </TabsTrigger>
                        <TabsTrigger
                            value="suggestion"
                            className="rounded-full px-6 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                        >
                            Suggestion
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sentiment" className="p-4">
                        <Card className={"border-gray-200"}>
                            <CardContent className="p-6 flex flex-col items-center space-y-4">
                                {getSentimentIcon()}
                                <h3 className="text-2xl font-bold capitalize">{sentiment}</h3>
                                <Badge className={`px-3 py-1 text-sm ${getSentimentColor()}`}>Overall Sentiment</Badge>
                                <p className="text-center text-gray-600">
                                    {sentiment === "positive"
                                        ? "Your conversation showed predominantly positive emotions and outlook."
                                        : sentiment === "negative"
                                            ? "Your conversation indicated some negative emotions or concerns."
                                            : "Your conversation maintained a balanced emotional tone."}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mood" className="p-4">
                        <Card className={"border-gray-200"}>
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-xl font-bold text-center">Mood Analysis</h3>

                                <div className="space-y-4">
                                    {moods.map((mood, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    {mood.icon}
                                                    <span className="font-medium">{mood.mood}</span>
                                                </div>
                                                <span className="font-bold">{mood.percentage}%</span>
                                            </div>
                                            <Progress value={mood.percentage} bgProgress={mood.color}/>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-500 text-center mt-4">
                                    These percentages represent the detected emotional states during your conversation.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="summary" className="p-4">
                        <Card className={"border-gray-200"}>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FileText className="h-5 w-5 text-primary"/>
                                    <h3 className="text-xl font-bold">Conversation Summary</h3>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-400">
                                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                                </div>

                                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4"/>
                                    <span>5-minute chat session</span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="suggestion" className="p-4">
                        <Card className={"border-gray-200"}>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FileText className="h-5 w-5 text-primary"/>
                                    <h3 className="text-xl font-bold">Conversation Suggestion</h3>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-400">
                                    <p className="text-gray-700 leading-relaxed">{suggestion}</p>
                                </div>

                                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4"/>
                                    <span>5-minute chat session</span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <CardFooter className="border-t border-gray-200 flex items-center justify-center">
                    <Link href="/" className={"bg-purple-800 rounded text-white cursor-pointer mt-4"}>
                        <Button className={"cursor-pointer"}>Start New Session</Button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    )
}

