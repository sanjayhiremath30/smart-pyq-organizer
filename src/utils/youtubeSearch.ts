export interface YoutubeVideo {
  title: string;
  channelName: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const searchYoutube = async (query: string): Promise<YoutubeVideo[]> => {
  // In a real app, this would call YouTube Search API v3
  // const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}`);
  // const data = await response.json();

  // Mocking the result for demonstration as requested
  // We'll return 3 videos based on the topic
  return [
    {
      title: `${query} Tutorial - Comprehensive Guide`,
      channelName: "Neso Academy",
      videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // Example video
      thumbnailUrl: `https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800`
    },
    {
      title: `Understanding ${query} in 5 Minutes`,
      channelName: "Gate Smashers",
      videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      thumbnailUrl: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800`
    },
    {
      title: `${query} Solved Example - Exam Special`,
      channelName: "Simplilearn",
      videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      thumbnailUrl: `https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800`
    }
  ];
};
