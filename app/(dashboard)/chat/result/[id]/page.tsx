"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Smile, Frown, Meh, Heart, AlertTriangle, Clock, FileText} from "lucide-react"
import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
import {createResult} from "@/actions/result"

type ResultResponse = {
    sentiment: string
    mood: {
        happy: number
        anxious: number
        loving: number
    }
    summary: string
    suggestions: any[]
    title: string
}

export default function ResultsPage() {
    const [data, setData] = useState<ResultResponse | null>(null)
    const params = useParams()
    const sessionId = params.id

    useEffect(() => {
        const getResult = async (sessionId: number) => {
            try {
                const result = await createResult(sessionId)
                setData(result.data)
            } catch (error) {
                console.error("Error fetching results:", error)
            }
        }

        if (sessionId && !data) {
            getResult(Number(sessionId))
        }
    }, [sessionId, data])

    if (!data) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analysis results...</p>
                </div>
            </div>
        )
    }

    const getSentimentIcon = () => {
        switch (data.sentiment) {
            case "positive":
                return <Smile className="h-8 w-8 sm:h-12 sm:w-12 text-green-500"/>
            case "negative":
                return <Frown className="h-8 w-8 sm:h-12 sm:w-12 text-red-500"/>
            case "neutral":
                return <Meh className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500"/>
            default:
                return <Meh className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500"/>
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
        <main className="w-full flex items-center justify-center min-h-screen p-2 sm:p-4">
            <Card className="w-full max-w-4xl mx-auto shadow-lg border-none">
                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-purple-700">
                        Chat Analysis Results
                    </CardTitle>
                </CardHeader>

                <Tabs defaultValue="sentiment" className="w-full">
                    <div className="px-2 sm:px-4 pt-4">
                        <TabsList
                            className="w-full bg-white border border-gray-200 p-1 rounded-full flex flex-wrap justify-center gap-1 sm:gap-0">
                            <TabsTrigger
                                value="sentiment"
                                className="flex-1 text-xs sm:text-sm rounded-full px-2 sm:px-6 py-1.5 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                            >
                                Sentiment
                            </TabsTrigger>
                            <TabsTrigger
                                value="mood"
                                className="flex-1 text-xs sm:text-sm rounded-full px-2 sm:px-6 py-1.5 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                            >
                                Mood
                            </TabsTrigger>
                            <TabsTrigger
                                value="summary"
                                className="flex-1 text-xs sm:text-sm rounded-full px-2 sm:px-6 py-1.5 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                            >
                                Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="suggestion"
                                className="flex-1 text-xs sm:text-sm rounded-full px-2 sm:px-6 py-1.5 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                            >
                                Suggestion
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="sentiment" className="p-2 sm:p-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4 sm:p-6 flex flex-col items-center space-y-3 sm:space-y-4">
                                {getSentimentIcon()}
                                <h3 className="text-xl sm:text-2xl font-bold capitalize">{data.sentiment}</h3>
                                <Badge
                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm ${getSentimentColor()}`}>
                                    Overall Sentiment
                                </Badge>
                                <p className="text-center text-sm sm:text-base text-gray-600">
                                    {data.sentiment === "positive"
                                        ? "Your conversation showed predominantly positive emotions and outlook."
                                        : data.sentiment === "negative"
                                            ? "Your conversation indicated some negative emotions or concerns."
                                            : "Your conversation maintained a balanced emotional tone."}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mood" className="p-2 sm:p-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <h3 className="text-lg sm:text-xl font-bold text-center text-purple-700">Mood
                                    Analysis</h3>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="space-y-1 sm:space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                <Smile className="h-4 w-4 sm:h-5 sm:w-5"/>
                                                <span className="text-sm sm:text-base font-medium">Happy</span>
                                            </div>
                                            <span className="text-sm sm:text-base font-bold">{data.mood.happy}%</span>
                                        </div>
                                        <Progress value={data.mood.happy} bgProgress={"bg-green-500"}/>
                                    </div>

                                    <div className="space-y-1 sm:space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5"/>
                                                <span className="text-sm sm:text-base font-medium">Anxious</span>
                                            </div>
                                            <span className="text-sm sm:text-base font-bold">{data.mood.anxious}%</span>
                                        </div>
                                        <Progress value={data.mood.anxious} bgProgress={"bg-yellow-500"}/>
                                    </div>

                                    <div className="space-y-1 sm:space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                <Heart className="h-4 w-4 sm:h-5 sm:w-5"/>
                                                <span className="text-sm sm:text-base font-medium">Loving</span>
                                            </div>
                                            <span className="text-sm sm:text-base font-bold">{data.mood.loving}%</span>
                                        </div>
                                        <Progress value={data.mood.loving} bgProgress={"bg-red-500"}/>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-4">
                                    These percentages represent the detected emotional states during your conversation.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="summary" className="p-2 sm:p-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-700"/>
                                    <h3 className="text-lg sm:text-xl font-bold text-purple-700">Conversation
                                        Summary</h3>
                                </div>

                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-400">
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{data.summary}</p>
                                </div>

                                <div
                                    className="mt-4 sm:mt-6 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4"/>
                                    <span>5-minute chat session</span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="suggestion" className="p-2 sm:p-4">
                        <Card className="border-gray-200">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-700"/>
                                    <h3 className="text-lg sm:text-xl font-bold text-purple-700">Conversation
                                        Suggestions</h3>
                                </div>
                                {data.suggestions && data.suggestions.length > 0 ? (
                                    <div className="space-y-2 sm:space-y-4">
                                        <ul className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-400">
                                            {data.suggestions.map((suggestion, index) => (
                                                <li className="text-sm sm:text-base text-gray-700 leading-relaxed"
                                                    key={index}>
                                                    - {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-400">
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            No specific suggestions available.
                                        </p>
                                    </div>
                                )}

                                <div
                                    className="mt-4 sm:mt-6 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4"/>
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

