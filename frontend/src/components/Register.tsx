import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRules, { rules } from './GameRules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const Register = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState('');
  const [gameName, setGameName] = useState('');
  const [range, setRange] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const gameRulesWithoutEscapes = rules.map(rule => rule.replace(/\\"/g, '"'));
  const apiUrl = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState({
    author: '',
    gameName: '',
    range: '',
    timeRange: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      author: '',
      gameName: '',
      range: '',
      timeRange: ''
    };
    
    if (!author.trim()) {
      newErrors.author = 'Author is required.';
      isValid = false;
    } else if (author.length > 200) {
      newErrors.author = 'Author cannot exceed 200 characters.';
      isValid = false;
    }
    
    if (!gameName.trim()) {
      newErrors.gameName = 'Game Name is required.';
      isValid = false;
    } else if (gameName.length > 200) {
      newErrors.gameName = 'Game Name cannot exceed 200 characters.';
      isValid = false;
    }

    if (!range.trim()) {
      newErrors.range = 'Value Range is required.';
      isValid = false;
    } else if (isNaN(parseInt(range, 10))) {
      newErrors.range = 'Please enter a valid number for Range.';
      isValid = false;
    } else if (parseInt(range, 10) < 1) {
      newErrors.range = 'Range must be a positive number.';
      isValid = false;
    }

    if (!timeRange.trim() || timeRange === '0') {
      newErrors.timeRange = 'Duration is required and must be a positive numer.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitInfo = async () => {
    if (!validateForm()) {
      return;
    }

    const gameData = {
      author,
      gameName,
      gameRules: JSON.stringify(gameRulesWithoutEscapes),
      range: parseInt(range, 10),
    };
    try {
      const response = await fetch(`${apiUrl}/game/creategame`, {
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
      <div className="mb-5 p-4 text-center" style={{ backgroundColor: '#ffc107', borderRadius: '15px' }}>
        <h1 className="display-3 fw-bold text-dark">
          Welcome To FizzBuzz Game! 🎮
        </h1>
      </div>

      <div className="bg-light p-5 rounded shadow-sm">
        <h3 className="mb-4 text-secondary fw-bold text-center">
          Please input your details to register and create your first game:
        </h3>
        
        <form>
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
            {errors.author && <div className="text-danger">{errors.author}</div>}
          </div>

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
            {errors.gameName && <div className="text-danger">{errors.gameName}</div>}
          </div>

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
            {errors.range && <div className="text-danger">{errors.range}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="timeRange" className="form-label fw-bold">Duration:</label>
            <input
              type="text"
              className="form-control"
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              placeholder="Enter max time duration you want"
            />
            {errors.timeRange && <div className="text-danger">{errors.timeRange}</div>}
          </div>

          <div className="mb-4">
            <GameRules />
          </div>

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
