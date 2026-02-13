import React from "react";

interface Props {
    language: string;
    seed: number;
    likes: number;
    onChange: (params: { language: string; seed: number; likes: number }) => void;
}

export default function Toolbar({ language, seed, likes, onChange } : Props) {
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ language: e.target.value, seed, likes });
    };

    const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ language, seed: Number(e.target.value), likes });
    };

    const handleLikesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ language, seed, likes: Math.min(10, Math.max(0, Number(e.target.value))) });
    };

    return (
        <div style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            marginBottom: "20px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px"
        }}>
            <div>
                <label>Language: </label>
                <select value={language} onChange={handleLanguageChange}>
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                </select>
            </div>

            <div>
                <label>Seed: </label>
                <input
                    type="number"
                    value={seed}
                    min={1}
                    onChange={handleSeedChange}
                />
            </div>

            <div>
                <label>Likes: </label>
                <input
                    type="number"
                    value={likes}
                    min={0}
                    max={10}
                    step={0.1}
                    onChange={handleLikesChange}
                />
            </div>
        </div>
    );
};