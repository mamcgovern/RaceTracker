import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Rounds({ data, deleteRound }) {
    const navigate = useNavigate()

    const rounds = data?.rounds || []

    return (
        <div className="page-container">

            <h1>Rounds</h1>

            {/* ===================== */}
            {/* ROUNDS LIST */}
            {/* ===================== */}
            {rounds.length === 0 ? (
                <div className="card">
                    <div className="card-info">
                        <div className="card-title">
                            No rounds yet
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid2">
                    {rounds.map(r => (
                        <div className="card" key={r.round}>
                            <div className="card-info">

                                <div className="card-title">
                                    Round {r.round}
                                </div>

                                <div className="card-subtitle">
                                    {r.name}
                                </div>

                                <div className="card-details">
                                    {r.results}
                                </div>

                                <div className="grid2">

                                    <button
                                        className="card-btn"
                                        onClick={() =>
                                            navigate(`/rounds/edit/${r.round}`)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="card-btn"
                                        onClick={() => deleteRound(r.round)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ===================== */}
            {/* NAVIGATION ACTIONS */}
            {/* ===================== */}
            <div className="grid1" style={{ marginTop: '2rem' }}>
                <div className="card">
                    <div className="grid3">

                        <button
                            className="btn"
                            onClick={() => navigate('/rounds/new-round')}
                        >
                            + New Round
                        </button>

                        <button
                            className="btn"
                            onClick={() => navigate('/leaderboard')}
                        >
                            Leaderboard
                        </button>

                        <button
                            className="btn"
                            onClick={() => navigate('/gameover')}
                        >
                            Game Over
                        </button>

                    </div>
                </div>
            </div>

        </div>
    )
}