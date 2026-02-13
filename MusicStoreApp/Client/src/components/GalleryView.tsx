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
    const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

    const fetchTracks = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const res = await fetch(
                `/api/songs?seed=${seed}&likes=${likes}&lang=${language}&page=${page}`
            );
            const data = await res.json();
            const newTracks: Track[] = (data.songs as Track[]).map((t: Track) => ({
                ...t,
                audioUrl: `/api/music/mp3?seed=${seed}&trackIndex=${t.index}`,
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
        audioRefs.current.forEach((audio, index) => {
            if (!audio) return;
            if (index === activeTrackIndex) {
                audio.play().catch(() => { });
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }, [activeTrackIndex]);

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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "flex-start" }}>
            {tracks.map((track) => (
                <div key={track.index} style={{ display: "flex", flex: "1 0 200px", flexDirection: "column", width: "200px", border: "1px solid #ccc", padding: "10px", borderRadius: "8px"}}>
                    <img src={track.coverUrl} alt={track.album} style={{ width: "100%", height: "auto", objectFit: "cover" }}/>
                    <div style={{ textAlign: "center", marginTop: "10px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <strong>{track.index}. {track.title}</strong>
                        <span>{track.artist}</span>
                        <span>{track.album}</span>
                        <span>{track.genre}</span>
                        <span>Likes: {track.likes}</span>
                    </div>
                    <audio
                        ref={(el) => { audioRefs.current[track.index] = el; }} controls src={track.audioUrl}
                        onPlay={() => setActiveTrackIndex(track.index)} style={{ width: "100%", marginTop: "auto" }} 
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ))}
            {isLoading && <p>Loading...</p>}
            <div ref={observerRef} />
        </div>
    );
}
