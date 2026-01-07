import { useState, useEffect } from "react";
import "./RitualsPage.css";
/*import calmImg from "../assets/calm.jpg";
import happyImg from "../assets/happy.jpg";
import tiredImg from "../assets/tired.jpg";
import stressedImg from "../assets/stressed.jpg";*/

export default function RitualsPage() {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState(null);

  const [rituals, setRituals] = useState([]);
  const [selectedRitual, setSelectedRitual] = useState(null);

  const [ritualSteps, setRitualSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [favorites, setFavorites] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const user = "demoUser"; 

  const BACKEND_URL = "http://localhost:5000";
const moodBackgrounds = {
  calm: "/calm.jpg",
  happy: "/happy.jpg",
  tired: "/tired.jpg",
  stressed: "/stressed.jpg",
};
  /*const moodBackgrounds = {
    calm: calmImg,
    happy: happyImg,
    tired: tiredImg,
    stressed: stressedImg,
  };*/

  // Fetch moods
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mood`)
      .then((res) => res.json())
      .then((data) => setMoods(data));
  }, []);

  // Fetch rituals when mood selected
  useEffect(() => {
    if (!mood) return;
    fetch(`${BACKEND_URL}/api/ritual?mood=${mood}`)
      .then((res) => res.json())
      .then((data) => setRituals(data));
  }, [mood]);

  // Fetch ritual steps when ritual selected
  useEffect(() => {
    if (!selectedRitual) return;
    fetch(`${BACKEND_URL}/api/ritualStep?ritual=${selectedRitual._id}`)
      .then((res) => res.json())
      .then((data) => setRitualSteps(data));
  }, [selectedRitual]);

  // Fetch favorites
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/favorites/${user}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data.map((f) => f.ritual._id)));
  }, []);

  const handleSelectRitual = (rit) => {
    setSelectedRitual(rit);
    setCurrentStep(0);
  };

  const toggleFavorite = async (ritualId) => {
    if (favorites.includes(ritualId)) {
      const favList = await fetch(`${BACKEND_URL}/api/favorites/${user}`).then((r) => r.json());
      const favObj = favList.find((f) => f.ritual._id === ritualId);
      await fetch(`${BACKEND_URL}/api/favorites/${favObj._id}`, { method: "DELETE" });
      setFavorites(favorites.filter((f) => f !== ritualId));
    } else {
      const res = await fetch(`${BACKEND_URL}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, ritual: ritualId }),
      });
      if (res.ok) setFavorites([...favorites, ritualId]);
    }
  };

  const nextStep = () => {
    if (currentStep + 1 < ritualSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setSelectedRitual(null);
        setMood(null);
        setRitualSteps([]);
      }, 3000);
    }
  };

  return (
    <div
      className="rituals-container"
      style={{ backgroundImage: mood ? `url(${moodBackgrounds[mood]})` : "none" }}
    >
      {/* Mood selection */}
      {!mood && (
        <div className="fade-box center-box">
          <h2 className="question-text">How’s your mood today?</h2>
          <div className="mood-buttons">
            {moods.map((m) => (
              <button key={m._id} onClick={() => setMood(m.name)}>
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ritual selection */}
      {mood && !selectedRitual && (
        <div className="fade-box center-box">
          <h2 className="question-text">Choose a ritual</h2>
          <div className="ritual-list">
            {rituals.map((rit) => (
              <button key={rit._id} onClick={() => handleSelectRitual(rit)}>
                {rit.name}{" "}
                <span
                  style={{ color: favorites.includes(rit._id) ? "gold" : "#ccc", marginLeft: "8px" }}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(rit._id); }}
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <button className="back-btn" onClick={() => setMood(null)}>← Back</button>
        </div>
      )}

      {/* Ritual steps */}
      {selectedRitual && ritualSteps.length > 0 && !showCelebration && (
        <div className="fade-box center-box">
          <h2 className="ritual-title">{selectedRitual.name}</h2>
          <div className="step-box">
            <p className="step-text">{ritualSteps[currentStep].instruction}</p>
            <p className="quote-text">“{ritualSteps[currentStep].quote}”</p>
          </div>
          <button className="next-btn" onClick={nextStep}>Next →</button>
          <button className="back-btn" onClick={() => setSelectedRitual(null)}>← Back</button>
        </div>
      )}

      {/* Celebration */}
      {showCelebration && (
        <div className="celebration fade-box">✨ You completed the ritual ✨</div>
      )}
    </div>
  );
}

