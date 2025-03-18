'use client';

import NewChatModal from '@/app/(dashboard)/_components/new-chat-modal';
import {Button} from '@/components/ui/button';
import {Card, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import React, {useEffect, useState} from 'react'
import VentCard from "@/app/(dashboard)/_components/vent-card";
import {getSessions} from "@/actions/session";

type Session = {
    data: {
        id: number;
        title: string;
        date: string | Date;
        role: string;
        personality: string;
    }[],
    total: number;
    totalThisMonth: number;
    favoritePersonality: string;
}

const Dashboard = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [data, setData] = useState<Session | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getSession = async () => {
            try {
                setIsLoading(true);
                const session = await getSessions();
                const formattedData = {
                    ...session,
                    data: session.data.map(item => ({
                        ...item,
                        date: item.date instanceof Date ? formatDate(item.date) : item.date
                    }))
                };
                setData(formattedData);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (!data) getSession();
    }, [data]);

    // Helper function untuk memformat Date menjadi string
    const formatDate = (date: Date): string => {
        // Cek jika date valid
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return "Invalid Date";
        }

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) {
            return diffDay === 1 ? "Kemarin" : `${diffDay} hari yang lalu`;
        } else if (diffHour > 0) {
            return `${diffHour} jam yang lalu`;
        } else if (diffMin > 0) {
            return `${diffMin} menit yang lalu`;
        } else {
            return "Baru saja";
        }
    };

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
        <main className='md:p-10 p-4 sm:p-6 text-gray-900 w-full'>
            <div className="flex justify-between w-full">
                <h1 className='text-2xl font-bold text-purple-800'>Dashboard</h1>
                <Button className='bg-purple-800 text-white cursor-pointer'
                        onClick={() => setIsOpenModal((val) => !val)}>
                    New Session
                </Button>
            </div>

            <Tabs defaultValue="recent" className="space-y-6 mt-5">
                <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
                    <TabsTrigger
                        value="recent"
                        className="rounded-full px-6 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                    >
                        Curhat Terbaru
                    </TabsTrigger>
                    <TabsTrigger
                        value="favorites"
                        className="rounded-full px-6 data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                    >
                        Favorit
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data?.data && data.data.length > 0 ? (
                            data.data.map((chat) => (
                                <VentCard
                                    key={chat.id}
                                    id={chat.id}
                                    title={chat.title}
                                    date={typeof chat.date === 'string' ? chat.date : formatDate(chat.date as Date)}
                                    personality={chat.personality}
                                    roles={chat.role}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 text-gray-500">Belum ada sesi curhat</div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="favorites">
                    <div className="text-center py-12 text-gray-500">Belum ada curhat yang difavoritkan</div>
                </TabsContent>
            </Tabs>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Statistik Curhat</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-white border-gray-200 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-600">Total Sesi</CardTitle>
                            <p className="text-3xl font-semibold mt-2">{data?.total || 0}</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white border-gray-200 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-600">Bulan Ini</CardTitle>
                            <p className="text-3xl font-semibold mt-2">{data?.totalThisMonth || 0}</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white border-gray-200 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-600">Kepribadian Favorit</CardTitle>
                            <p className="text-3xl font-semibold mt-2">{data?.favoritePersonality || 'Belum ada'}</p>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <NewChatModal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
            />
        </main>
    )
}

export default Dashboard