"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const FormLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            toast.error(res?.error, {
                duration: 4000
            });
            setIsPending(false);
        } else {
            toast.success("Login successful! Redirecting...", {
                duration: 4000
            });
            setTimeout(() => {
                router.push("/dashboard");
            }, 4000);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={isPending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus-visible:ring-1 focus-visible:ring-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        disabled={isPending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus-visible:ring-1 focus-visible:ring-purple-500"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
                type="submit"
                disabled={isPending || !email.trim() || !password.trim()}
                className="bg-purple-700 hover:bg-purple-800 text-white w-full"
            >
                {isPending ? "Logging in..." : "Login"}
            </Button>


            <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-purple-700 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </form>
    );
};

export default FormLogin;
