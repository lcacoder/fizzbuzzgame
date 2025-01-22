import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRules, { rules } from './GameRules';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

interface LocationState {
  author: string;
}

const CreateGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { author } = (location.state as LocationState) || { author: '' };
  const [gameName, setGameName] = useState('');
  const [range, setRange] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Define the type for errors state
  const [errors, setErrors] = useState<{ gameName: string, range: string, timeRange: string }>({
    gameName: '',
    range: '',
    timeRange: ''
  });

  const gameRulesWithoutEscapes = rules.map(rule => rule.replace(/\\"/g, '"'));

  // Validate form fields before submitting
  const validateForm = () => {
    let isValid = true;
    const newErrors: { gameName: string, range: string, timeRange: string } = {
      gameName: '',
      range: '',
      timeRange: ''
    };

    // Check gameName
    if (!gameName.trim()) {
      newErrors.gameName = 'Game Name is required.';
      isValid = false;
    } else if (gameName.length > 200) {
      newErrors.gameName = 'Game Name cannot exceed 200 characters.';
      isValid = false;
    }

    // Check range
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

    // Check timeRange (if necessary)
    if (!timeRange.trim() || timeRange === '0') {
      newErrors.timeRange = 'Duration is required and must be a positive numer.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitInfo = async () => {
    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    const gameData = {
      author: author,
      gameName: gameName,
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
        navigate('/playnewgame', { state: { author, gameName, range, timeRange } });
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
          Hi {author}
        </h1>
      </div>

      {/* Form Section */}
      <div className="bg-light p-5 rounded shadow-sm">
        <h3 className="mb-4 text-secondary fw-bold text-center">
          Please input details to make new game:
        </h3>

        <form>
          {/* Game Name Input */}
          <div className="mb-4">
            <label htmlFor="gameName" className="form-label fw-bold">Game Name:</label>
            <input
              type="text"
              className={`form-control ${errors.gameName ? 'is-invalid' : ''}`}
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
            />
            {errors.gameName && <div className="invalid-feedback">{errors.gameName}</div>}
          </div>

          {/* Range Input */}
          <div className="mb-4">
            <label htmlFor="range" className="form-label fw-bold">Value Range:</label>
            <input
              type="text"
              className={`form-control ${errors.range ? 'is-invalid' : ''}`}
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="Enter max range (e.g., 100 for 0-100)"
            />
            {errors.range && <div className="invalid-feedback">{errors.range}</div>}
          </div>

          {/* Duration Input */}
          <div className="mb-4">
            <label htmlFor="timeRange" className="form-label fw-bold">Duration:</label>
            <input
              type="text"
              className={`form-control ${errors.timeRange ? 'is-invalid' : ''}`}
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              placeholder="Enter max time duration you want"
            />
            {errors.timeRange && <div className="invalid-feedback">{errors.timeRange}</div>}
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
              style={{ border: 'green', backgroundColor: 'black' }}
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

export default CreateGame;
