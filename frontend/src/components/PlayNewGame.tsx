import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRules, { rules } from './GameRules';
import { useLocation } from 'react-router-dom';
// import Register,{gameName} from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Index.css';

interface LocationState {
    author: string;
    gameName: string;
    range: string;
    timeRange: string
}

const PlayNewGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { author, gameName, range, timeRange } = (location.state as LocationState) || { author: '', gameName: '', range: '', timeRange: '' };
    const [timer, setTimer] = useState(parseInt(timeRange));
    const [randomNumber, setRandomNumber] = useState(0);
    const [answer, setAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const alertShownRef = useRef(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    if (!alertShownRef.current) {
                        alert("Time's up! Game Over. Please save your game by clicking on 'Save Game' button");
                        alertShownRef.current = true; // Mark alert as shown
                    }
                    clearInterval(interval); // Stop the interval
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);
    

    const generateRandomNumber = () => {
        const newRandomNumber = Math.floor(Math.random() * ((parseInt(range)) - 0 + 1)) + 0;
        setRandomNumber(newRandomNumber);
    }

    useEffect(() => {
        generateRandomNumber();
    }, []);

    const submitAnswer = async () => {
        if (!answer.trim) {
            alert("Please enter your answer before click on submit")
            return;
        }

        try {
            const response = await fetch("https://localhost:5019/api/game/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Answer: answer, Number: randomNumber }),
            });
            const result = await response.json();
            if(result.isCorrect) {
                alert("Correct! Well Done");
                setCorrectAnswer((prev) => prev +1);
                generateRandomNumber();
                setAnswer("");
            } else {
                alert("Incorrect.");
                generateRandomNumber();
                setAnswer("");
            }
        } catch (error) {
            console.error("Error validating answer:", error);
            alert("Something went wrong. Try again");
        }
    };

    const saveGame = async () => {
        const gameDataToSave = {
            author: author,
            gameName: gameName,
            score: correctAnswer,
          };
        try {
            const response = await fetch("https://localhost:5019/api/game/saveGame", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gameDataToSave),
            });
            if(response.ok) {
                alert("Successfully save your game");
                navigate('/member', { state: { author } });
            } else {
                const errorDetails = await response.text();
                console.error("Failed to save game:", errorDetails);
            }
        } catch (error) {
            console.error("Error submitting game info:", error);
        }
    };

    return (
        <div className="container mt-5">
            {/* Header Section */}
            <div className="text-center p-2" style={{ backgroundColor: '#ffc107', borderRadius: '15px' }}>
                <h1 className="display-5 fw-bold text-dark">
                   Hi {author}
                </h1>
            </div>
            <div className="bg-light p-5 rounded shadow-sm">
                <div className="mb-4">
                    <h3 className="mb-4  fw-bold">
                        Your New Game Setup:
                    </h3>
                    <label className="mb-4  fw-bold">Game Name: {gameName || 'N/A'}</label>
                    <br></br>
                    <label className="mb-4  fw-bold">Value Range: {range || 'N/A'}</label>
                    <GameRules />
                </div>
                <div className="mb-4">
                    <h3>Time Remaining: {timer} seconds</h3>
                </div>
                <div className="mb-4">
                    <h3>Please insert your answer for this number: {randomNumber}</h3>
                </div>
                <div className="mb-4">
                    <label htmlFor="answer" className="form-label fw-bold">Your answer: </label>
                    <input
                    type="text"
                    className="form-control"
                    id="timeRange"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer here then click on submit"
                    />
                </div>
                <div className="mb-4">
                    <button
                    type="button"
                    className="btn btn-primary btn-lg px-5 py-2 fw-bold"
                    style={{ border: 'green', backgroundColor: 'black'}}
                    onClick={submitAnswer}
                    >
                    Submit
                    </button>
                </div>
                <div className="mb-4">
                    <h3>Your Score: {correctAnswer}</h3>
                </div>
                <div className="mb-4">
                <button
                    type="button"
                    className="btn btn-primary btn-lg px-5 py-2 fw-bold"
                    style={{ border: 'green', backgroundColor: 'black'}}
                    onClick={saveGame}
                    >
                    Save Game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlayNewGame;