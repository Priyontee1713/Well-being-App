import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";

export default function MusicPlayer({ music, setScreen, onHeart, isHearted }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // NEW: State for looping and notifications
  const [isLooping, setIsLooping] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const audioRef = useRef(new Audio(music.url));

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = music.url;
    // Sync loop state to the audio element
    audio.loop = isLooping;
    audio.load();

    audio.play().catch(err => console.log("Playback blocked:", err));

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [music.url, isLooping]); // Added isLooping to dependency to update real-time

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // NEW: Toggle Loop Function with Notification
  const toggleLoop = () => {
    const newState = !isLooping;
    setIsLooping(newState);
    setToast({ show: true, message: newState ? "Loop Enabled 🔁" : "Loop Disabled ➡" });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const skipTime = (amount) => {
    audioRef.current.currentTime += amount;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="pc-player-page">
      {/* NEW: Notification UI */}
      {toast.show && <div className="loop-notification">{toast.message}</div>}

      <div className="player-header">
        <button className="back-btn" onClick={() => setScreen("home")}>←</button>
        <div className="header-info">
          <span>Now playing</span>
          <p>Playlist "Most Listened"</p>
        </div>
        <button 
          className="fav-btn" 
          onClick={() => onHeart(music)}
          style={{ color: isHearted ? "#B19CD9" : "white" }}
        >
          {isHearted ? "♥" : "♡"}
        </button>
      </div>

      <div className="album-art-container">
        <img src={music.coverImage} alt={music.title} className="main-art" />
      </div>

      <div className="song-details">
        <div className="song-info-text">
          <h2>{music.title}</h2>
          <p>{music.artist || "Unknown Artist"}</p>
        </div>
        <button className="share-btn">↗</button>
      </div>

      <div className="progress-section">
        <input 
          type="range" 
          className="player-slider" 
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => audioRef.current.currentTime = e.target.value}
        />
        <div className="time-labels">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="playback-controls">
        <button className="secondary-btn">🔀</button>
        <button className="nav-btn" onClick={() => skipTime(-10)}>⏪</button>
        
        <button className="play-pause-circle" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        
        <button className="nav-btn" onClick={() => skipTime(10)}>⏩</button>
        
        {/* NEW: Updated Loop Button */}
        <button 
          className={`secondary-btn ${isLooping ? "loop-active" : ""}`} 
          onClick={toggleLoop}
        >
          🔁
        </button>
      </div>
    </div>
  );
}