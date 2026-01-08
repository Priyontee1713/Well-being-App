import { useEffect, useState, useRef } from "react";
import FocusMain from "./components/FocusMain";
import TimerRunning from "./components/TimerRunning";
import MusicSearch from "./components/MusicSearch";
import MusicPlayer from "./components/MusicPlayer";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  // References the file in your frontend's public folder
  const bellSoundRef = useRef(new Audio("/bell-notification.mp3.wav"));

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setIsAlarmPlaying(true);
      bellSoundRef.current.loop = true; 
      bellSoundRef.current.play().catch(err => console.log("Audio play failed:", err));
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, isPaused]);

  const stopAlarm = () => {
    setIsAlarmPlaying(false);
    bellSoundRef.current.pause();
    bellSoundRef.current.currentTime = 0; 
    setPage("timer"); // Returns to the setter page
  };

  const startTimer = (h, m, s) => {
    const total = (h * 3600) + (m * 60) + s;
    if (total <= 0) return;
    setTotalTime(total);
    setTimeLeft(total);
    setTimerRunning(true);
    setIsPaused(false);
    setPage("timer-active"); 
  };

  const currentBg = (page === "player") ? "/bg2.jpg" : "/bg1.jpg";

  return (
    <div className="app-bg-container" style={{ backgroundImage: `url(${currentBg})` }}>
      <div className="bg-overlay"></div>
      
      {/* 🔔 Alarm Notification Overlay */}
      {isAlarmPlaying && (
        <div className="alarm-popup">
          <div className="alarm-content">
            <h2>Focus session ended 🔔</h2>
            <button className="stop-alarm-btn" onClick={stopAlarm}>Stop Alarm</button>
          </div>
        </div>
      )}

      <main className="view-container">
        {page === "home" && (
          <MusicSearch setSelectedMusic={(music) => { 
            setSelectedMusic(music); 
            setPage("player"); 
          }} />
        )}

        {page === "player" && selectedMusic && (
          <MusicPlayer 
            music={{
              ...selectedMusic,
              /* Forces the player to fetch the file from the FRONTEND origin */
              url: selectedMusic.url.startsWith('http') ? selectedMusic.url : `${window.location.origin}${selectedMusic.url}`,
              coverImage: selectedMusic.coverImage.startsWith('http') ? selectedMusic.coverImage : `${window.location.origin}${selectedMusic.coverImage}`
            }} 
            setScreen={setPage} 
            onHeart={() => {}} 
            isHearted={false}
          />
        )}

        {page === "timer" && <FocusMain onStart={startTimer} />}
        
        {page === "timer-active" && (
          <TimerRunning 
            timeLeft={timeLeft} 
            total={totalTime}
            onStop={() => { setTimerRunning(false); setPage("timer"); }}
            isPaused={isPaused} 
            togglePause={() => setIsPaused(!isPaused)} 
          />
        )}
      </main>

      <nav className="desktop-nav">
        <button onClick={() => setPage("home")} className={page === "home" ? "active" : ""}>⌂</button>
        {selectedMusic && <button onClick={() => setPage("player")} className={page === "player" ? "active" : ""}>🎵</button>}
        <button onClick={() => setPage(timerRunning ? "timer-active" : "timer")} className={page.includes("timer") ? "active" : ""}>⏱</button>
      </nav>
    </div>
  );
}

export default App;