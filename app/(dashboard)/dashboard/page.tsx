'use client';

import NewChatModal from '@/components/new-chat-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Dashboard = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const router = useRouter();

    const recentChats = [
        { id: 1, title: "Motivasi untuk ujian", date: "2 jam yang lalu", personality: "Bijak", role: "Motivator" },
        { id: 2, title: "Masalah dengan teman", date: "Kemarin", personality: "Santai", role: "Teman" },
        { id: 3, title: "Stress kerja", date: "3 hari yang lalu", personality: "Serius", role: "Psikolog" },
    ]

    return (
        <main className='md:p-10 p-4 sm:p-6 text-gray-900 w-full'>
            <div className="flex justify-between w-full">
                <h1 className='text-2xl font-bold'>Dashboard</h1>
                <Button className='bg-white' onClick={() => setIsOpenModal((val) => !val)}>
                    New Session
                </Button>
            </div>

            <Tabs defaultValue="recent" className="space-y-6 mt-5">
                <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
                    <TabsTrigger
                        value="recent"
                        className="rounded-full px-6 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                    >
                        Curhat Terbaru
                    </TabsTrigger>
                    <TabsTrigger
                        value="favorites"
                        className="rounded-full px-6 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                    >
                        Favorit
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {recentChats.map((chat) => (
                            <Card
                                key={chat.id}
                                className="bg-white border-gray-200 rounded-2xl hover:shadow-lg transition-shadow"
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium">{chat.title}</CardTitle>
                                    <p className="text-sm text-gray-500">{chat.date}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{chat.personality}</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{chat.role}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full mt-4 text-gray-600 hover:text-gray-900"
                                        onClick={() => router.push(`/chat/${chat.id}`)}
                                    >
                                        Lihat Detail
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
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
                            <p className="text-3xl font-semibold mt-2">12</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white border-gray-200 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-600">Bulan Ini</CardTitle>
                            <p className="text-3xl font-semibold mt-2">5</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white border-gray-200 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base font-medium text-gray-600">Kepribadian Favorit</CardTitle>
                            <p className="text-3xl font-semibold mt-2">Santai</p>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <NewChatModal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                onStart={(settings) => {
                    router.push(`/chat/new?personality=${settings.personality}&role=${settings.role}`)
                }}
            />
        </main>
    )
}

export default Dashboard