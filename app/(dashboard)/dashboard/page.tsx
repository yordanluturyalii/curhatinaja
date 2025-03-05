'use client';

import NewChatModal from '@/components/new-chat-modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Dashboard = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const router = useRouter();
    return (
        <main className='md:p-10 p-4 sm:p-6 text-gray-900 w-full'>
            <div className="flex justify-between w-full">
                <h1 className='text-2xl font-bold'>Dashboard</h1>
                <Button className='bg-white' onClick={() => setIsOpenModal((val) => !val)}>
                    New Session
                </Button>
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