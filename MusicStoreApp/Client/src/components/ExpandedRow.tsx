import type { Track } from "./Track";

interface Props {
    track: Track;
    seed: number;
}

const ExpandedRow = ({ track, seed }: Props) => {
    const audioUrl = `https://localhost:7196/api/music/mp3?seed=${seed}&trackIndex=${track.index}`;

    return (
        <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
            <div>
                <img src={track.coverUrl} alt={track.title} width={200} height={200} />
                <div><strong>{track.title}</strong></div>
                <div>{track.artist}</div>
            </div>

            <div>
                <button>
                    <audio controls src={audioUrl}>
                        Your browser does not support the audio element.
                    </audio>
                </button>

                <p style={{ marginTop: "15px" }}>
                    <strong>Review:</strong> {track.reviewText}
                </p>
            </div>

        </div>
    );
};

export default ExpandedRow;