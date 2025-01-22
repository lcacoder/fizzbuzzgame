import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container text-center mt-5">
            {/* Header Section */}
            <div className="mb-5 p-4" style={{ backgroundColor: '#ffc107', borderRadius: '15px' }}>
                <h1 className="display-3 fw-bold text-dark">
                    Welcome To FizzBuzz Game! 🎮
                </h1>
            </div>

            {/* Subheading */}
            <h4 className="mb-4 text-secondary fw-bold">
                Ready for some fun? Choose your adventure below!
            </h4>

            {/* Buttons Section */}
            <div 
                className="d-flex justify-content-center gap-5 py-4" 
                style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
                {/* New Player Button */}
                <button
                    className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow-sm fw-bold"
                    onClick={() => navigate('/register')}
                    style={{ transition: 'transform 0.2s ease', fontSize: '1.2rem' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    Register
                </button>

                {/* Registered Player Button */}
                <button
                    className="btn btn-info btn-lg px-5 py-3 rounded-pill shadow-sm fw-bold"
                    onClick={() => navigate('/login')}
                    style={{ transition: 'transform 0.2s ease', fontSize: '1.2rem' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    Member Login
                </button>
            </div>
        </div>
    );
};

export default Home;
