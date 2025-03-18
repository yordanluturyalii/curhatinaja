"use client"

import React from "react"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import VentCard from "@/app/(dashboard)/_components/vent-card";

const ventHistory = [
    {
        id: 1,
        title: "Masalah dengan rekan kerja",
        date: "24 Mar 2025",
        personality: "Introvert",
        roles: "Karyawan",
    },
    {
        id: 2,
        title: "Konflik dengan keluarga",
        date: "20 Mar 2025",
        personality: "Ambivert",
        roles: "Anak",
    },
    {
        id: 3,
        title: "Stress karena deadline",
        date: "15 Mar 2025",
        personality: "Ekstrovert",
        roles: "Mahasiswa",
    },
    {
        id: 4,
        title: "Kecemasan tentang masa depan",
        date: "10 Mar 2025",
        personality: "Introvert",
        roles: "Freelancer",
    },
    {
        id: 5,
        title: "Masalah hubungan",
        date: "5 Mar 2025",
        personality: "Ambivert",
        roles: "Pasangan",
    },
    {
        id: 6,
        title: "Kesulitan akademik",
        date: "1 Mar 2025",
        personality: "Introvert",
        roles: "Mahasiswa",
    },
]

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [filter, setFilter] = React.useState("all")

    const filteredVents = ventHistory.filter((vent) => {
        const matchesSearch = vent.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter =
            filter === "all" ||
            vent.personality.toLowerCase() === filter.toLowerCase() ||
            vent.roles.toLowerCase() === filter.toLowerCase()
        return matchesSearch && matchesFilter
    })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-purple-800 mb-2">History</h1>
                <p className="text-gray-600">Look back at all the vent sessions you have done</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 outline-none"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 outline-none">
                                <SelectValue placeholder="Filter"/>
                            </SelectTrigger>
                            <SelectContent className={"bg-white"}>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="introvert">Introvert</SelectItem>
                                <SelectItem value="ambivert">Ambivert</SelectItem>
                                <SelectItem value="ekstrovert">Ekstrovert</SelectItem>
                                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                                <SelectItem value="karyawan">Karyawan</SelectItem>
                                <SelectItem value="freelancer">Freelancer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {filteredVents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVents.map((vent) => (
                        <VentCard
                            key={vent.id}
                            id={vent.id}
                            title={vent.title}
                            date={vent.date}
                            personality={vent.personality}
                            roles={vent.roles}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="bg-purple-50 inline-block p-4 rounded-full mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">Tidak ada riwayat ditemukan</h3>
                    <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
                </div>
            )}
        </div>
    )
}

