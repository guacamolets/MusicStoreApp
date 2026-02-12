import React, { useState } from "react";
import { type Track } from "./Track";
import ExpandedRow from "./ExpandedRow";

interface TableProps {
    tracks: Track[];
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    seed: number;
}

const TableView: React.FC<TableProps> = ({ tracks, page, totalPages, onPageChange, seed }) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

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
                                        <ExpandedRow track={track} seed={seed} />
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

export default TableView;