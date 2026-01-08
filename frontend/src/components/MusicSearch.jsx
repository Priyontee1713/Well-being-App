import React, { useState, useRef } from 'react';
import './MusicSearch.css';

const MusicSearch = ({ setSelectedMusic }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); 
  const scrollRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      // Connects to your backend regex search
      const response = await fetch(`http://localhost:5000/api/music/search?query=${query}`);
      const data = await response.json();
      setResults(data); 
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      // Scrolls exactly 4 cards (the full visible width)
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="desktop-home">
      <div className="top-section">
        <h1 className="floating-text">CALM | FOCUS | FLOW | WORK | CREATE</h1>
        
        <div className="search-area-wrapper">
          <div className="aesthetic-search-bar standout-purple">
            {/* INCREASED SPACE: wide-input expands to fill the bar */}
            <input 
              className="wide-input"
              type="text" 
              placeholder="Search (e.g., Surah)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="vibrant-search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="pagination-layout">
        {/* Navigation buttons positioned outside for clarity */}
        {results.length > 4 && (
          <button className="scroll-arrow-fixed left" onClick={() => scroll('left')}>‹</button>
        )}
        
        <div className="paginated-viewport" ref={scrollRef}>
          {results.map((item) => (
            <div key={item._id} className="music-card-quad" onClick={() => setSelectedMusic(item)}>
              <div className="glass-card">
                {/* Database image integration fix */}
                <img 
                  src={item.coverImage || "/bg1.jpg"} 
                  alt={item.title} 
                  className="card-artwork" 
                />
                <div className="card-info">
                  <h4>{item.title}</h4>
                  <p>{item.artist || "Unknown"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length > 4 && (
          <button className="scroll-arrow-fixed right" onClick={() => scroll('right')}>›</button>
        )}
      </div>
    </div>
  );
};

export default MusicSearch;