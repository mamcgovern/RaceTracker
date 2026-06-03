import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewRound({ data, addRound }) {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [results, setResults] = useState('')

    const handleSave = () => {
        const nextRound =
            data.rounds.length > 0
                ? Math.max(...data.rounds.map(r => r.round)) + 1
                : 1

        const newRound = {
            round: nextRound,
            name,
            results
        }

        addRound(newRound)
        navigate('/rounds')
    }

    return (
        <div className="page-container">

            <h1>New Round</h1>

            <div className="card form-card">

                <div className="card-info">

                    <label className="form-label">Round Name</label>
                    <input
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="form-label">Results</label>
                    <textarea
                        className="form-input textarea"
                        value={results}
                        onChange={(e) => setResults(e.target.value)}
                    />

                    <div className="grid2" style={{ marginTop: '1rem' }}>
                        <button
                            className="btn secondary"
                            onClick={() => navigate('/rounds')}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn primary"
                            onClick={handleSave}
                        >
                            Create Round
                        </button>
                    </div>

                </div>
            </div>

        </div>
    )
}