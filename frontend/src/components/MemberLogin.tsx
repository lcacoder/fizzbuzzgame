import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [author, setAuthor] = useState("");
    const [password, setPassword] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const verifyUser = async () => {
        if (!author.trim()) {
            alert("Please enter your name before click on login")
            return;
        }

        const userData = {
            author,
            password
          }

        try {
            const response = await fetch(`${apiUrl}/game/verifymember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Failed to verify user');
            }
            alert("Successfully login!");
            navigate('/member', { state: { author } });
        } catch (error) {
            console.error("Error verifying user:", error);
            alert("Invalid User. Please try again!");
        }
    };

    return (
        <div className="container text-center mt-5">
            {/* Header Section */}
            <div className="mb-5 p-2" style={{ backgroundColor: '#ffc107', borderRadius: '15px' }}>
                <h1 className="display-5 fw-bold text-dark">
                    Welcome Back To FizzBuzz Game! 🎮
                </h1>
            </div>

            <div className="bg-light p-5 rounded shadow-sm">
                <h3 className="mb-4 text-secondary fw-bold text-center">
                    Please input your details to login
                </h3>
                <form>
                {/* Author Input */}
                    <div className="mb-4 mf-1">
                        <label htmlFor="author" className="form-label fw-bold">Author:</label>
                        <input
                         type="text"
                         className="form-control"
                         id="author"
                         value={author}
                         onChange={(e) => setAuthor(e.target.value)}
                         placeholder="Enter author name"
                        />
                    </div>

                    <div className="mb-4 mf-1">
                        <label htmlFor="password" className="form-label fw-bold">Password:</label>
                        <input
                         type="text"
                         className="form-control"
                         id="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="Enter password here"
                        />
                    </div>
                </form>
                <button
                    className="btn btn-success btn-lg px-5 py-2 fw-bold" 
                    style={{ border: 'green', backgroundColor: 'black', transition: 'transform 0.2s ease', fontSize: '1.2rem' }}
                    onClick={verifyUser}
                    aria-label="Login"
                >
                    Login
                </button>
          </div>
        </div>
    )
}

export default LoginPage;