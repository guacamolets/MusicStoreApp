import React from "react";
import { type Track } from "./Track";

interface TableProps {
    tracks: Track[];
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const TableView: React.FC<TableProps> = ({ tracks, page, totalPages, onPageChange }) => {
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
                        <th>Audio</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => (
                        <tr key={track.index} style={{ borderBottom: "1px solid #ccc" }}>
                            <td>{track.index}</td>
                            <td>{track.title}</td>
                            <td>{track.artist}</td>
                            <td>{track.album}</td>
                            <td>{track.genre}</td>
                            <td>
                                <audio controls src={track.audioUrl} />
                                <br />
                                <a href={track.audioUrl} download>Download</a>
                            </td>
                        </tr>
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
