import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [winners, setWinners] = useState([]);
  const [events, setEvents] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/get_winners').then(res => setWinners(res.data));
    axios.get('http://localhost:5000/get_events').then(res => setEvents(res.data));
  }, []);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % winners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [winners]);

  const handleImageClick = (winner) => {
    setFullscreen(fullscreen ? null : winner);
  };

  return (
    <div className="home">
      <h1>Mailam Engineering College</h1>

      <button onClick={() => navigate('/login/student')}>Login</button>

      {/* ✅ Winner Slideshow */}
      <div className="slider">
        {winners.map((w, idx) => (
          <div
            key={idx}
            className={`slide ${idx === currentSlide ? "active" : ""}`}
            onClick={() => handleImageClick(w)}
          >
            <img src={`http://localhost:5000/download/${w.filename}`} alt="Winner" />
            <div className="overlay-text">{w.text}</div>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {winners.map((_, idx) => (
          <span
            key={idx}
            className={idx === currentSlide ? "active" : ""}
            onClick={() => setCurrentSlide(idx)}
          ></span>
        ))}
      </div>

      {/* ✅ Fullscreen overlay */}
      {fullscreen && (
        <div className="fullscreen-overlay" onClick={() => setFullscreen(null)}>
          <img src={`http://localhost:5000/download/${fullscreen.filename}`} alt="Winner Full" />
          <div className="overlay-text">{fullscreen.text}</div>
        </div>
      )}

      {/* ✅ Scrolling events marquee */}
      <div className="marquee">
        <p>
          {events.map((e, idx) => (
            <span key={idx} style={{ marginRight: "50px" }}>
              <a href={e.link} target="_blank" rel="noopener noreferrer">{e.text}</a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
