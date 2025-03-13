"use client";

import React, {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Smile, LightbulbIcon, Heart, User} from 'lucide-react';
import createSession from "@/actions/session";
import {cn} from "@/lib/utils";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

type ChatSettings = {
    personality: string;
    role: string;
};

type NewChatModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function NewChatModal({isOpen, onClose}: NewChatModalProps) {
    const router = useRouter();
    const [settings, setSettings] = useState<ChatSettings>({
        personality: "humoris",
        role: "teman",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("personality", settings.personality);
            formData.append("role", settings.role);
            const data = await createSession(formData);
            if (data.error) {
                throw new Error(data.error);
            } else {
                toast.success("Successfully Start Chat. Redirecting....", {
                    duration: 2000
                });
                setTimeout(() => {
                    router.push(`/chat/new/${data.data?.sessions.id}?role=${data.data?.sessions.role}&personality=${data.data?.sessions.personality}`);
                }, 2000)
            }
        } catch (e) {
            console.log(e);
            toast.error("Failed To Start Chat");
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">AI Configuration</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div>
                        <Label className="text-base font-medium text-gray-700 mb-3">Personality</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className={`flex items-center justify-start gap-2 h-12 px-4 ${
                                    settings.personality === "humoris"
                                        ? "bg-purple-100 border-purple-300 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => setSettings({...settings, personality: "humoris"})}
                            >
                                <Smile
                                    className={`h-5 w-5 ${settings.personality === "humoris" ? "text-purple-500" : "text-gray-500"}`}/>
                                <span>Humorous</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className={`flex items-center justify-start gap-2 h-12 px-4 ${
                                    settings.personality === "bijak"
                                        ? "bg-purple-100 border-purple-300 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => setSettings({...settings, personality: "bijak"})}
                            >
                                <LightbulbIcon
                                    className={`h-5 w-5 ${settings.personality === "bijak" ? "text-purple-500" : "text-gray-500"}`}/>
                                <span>Wise</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className={`flex items-center justify-start gap-2 h-12 px-4 ${
                                    settings.personality === "santai"
                                        ? "bg-purple-100 border-purple-300 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => setSettings({...settings, personality: "santai"})}
                            >
                                <Heart
                                    className={`h-5 w-5 ${settings.personality === "santai" ? "text-purple-500" : "text-gray-500"}`}/>
                                <span>Relaxed</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className={`flex items-center justify-start gap-2 h-12 px-4 ${
                                    settings.personality === "serius"
                                        ? "bg-purple-100 border-purple-300 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => setSettings({...settings, personality: "serius"})}
                            >
                                <User
                                    className={`h-5 w-5 ${settings.personality === "serius" ? "text-purple-500" : "text-gray-500"}`}/>
                                <span>Serious</span>
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label className="text-base font-medium text-gray-700 mb-3">Role</Label>
                        <Select
                            value={settings.role}
                            onValueChange={(value) => setSettings({...settings, role: value})}
                        >
                            <SelectTrigger className="w-full h-12 bg-gray-100 border-gray-200 mt-2">
                                <SelectValue placeholder="Select a role"/>
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="teman">Casual Friend</SelectItem>
                                <SelectItem value="psikolog">Psychologist</SelectItem>
                                <SelectItem value="motivator">Motivator</SelectItem>
                                <SelectItem value="mentor">Mentor</SelectItem>
                                <SelectItem value="pacar">Partner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleStart} className={cn(
                        "w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer",
                        isSubmitting && "bg-gray-700 text-gray-50"
                    )}>
                        {isSubmitting ?
                            "Starting Chat..."
                            :
                            "Start Chat"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
