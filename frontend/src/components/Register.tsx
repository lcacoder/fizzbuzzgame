import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRules, { rules } from './GameRules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Index.css';

const Register = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState('');
  const [gameName, setGameName] = useState('');
  const [range, setRange] = useState('');
  const [timeRange, setTimeRange] = useState('');

  const gameRulesWithoutEscapes = rules.map(rule => rule.replace(/\\"/g, '"'));

  const submitInfo = async () => {
    if (!author.trim() || !gameName.trim() || !range.trim() || isNaN(parseInt(range, 10))) {
      alert('Please fill in all fields and enter a valid range.');
      return;
    }

    const gameData = {
      author: author,
      gameName: gameName,
      gameRules: JSON.stringify(gameRulesWithoutEscapes),
      range: parseInt(range, 10),
    };

    try {
      const response = await fetch("https://localhost:5019/api/Game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (response.ok) {
        alert("Game created successfully! Click Ok to start playing");
        navigate('/newmember', { state: { author, gameName, range, timeRange } });
      } else {
        const errorDetails = await response.text();
        console.error("Failed to create game:", errorDetails);
      }
    } catch (error) {
      console.error("Error submitting game info:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="mb-5 p-4 text-center" style={{ backgroundColor: '#ffc107', borderRadius: '15px' }}>
        <h1 className="display-3 fw-bold text-dark">
          Welcome To FizzBuzz Game! 🎮
        </h1>
      </div>

      {/* Form Section */}
      <div className="bg-light p-5 rounded shadow-sm">
        <h3 className="mb-4 text-secondary fw-bold text-center">
          Please input your details to register and create your first game:
        </h3>
        
        <form>
          {/* Author Input */}
          <div className="mb-4">
            <label htmlFor="author" className="form-label fw-bold">Author:</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Game Name Input */}
          <div className="mb-4">
            <label htmlFor="gameName" className="form-label fw-bold">Game Name:</label>
            <input
              type="text"
              className="form-control"
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
            />
          </div>

          {/* Range Input */}
          <div className="mb-4">
            <label htmlFor="range" className="form-label fw-bold">Value Range:</label>
            <input
              type="text"
              className="form-control"
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="Enter max range (e.g., 100 for 0-100)"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="range" className="form-label fw-bold">Duration:</label>
            <input
              type="text"
              className="form-control"
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              placeholder="Enter max time duration you want"
            />
          </div>

          {/* Game Rules Section */}
          <div className="mb-4">
            <GameRules />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-5 py-2 fw-bold"
              style={{ border: 'green', backgroundColor: 'black'}}
              onClick={submitInfo}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
