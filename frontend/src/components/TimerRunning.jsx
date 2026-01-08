import React from "react";
import "./TimerRunning.css";

export default function TimerRunning({ timeLeft, total, onStop, isPaused, togglePause }) {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  
  // SVG Calculations (Kept your logic)
  const radius = 170;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / total;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="pc-timer-active-view">
      <div className="timer-wrapper">
        <svg width="400" height="400" className="timer-svg">
          <circle 
            cx="200" cy="200" r={radius} 
            fill="white" 
            stroke="#E0DDD5" 
            strokeWidth="10" 
          />
          <circle 
            cx="200" cy="200" r={radius} 
            fill="none" 
            stroke="#B19CD9" 
            strokeWidth="12" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            /* Transition stops if paused to prevent jumping */
            style={{ transition: isPaused ? 'none' : 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        <div className="timer-inner-content">
          <div className="time-text-large">
            {m}:{s.toString().padStart(2, '0')}
          </div>
          <div className="alarm-subtext">🔔</div>
        </div>
      </div>

      <div className="timer-actions">
        {/* Cancel now specifically triggers the stop logic to return to Setter */}
        <button className="timer-btn cancel" onClick={onStop}>
          Cancel
        </button>
        
        {/* Fixed togglePause button */}
        <button 
          className={`timer-btn ${isPaused ? "resume-pulse" : "pause"}`} 
          onClick={togglePause}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}