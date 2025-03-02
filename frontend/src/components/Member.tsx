import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

interface LocationState {
    author: string;
}

interface Game {
    id: number;
    author: string;
    gameName: string;
    score: string;
}

const Member = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {author} = (location.state as LocationState) || { author: ''};
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const loadGames = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous error messages
        try {
            const response = await fetch(`${apiUrl}/game/getallgames?author=${author}`);
            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }
            const data: Game[] = await response.json();
            setGames(data);
        } catch (err) {
            console.error('Error fetching games:', err);
            setError('Failed to load games');
        } finally {
            setIsLoading(false);
        }
    };

    // const loadGame 
    return (
        <div className="container text-center mt-5">
            {/* Header Section */}
            <div className="mb-5 p-2" style={{ backgroundColor: '#ffc107', borderRadius: '15px' }}>
                <h1 className="display-5 fw-bold text-dark">
                    Welcome back {author}
                </h1>
            </div>
            <div className="bg-light p-5 rounded shadow-sm">
                <h3 className="mb-4 text-secondary fw-bold text-center">
                Please choose one of the following options:
                </h3>
            </div>
            <div 
                className="d-flex justify-content-center gap-5 py-4" 
                style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
                {/* New Player Button */}
                <button
                    className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow-sm fw-bold"
                    // onClick={() => navigate('/create-game')}
                    style={{ transition: 'transform 0.2s ease', fontSize: '1.2rem' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onClick = {loadGames}
                >
                    Load Your Games
                </button>

                {/* Registered Player Button */}
                <button
                    className="btn btn-info btn-lg px-5 py-3 rounded-pill shadow-sm fw-bold"
                    // onClick={() => navigate('/login')}
                    style={{ transition: 'transform 0.2s ease', fontSize: '1.2rem' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onClick={() => navigate('/creategame' , { state: { author} })}
                >
                    Create New Game
                </button>
            </div>

            {/* Games List */}
            <div className="mt-5">
                { isLoading }
                {error && <p className="text-danger">{error}</p>}
                {games.length > 0 && (
                    <div>
                        <h2 className="mb-4">Your Games</h2>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Game Name</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.map((game) => (
                                    <tr key={game.id}>
                                        <td>{game.gameName}</td>
                                        <td>{game.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Member;