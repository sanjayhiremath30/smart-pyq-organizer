'use client';

import React from 'react';

function getYoutubeId(url?: string) {
  if (!url) return null;

  try {
    // Handle youtu.be links
    if (url.includes("youtu.be")) {
      const parts = url.split("youtu.be/");
      return parts[1]?.split("?")[0];
    }

    // Handle youtube.com links
    if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    }

    return null;
  } catch (error) {
    console.error("Invalid URL:", url);
    return null;
  }
}

interface Props {
  title: string;
  videoUrl?: string;
  channelName?: string;
}

export default function YoutubeCard({
  title,
  videoUrl,
  channelName,
}: Props) {

  const videoId = getYoutubeId(videoUrl);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">

      {/* 🎥 Video Section */}
      {videoId ? (
        <iframe
          className="w-full h-52 rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-52 flex items-center justify-center bg-gray-200 rounded-lg">
          <p className="text-gray-500">Invalid or Missing Video</p>
        </div>
      )}

      {/* 📌 Title */}
      <h2 className="mt-3 font-semibold text-gray-800">
        {title}
      </h2>

      {/* 📺 Channel */}
      {channelName && (
        <p className="text-sm text-gray-500">{channelName}</p>
      )}

      {/* 🔗 Button */}
      <a
        href={videoUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        Watch on YouTube
      </a>

    </div>
  );
}