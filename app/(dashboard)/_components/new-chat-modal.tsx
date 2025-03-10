"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smile, LightbulbIcon, Heart, User } from 'lucide-react';

type ChatSettings = {
  personality: string;
  role: string;
};

type NewChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: (settings: ChatSettings) => void;
};

export default function NewChatModal({ isOpen, onClose, onStart }: NewChatModalProps) {
  const [settings, setSettings] = useState<ChatSettings>({
    personality: "humoris",
    role: "teman",
  });

  const handleStart = () => {
    onStart(settings);
    onClose();
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
                onClick={() => setSettings({ ...settings, personality: "humoris" })}
              >
                <Smile className={`h-5 w-5 ${settings.personality === "humoris" ? "text-purple-500" : "text-gray-500"}`} />
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
                onClick={() => setSettings({ ...settings, personality: "bijak" })}
              >
                <LightbulbIcon className={`h-5 w-5 ${settings.personality === "bijak" ? "text-purple-500" : "text-gray-500"}`} />
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
                onClick={() => setSettings({ ...settings, personality: "santai" })}
              >
                <Heart className={`h-5 w-5 ${settings.personality === "santai" ? "text-purple-500" : "text-gray-500"}`} />
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
                onClick={() => setSettings({ ...settings, personality: "serius" })}
              >
                <User className={`h-5 w-5 ${settings.personality === "serius" ? "text-purple-500" : "text-gray-500"}`} />
                <span>Serious</span>
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3">Role</Label>
            <Select 
              value={settings.role}
              onValueChange={(value) => setSettings({ ...settings, role: value })}
            >
              <SelectTrigger className="w-full h-12 bg-gray-100 border-gray-200 mt-2">
                <SelectValue placeholder="Select a role" />
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
          <Button onClick={handleStart} className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">Start Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
