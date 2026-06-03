import React from 'react'
import { useNavigate } from 'react-router-dom'
import data from '../data/sampleData.json'

export default function Rounds({ data, deleteRound }) {
    const navigate = useNavigate()

    return (
        <div className="page-container">
            <h1>Rounds</h1>

            <div className="grid2">
                {data.rounds.map(r => (
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

            <button
                className="btn"
                onClick={() => navigate('/rounds/new-round')}
            >
                + New Round
            </button>
        </div>
    )
}