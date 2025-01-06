// import React, { useState, useEffect } from 'react';

// interface GameStatusProps {
//   timeLeft: number;
//   score: { correct: number; incorrect: number };
//   onTimeUp: () => void;
// }

// const GameStatus: React.FC<GameStatusProps> = ({ timeLeft, score, onTimeUp }) => {
//   useEffect(() => {
//     if (timeLeft === 0) {
//       onTimeUp();
//     }
//   }, [timeLeft, onTimeUp]);

//   return (
//     <div>
//       <p>Time Left: {timeLeft}s</p>
//       <p>Correct Answers: {score.correct}</p>
//       <p>Incorrect Answers: {score.incorrect}</p>
//     </div>
//   );
// };

// export default GameStatus;
