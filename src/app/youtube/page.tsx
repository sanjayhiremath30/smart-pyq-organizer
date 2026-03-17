'use client';

import React, { useEffect, useState } from 'react';
import YoutubeCard from '@/components/YoutubeCard';

export default function YoutubePage() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch('/api/youtube')
            .then(res => res.json())
            .then(data => {
                console.log("API DATA:", data); // DEBUG
                setVideos(data);
            })
            .catch(err => console.error("Error:", err));
    }, []);

    return (
        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                YouTube Channels
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {videos.length > 0 ? (
                    videos.map((v: any) => (
                        <YoutubeCard
                            key={v.id}
                            title={v.title}
                            videoUrl={v.link}   // ✅ IMPORTANT FIX
                            channelName={v.channelName}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400">
                        No videos found
                    </div>
                )}

            </div>
        </div>
    );
}