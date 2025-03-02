import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RegisterMember from './components/RegisterMember';
import Register from './components/Register';
import LoginPage from './components/MemberLogin';
import Member from './components/Member';
import NewMember  from './components/NewMember';
import NewGame from './components/NewGame';
import PlayNewGame from './components/PlayNewGame';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registermember" element={<RegisterMember/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/member" element={<Member />} />
        <Route path="/newmember" element={<NewMember />} />
        <Route path="/creategame" element={<NewGame />} />
        <Route path="/playnewgame" element={<PlayNewGame />} />
      </Routes>
    </Router>
  );
};

export default App;
