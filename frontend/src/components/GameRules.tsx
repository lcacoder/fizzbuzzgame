import React from 'react';

// Define your game rules as an array
export const rules = [
  'Replace any number divisible by 7 with "Foo"',
  'Replace any number divisible by 11 with "Boo"',
  'Replace any number divisible by 101 with "Loo"',
  'If divisible by more than one, concatenate the words (e.g., "FooBoo" for 77 which is divisible for both of 7 and 11)',
  'Otherwise, fill in the number only',
];

const GameRules = () => {
  return (
    <div>
      <h2>Basic Game Rules:</h2>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameRules;
