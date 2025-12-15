import React, { useState } from "react";

const pastelColors = [
    "linear-gradient(135deg, #ffd8e1, #ffe9f3)",
    "linear-gradient(135deg, #e7f0ff, #d0e4ff)",
    "linear-gradient(135deg, #e6fff7, #ccfcef)",
    "linear-gradient(135deg, #fff3d6, #ffe9c0)"
];

const JournalList = ({ entries, setEntries, updateEntry, deleteEntry }) => {
    const [expanded, setExpanded] = useState(null); // store _id instead of index
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [editImages, setEditImages] = useState([]);

    // When clicking delete
    const handleDelete = (id) => {
        deleteEntry(id); 
        if (expanded === id) setExpanded(null);
    };

    // Begin editing text + images
    const startEdit = (i) => {
        setEditingIndex(i);
        setEditText(entries[i].text);
        setEditImages(entries[i].images || []);
    };

    // Read multiple files when editing
    const handleEditImages = (e) => {
        const files = Array.from(e.target.files);

        const readers = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((imgs) => {
            setEditImages((prev) => [...prev, ...imgs]);
        });
    };

    // Save edited data to backend
    const saveEdit = () => {
        const entryId = entries[editingIndex]._id;

        updateEntry(entryId, {
            text: editText,
            font: entries[editingIndex].font,
            images: editImages
        });

        setEditingIndex(null);
    };

    return (
        <div className="journal-grid">
            {entries.map((entry, i) => {
                const isOpen = expanded === entry._id;
                const cardFontFamily = { fontFamily: entry.font };
                return (
                    <div
                        key={entry._id}
                        className={`journal-card ${isOpen ? "expanded" : ""}`}
                        style={{ "--pastel": pastelColors[i % pastelColors.length] }}
                        onClick={() => {
                            if (isOpen) setExpanded(null);
                            else setExpanded(entry._id);
                        }}
                    >

                        {/* CRUD Buttons */}
                        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => startEdit(i)}>Edit</button>
                            <button onClick={() => handleDelete(entry._id)}>Delete</button>
                        </div>

                        {/* Editing Mode */}
                        {editingIndex === i ? (
                            <>
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    style={{
                                        ...cardFontFamily,
                                        width: "100%",
                                        minHeight: "140px",
                                        padding: "12px",
                                        fontSize: "16px",
                                        borderRadius: "10px",
                                        boxSizing: "border-box"
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                {/* Editing images */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleEditImages}
                                    style={{ marginTop: "12px" }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                {/* Show image previews while editing */}
                                <div className="image-gallery" style={{ marginTop: "10px" }}>
                                    {editImages.map((img, idx) => (
                                        <img key={idx} src={img} alt="" className="gallery-img" />
                                    ))}
                                </div>

                                <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                                    <button onClick={saveEdit}>Save</button>
                                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Preview view */}
                                {!isOpen && (
                                    <div className="card-preview">
                                        <p style={cardFontFamily}>
                                            {entry.text.length > 140
                                                ? entry.text.slice(0, 140) + "..."
                                                : entry.text}
                                        </p>
                                    </div>
                                )}

                                {/* Expanded full view */}
                                {isOpen && (
                                    <div className="full-content">
                                        <p style={cardFontFamily}>{entry.text}</p>

                                        {/* Multiple images support */}
                                        {entry.images && entry.images.length > 0 && (
                                            <div className="image-gallery">
                                                {entry.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt=""
                                                        className="gallery-img"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default JournalList;
