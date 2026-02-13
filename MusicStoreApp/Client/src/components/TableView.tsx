import React, { useState } from "react";
import { type Track } from "./Track";

interface Props {
    tracks: Track[];
    page: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    seed: number;
}

export default function TableView({ tracks, page, totalPages, onPageChange, pageSize = 10 }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleRow = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tracksToDisplay = tracks.slice(startIndex, endIndex);

    return (
        <div style={{ width: "100%" }}> 
            <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
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
                    {tracksToDisplay.map((track, index) => (
                        <React.Fragment key={track.index}>

                            <tr onClick={() => toggleRow(track.index)} style={{ cursor: "pointer" }}>
                                <td>{startIndex + index + 1}</td>
                                <td>{track.title}</td>
                                <td>{track.artist}</td>
                                <td>{track.album}</td>
                                <td>{track.genre}</td>
                                <td>{track.likes}</td>
                            </tr>

                            {expandedId === track.index && (
                                <tr>
                                    <td colSpan={6}>

                                        <div style={{ display: "flex", gap: "20px", padding: "20px", justifyContent: "center" }}>
                                            <div>
                                                <img src={track.coverUrl} alt={track.title} width={200} height={200} />
                                                <div><strong>{track.title}</strong></div>
                                                <div>{track.artist}</div>
                                            </div>

                                            <div>
                                                <audio controls src={track.audioUrl} style={{ width: "100%" }}>
                                                    Your browser does not support the audio element.
                                                </audio>

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
                <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
                    Previous
                </button>
                <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                </span>
                <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};