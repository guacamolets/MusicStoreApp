interface Props {
    viewMode: "table" | "gallery";
    onChange: (mode: "table" | "gallery") => void;
}

export default function ViewSwitch({ viewMode, onChange }: Props) {
    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <button
                onClick={() => onChange("table")}
                style={{
                    padding: "5px 15px",
                    borderRadius: "20px",
                    border: viewMode === "table" ? "2px solid #4caf50" : "1px solid #ccc",
                    backgroundColor: viewMode === "table" ? "#4caf50" : "#fff",
                    color: viewMode === "table" ? "#fff" : "#000",
                    cursor: "pointer",
                }}
            >
                Table
            </button>
            <button
                onClick={() => onChange("gallery")}
                style={{
                    padding: "5px 15px",
                    borderRadius: "20px",
                    border: viewMode === "gallery" ? "2px solid #4caf50" : "1px solid #ccc",
                    backgroundColor: viewMode === "gallery" ? "#4caf50" : "#fff",
                    color: viewMode === "gallery" ? "#fff" : "#000",
                    cursor: "pointer",
                }}
            >
                Gallery
            </button>
        </div>
    );
}
