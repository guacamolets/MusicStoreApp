import React, { useState, useRef, useEffect } from "react";
import { type Track } from "./Track";

interface Props {
    tracks: Track[];
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    seed: number;
    activeTrackIndex: number | null;
}

export default function TableView({ tracks, page, totalPages, onPageChange, activeTrackIndex }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

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

    const toggleRow = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Genre</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track, index) => (
                        <React.Fragment key={track.index}>

                            <tr onClick={() => toggleRow(track.index)} style={{ cursor: "pointer" }}>
                                <td>{index + 1}</td>
                                <td>{track.title}</td>
                                <td>{track.artist}</td>
                                <td>{track.album}</td>
                                <td>{track.genre}</td>
                                <td>{track.likes}</td>
                            </tr>

                            {expandedId === track.index && (
                                <tr>
                                    <td colSpan={5}>

                                        <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
                                            <div>
                                                <img src={track.coverUrl} alt={track.title} width={200} height={200} />
                                                <div><strong>{track.title}</strong></div>
                                                <div>{track.artist}</div>
                                            </div>

                                            <div>
                                                <button>
                                                    <audio
                                                        ref={(el) => { audioRefs.current[track.index] = el; }} controls src={track.audioUrl}
                                                        style={{ width: "100%" }}
                                                    >
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </button>

                                                <p style={{ marginTop: "15px" }}>
                                                    <strong>Review:</strong> {track.reviewText}
                                                </p>
                                            </div>

                                        </div>
                                    </td>
                                </tr>
                            )}

                        </React.Fragment>
                    ))}
                </tbody>

            </table>

            <div style={{ marginTop: "10px" }}>
                <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                    Previous
                </button>
                <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                </span>
                <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};