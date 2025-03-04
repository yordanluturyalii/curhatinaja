"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import register from "@/app/actions/register";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FormRegister = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const [state, action, isPending] = useActionState(register, { error: {}, success: false });

    useEffect(() => {
        if (state.success) {
            toast.success("Registration successful! Redirecting...");
            router.push('/');
        } else if (state.error && Object.keys(state.error).length > 0) {
            toast.error("Registration failed! Please check your input.");
        }
    }, [state]);


    return (
        <form action={action} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Name</label>
                <Input name="name" placeholder="Enter your name" disabled={isPending} className="focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0" />
                {state.error?.name && <p className="text-red-500 text-sm">{state.error.name[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Username</label>
                <Input name="username" placeholder="Choose a username" disabled={isPending} className="focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0" />
                {state.error?.username && <p className="text-red-500 text-sm">{state.error.username[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="Enter your email" disabled={isPending} className="focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0" />
                {state.error?.email && <p className="text-red-500 text-sm">{state.error.email[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                    <Input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" disabled={isPending} className="focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0" />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
                {state.error?.password && <p className="text-red-500 text-sm">{state.error.password[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Confirm Password</label>
                <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" disabled={isPending} className="focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0" />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
                {state.error?.confirmPassword && <p className="text-red-500 text-sm">{state.error.confirmPassword[0]}</p>}
            </div>

            <Button type="submit" disabled={isPending} className="bg-purple-700 hover:bg-purple-800 text-white w-full cursor-pointer">
                {isPending ? "Registering..." : "Confirm"}
            </Button>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-700 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </form>
    );
};

export default FormRegister;
