// JournalCard.js

import React, { useState, useRef } from 'react'; 

const JournalEntry = ({ addEntry }) => {
    const [text, setText] = useState('');
    const [font, setFont] = useState('Arial');
    const [images, setImages] = useState([]);   
    
    // REF DEFINITION
    const fileInputRef = useRef(null); 

    // Handle MULTIPLE image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        const readers = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((imgs) => {
            setImages((prev) => [...prev, ...imgs]); 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() === '') return;

        addEntry({ text, font, images });

        setText('');
        setImages([]);
        
        // FIX: Clear file input value after submission
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <textarea
                    style={{ 
                        fontFamily: font,
                        width: '100%', 
                        minHeight: '100px',
                        padding: '15px',
                        fontSize: '16px',
                        borderRadius: '10px'
                    }}
                    placeholder="Write your journal..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                />
            </div>

            <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <label>Font Style: </label>
                <select value={font} onChange={(e) => setFont(e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                </select>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <input 
                    type="file" 
                    accept="image/*"
                    multiple                 
                    onChange={handleImageUpload} 
                    ref={fileInputRef}
                />
            </div>

            {/* Preview selected images */}
            {images.length > 0 && (
                <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {images.map((img, i) => (
                        <img 
                            key={i} 
                            src={img} 
                            alt="" 
                            style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "10px"
                            }}
                        />
                    ))}
                </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button type="submit">Add Entry</button>
            </div>
        </form>
    );
};

export default JournalEntry;