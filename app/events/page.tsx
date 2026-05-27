"use client";

import React, { useEffect, useState } from 'react';

import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { Navbar } from "@/components/navbar";

interface Event {
    title?: string;
    type?: string;
    price?: string | number;
    date?: string;
    time?: string;
    location?: string;
}

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                // IMPORTANT: Agar backend dependencies check kar raha hai, toh headers bhejna zaruri hai
                const response = await fetch(`${api_url}/events`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // "x-api-key" wahi naam hona chahiye jo get_api_key function check kar raha hai
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "YOUR_STATIC_KEY_HERE"
                    }
                });
                
                if (response.status === 403 || response.status === 401) {
                    throw new Error("Invalid API Key / Unauthorized");
                }
                
                if (!response.ok) throw new Error("Server ne galat response diya");
                
                const data = await response.json();
                setEvents(data.events);
            } catch (err: any) {
                setError(err.message || "Failed to connect to backend");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDF8F1]">
            <Navbar/>
            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D3436] mb-4">
                        Upcoming Experiences
                    </h1>
                    <p className="text-gray-600 text-lg mb-8">Join guided sessions to reconnect and reset.</p>
                    <button className="bg-[#E6BC6B] text-white px-10 py-2.5 rounded-full font-medium">All</button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center mb-8">
                        {error} - Check if API Key is correct and Backend is running.
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-[#E6BC6B]" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {events.map((event, index) => (
                            <div key={index} className="bg-white rounded-[32px] p-8 shadow-sm border border-dashed border-gray-200 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-bold text-[#2D3436]">{event.title || "Experience"}</h3>
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <span className="bg-[#EBF2FF] text-[#4A86F7] text-xs px-3 py-1 rounded-full border border-[#D0E0FF]">Online</span>
                                            <span className="bg-[#FFF8EC] text-[#E6BC6B] text-xs px-3 py-1 rounded-full border border-[#FFEBC2]">₹{event.price || 0}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mb-8 text-gray-500">
                                        <div className="flex items-center gap-3"><Calendar size={18}/><span>{event.date || "Everyday"}</span></div>
                                        <div className="flex items-center gap-3"><Clock size={18}/><span>{event.time || "08:30 PM"}</span></div>
                                        <div className="flex items-center gap-3"><MapPin size={18}/><span>{event.location || "Zoom"}</span></div>
                                    </div>
                                </div>
                                <button className="w-full bg-[#E6BC6B] text-white py-4 rounded-2xl font-bold cursor-pointer">Register now</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default EventsPage;