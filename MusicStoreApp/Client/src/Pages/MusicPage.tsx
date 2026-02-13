import { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import TableView from "../components/TableView";
import GalleryView from "../components/GalleryView";
import type { Track } from "../components/Track";
import ViewSwitch from "../components/ViewSwitch";

export default function MusicPage() {
    const [seed, setSeed] = useState(1);
    const [language, setLanguage] = useState("en");
    const [likes, setLikes] = useState(10);

    const [page, setPage] = useState(1);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const [viewMode, setViewMode] = useState<"table" | "gallery">(
        () => (localStorage.getItem("viewMode") as "table" | "gallery") || "table"
    );

    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch(
                    `/api/songs?seed=${seed}&likes=${likes}&lang=${language}&page=${page}`
                );
                const data = await res.json();

                const tracksWithAudio: Track[] = (data.songs as Track[]).map(t => ({
                    ...t,
                    audioUrl: `/api/music/mp3?seed=${seed}&trackIndex=${t.index}`
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
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ViewSwitch viewMode={viewMode} onChange={setViewMode} />
            </div>

            <h2>Sharpify</h2>

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

            <div className="content-wrapper">
                {viewMode === "gallery" && (
                    <GalleryView
                        key={`${seed}-${likes}-${language}`}
                        seed={seed}
                        likes={likes}
                        language={language}
                    />
                )}

                {viewMode === "table" && (
                    <TableView
                        tracks={tracks}
                        page={page}
                        pageSize={10}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        seed={seed}
                    />
                )}
            </div>
        </div>
    );
}