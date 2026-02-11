import {useState} from "react"

export default function MusicPage() {
    const [seed, setSeed] = useState(1);
    const [duration, setDuration] = useState(10);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const generateMusic = () => {
        const url = `http://localhost:5233/api/music/midi?seed=${seed}&duration=${duration}`;
        setAudioUrl(url);
    };

    return (
        <div style={{padding: "20px"}}>
            <h2>Music Generator</h2>

            <div>
                <label>Seed:</label>
                <input type="number" value={seed} onChange={(e)=>setSeed(Number(e.target.value))}/>
            </div>

            <div>
                <label>Duration:</label>
                <input type="number" value={duration} onChange={(e)=>setDuration(Number(e.target.value))}/>
            </div>

            <button onClick={generateMusic}>Generate</button>

            {audioUrl && (
                <div style={{marginTop:"20px"}}>
                    <audio controls src={audioUrl}/>
                    <br />
                    <a href={audioUrl} download>Download MIDI</a>
                </div>
            )}
        </div>
    );
}