import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const RegisterMember = () => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState({
    author: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      author: '',
      password: ''
    };
    
    if (!author.trim()) {
      newErrors.author = 'Author is required.';
      isValid = false;
    } else if (author.length > 200) {
      newErrors.author = 'Author cannot exceed 200 characters.';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length > 30) {
      newErrors.password = 'Author cannot exceed 30 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitInfo = async () => {
    if (!validateForm()) {
      return;
    }
    const userData = {
      author,
      password
    }
    try {
      const response = await fetch(`${apiUrl}/game/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User registered successfull! Click Ok to create your first game");
        navigate('/register', { state: { author} });
      } else {
        const errorDetails = await response.text();
        console.error("Failed to register user", errorDetails);
      }
    } catch (error) {
      console.error("Error submitting user info:", error);
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
          Please input your details to register:
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
            <label htmlFor="password" className="form-label fw-bold">Password:</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
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

export default RegisterMember;
