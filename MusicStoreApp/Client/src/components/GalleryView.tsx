import { useEffect, useState, useRef, useCallback } from "react";
import type { Track } from "./Track";

interface Props {
    seed: number;
    likes: number;
    language: string;
    pageSize?: number;
}

export default function GalleryView({ seed, likes, language, pageSize = 10 }: Props) {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const fetchTracks = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const res = await fetch(
                `https://localhost:7196/api/songs?seed=${seed}&likes=${likes}&lang=${language}&page=${page}&pageSize=${pageSize}`
            );
            const data = await res.json();
            const newTracks: Track[] = (data.songs as Track[]).map((t: Track) => ({
                ...t,
                audioUrl: `https://localhost:7196/api/music/mp3?seed=${seed}&trackIndex=${t.index}`,
            }));

            setTracks((prev) => [...prev, ...newTracks]);
            setPage((prev) => prev + 1);

            if (newTracks.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch gallery tracks", err);
        } finally {
            setIsLoading(false);
        }
    }, [seed, likes, language, page, pageSize, isLoading, hasMore]);

    useEffect(() => {
        setTracks([]);
        setPage(1);
        setHasMore(true);
    }, [seed, likes, language]);

    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) fetchTracks();
            },
            { threshold: 1 }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [fetchTracks]);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {tracks.map((track) => (
                <div key={track.index} style={{width: "200px", border: "1px solid #ccc", padding: "10px", borderRadius: "8px"}}>
                    <img src={track.coverUrl} alt={track.album} style={{ width: "100%", height: "auto" }}/>
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                    <p>{track.album}</p>
                    <p>{track.genre}</p>
                    <p>Likes: {track.likes}</p>
                    <audio controls src={track.audioUrl} style={{ width: "100%" }}>
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ))}
            {isLoading && <p>Loading...</p>}
            <div ref={observerRef} />
        </div>
    );
}
