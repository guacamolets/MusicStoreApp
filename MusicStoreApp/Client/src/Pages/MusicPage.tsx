import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import TableView from "../components/TableView";
import type { Track } from "../components/Track";

export default function MusicPage() {
    const [seed, setSeed] = useState(1);
    const [language, setLanguage] = useState("en");
    const [likes, setLikes] = useState(10);

    const [page, setPage] = useState(1);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch(
                    `https://localhost:7196/api/songs?seed=${seed}&likes=${likes}&lang=${language}&page=${page}&pageSize=${10}`
                );
                const data = await res.json();

                const tracksWithAudio: Track[] = (data.songs as Track[]).map(t => ({
                    ...t,
                    audioUrl: `https://localhost:7196/api/music/mp3?seed=${seed}&trackIndex=${t.index}`
                }));

                setTracks(tracksWithAudio);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error("Failed to fetch tracks", err);
            }
        };
        fetchTracks();
    }, [seed, likes, language, page]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Music Generator</h2>

            <Toolbar
                language={language}
                seed={seed}
                likes={likes}
                onChange={({ language, seed, likes }) => {
                    setLanguage(language);
                    setSeed(seed);
                    setLikes(likes);
                    setPage(1);
                }}
            />

            <TableView
                tracks={tracks}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}