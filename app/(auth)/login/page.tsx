import { AuthLogo } from '@/components/auth-logo';
import React from 'react';
import FormLogin from '../_components/form-login';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Login'
};

export default function LoginPage() {
    return (
        <main className="w-full h-screen flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm w-full max-w-md">
                <div className="flex items-center gap-2 mb-2">
                    <AuthLogo />
                    <h1 className="text-2xl font-bold">Login</h1>
                </div>
                <p className="text-gray-600 mb-6">Enter your details below to login your account and get started.</p>
                <FormLogin />
            </div>
        </main>
    )
}