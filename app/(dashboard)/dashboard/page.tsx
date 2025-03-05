'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {
    const { data } = useSession();
    return (
        <div>
            <h1>Dashboard</h1>
            <span>{data?.user?.name}</span>
            <Button variant={"default"} onClick={() => signOut()}>
                Sign Out
            </Button>
        </div>
    )
}

export default Dashboard