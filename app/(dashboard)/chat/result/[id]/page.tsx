"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Smile, Frown, Meh, Heart, AlertTriangle, Clock, FileText} from "lucide-react"
import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {createResult} from "@/actions/result";
import Link from "next/link";
import {Button} from "@/components/ui/button";

type ResultResponse = {
    sentiment: string,
    mood: {
        happy: number,
        anxious: number,
        loving: number,
    },
    summary: string,
    suggestions: any[],
    title: string
}

export default function ResultsPage() {
    const [data, setData] = useState<ResultResponse | null>(null);
    const params = useParams();
    const sessionId = params.id;

    useEffect(() => {
        const getResult = async (sessionId: number) => {
            try {
                const result = await createResult(sessionId);
                setData(result.data);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        }

        if (sessionId && !data) {
            getResult(Number(sessionId));
        }
    }, [sessionId, data]);

    if (!data) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analysis results...</p>
                </div>
            </div>
        );
    }

    const getSentimentIcon = () => {
        switch (data.sentiment) {
            case "positive":
                return <Smile className="h-12 w-12 text-green-500"/>
            case "negative":
                return <Frown className="h-12 w-12 text-red-500"/>
            case "neutral":
                return <Meh className="h-12 w-12 text-yellow-500"/>
            default:
                return <Meh className="h-12 w-12 text-yellow-500"/>
        }
    }

    const getSentimentColor = () => {
        switch (data.sentiment) {
            case "positive":
                return "bg-green-100 border-green-200 text-green-800"
            case "negative":
                return "bg-red-100 border-red-200 text-red-800"
            case "neutral":
                return "bg-yellow-100 border-yellow-200 text-yellow-800"
            default:
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
                                <h3 className="text-2xl font-bold capitalize">{data.sentiment}</h3>
                                <Badge className={`px-3 py-1 text-sm ${getSentimentColor()}`}>Overall Sentiment</Badge>
                                <p className="text-center text-gray-600">
                                    {data.sentiment === "positive"
                                        ? "Your conversation showed predominantly positive emotions and outlook."
                                        : data.sentiment === "negative"
                                            ? "Your conversation indicated some negative emotions or concerns."
                                            : "Your conversation maintained a balanced emotional tone."}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mood" className="p-4">
                        <Card className={"border-gray-200"}>
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-xl font-bold text-center text-purple-700">Mood Analysis</h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <Smile className="h-5 w-5"/>
                                                <span className="font-medium">Happy</span>
                                            </div>
                                            <span className="font-bold">{data.mood.happy}%</span>
                                        </div>
                                        <Progress value={data.mood.happy} bgProgress={"bg-green-500"}/>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="h-5 w-5"/>
                                                <span className="font-medium">Anxious</span>
                                            </div>
                                            <span className="font-bold">{data.mood.anxious}%</span>
                                        </div>
                                        <Progress value={data.mood.anxious} bgProgress={"bg-yellow-500"}/>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <Heart className="h-5 w-5"/>
                                                <span className="font-medium">Loving</span>
                                            </div>
                                            <span className="font-bold">{data.mood.loving}%</span>
                                        </div>
                                        <Progress value={data.mood.loving} bgProgress={"bg-red-500"}/>
                                    </div>
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
                                    <FileText className="h-5 w-5 text-purple-700"/>
                                    <h3 className="text-xl font-bold text-purple-700">Conversation Summary</h3>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-400">
                                    <p className="text-gray-700 leading-relaxed">{data.summary}</p>
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
                                    <FileText className="h-5 w-5 text-purple-700"/>
                                    <h3 className="text-xl font-bold text-purple-700">Conversation Suggestions</h3>
                                </div>

                                {data.suggestions && data.suggestions.length > 0 ? (
                                    <div className="space-y-4">
                                        <ul
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-400">
                                            {data.suggestions.map((suggestion, index) => (
                                                <li className="text-gray-700 leading-relaxed" index={index}>- {suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-400">
                                        <p className="text-gray-700 leading-relaxed">No specific suggestions
                                            available.</p>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4"/>
                                    <span>5-minute chat session</span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Card>
        </main>
    )
}