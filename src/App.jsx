import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

function App() {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("Loading notes...");

  async function fetchNotes() {
    const { data, error } = await supabase
      .from("tbl_usd")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading notes: " + error.message);
      return;
    }

    setNotes(data);
    setMessage("");
  }

  async function addNote() {
    if (!content.trim()) {
      setMessage("Please enter a note.");
      return;
    }

    setMessage("Saving note...");

    const { error } = await supabase
      .from("tbl_usd")
      .insert([{ content: content.trim() }]);

    if (error) {
      setMessage("Error saving note: " + error.message);
      return;
    }

    setContent("");
    setMessage("Note saved successfully!");
    await fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <h1>My Notes</h1>

      <div className="note-form">
        <input
          type="text"
          placeholder="Write your note..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={1000}
        />

        <button onClick={addNote}>Add Note</button>
      </div>

      {message && <p className="message">{message}</p>}

      <h2>Saved Notes</h2>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((item) => (
            <li key={item.id}>
              <span>{item.content}</span>
              <small>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "Date unavailable"}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;