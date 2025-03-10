'use client'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import React from "react";
import {useRouter} from "next/navigation";

interface VentCardProps {
    id: number;
    title: string;
    date: string;
    personality: string;
    roles: string;
}

const VentCard = ({key, id, title, date, personality, roles} : VentCardProps) => {
    const router = useRouter();

    return (
        <Card
            key={key}
            className="bg-white border-gray-200 rounded-2xl hover:shadow-lg transition-shadow"
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                <p className="text-sm text-gray-500">{date}</p>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">{personality}</span>
                    <span className="px-3 py-1 bg-pink-100 rounded-full text-sm">{roles}</span>
                </div>
                <Button
                    variant="default"
                    className="w-full mt-4 bg-purple-700 transition cursor-pointer text-white hover:bg-purple-600"
                    onClick={() => router.push(`/chat/${id}`)}
                >
                    Lihat Detail
                </Button>
            </CardContent>
        </Card>
    )
}

export default VentCard;