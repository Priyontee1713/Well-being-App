import React, { useState, useEffect } from "react";
import "./App.css";
import JournalEntry from "./components/JournalCard";
import JournalList from "./components/JournalList";

function App() {
    const [entries, setEntries] = useState([]);

    // LOAD ENTRIES FROM BACKEND
    useEffect(() => {
        fetch("http://localhost:5000/api/journals")
            .then((res) => res.json())
            .then((data) => setEntries(data))
            .catch((err) => console.error("Error loading journals:", err));
    }, []);

    // CREATE ENTRY
    const addEntry = async (entry) => {
        try {
            const res = await fetch("http://localhost:5000/api/journals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entry), // entry = { text, font, images: [] }
            });

            const newEntry = await res.json();
            setEntries((prev) => [newEntry, ...prev]);
        } catch (err) {
            console.error("Add error:", err);
        }
    };

    // UPDATE ENTRY (full journal object)
    const updateEntry = async (id, updatedObj) => {
    try {
        const res = await fetch(`http://localhost:5000/api/journals/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedObj),   // {text, font, images}
        });

        const updated = await res.json();

        setEntries((prev) =>
            prev.map((entry) => (entry._id === id ? updated : entry))
        );
    } catch (err) {
        console.error("Update error:", err);
    }
};

    // DELETE ENTRY
    const deleteEntry = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/journals/${id}`, {
                method: "DELETE",
            });

            setEntries((prev) => prev.filter((entry) => entry._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="container">
            <h1>My Serenity Journal</h1>

            {/* CREATE NEW ENTRY */}
            <JournalEntry addEntry={addEntry} />

            {/* DISPLAY ALL ENTRIES */}
            <JournalList
                entries={entries}
                setEntries={setEntries}
                updateEntry={updateEntry}
                deleteEntry={deleteEntry}
            />
        </div>
    );
}

export default App;
