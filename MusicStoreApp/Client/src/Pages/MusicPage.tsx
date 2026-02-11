import { useState } from "react";
import Toolbar from "../components/Toolbar";

export default function MusicPage() {
    const [seed, setSeed] = useState(1);
    const [language, setLanguage] = useState("en");
    const [likes, setLikes] = useState(10);

    const audioUrl = `http://localhost:5233/api/music/mp3?seed=${seed}`;

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
                }}
            />

            <div>
                <audio key={audioUrl} controls src={audioUrl} />
                <br />
                <a href={audioUrl} download>
                    Download
                </a>
            </div>
        </div>
    );
}