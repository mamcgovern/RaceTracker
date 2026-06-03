import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewRound() {
    const navigate = useNavigate()

    const [roundNumber, setRoundNumber] = useState('')
    const [name, setName] = useState('')
    const [results, setResults] = useState('')

    const handleSave = () => {
        const newRound = {
            round: Number(roundNumber),
            name,
            results
        }

        console.log('New Round Created:', newRound)

        // later: push into state / backend

        navigate('/rounds')
    }

    return (
        <div className="page-container">

            <h1>New Round</h1>

            <div className="card form-card">

                <div className="card-info">

                    {/* Round Number */}
                    <label className="form-label">Round Number</label>
                    <input
                        className="form-input"
                        type="number"
                        value={roundNumber}
                        onChange={(e) => setRoundNumber(e.target.value)}
                    />

                    {/* Round Name */}
                    <label className="form-label">Round Name</label>
                    <input
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Results */}
                    <label className="form-label">Results</label>
                    <textarea
                        className="form-input textarea"
                        value={results}
                        onChange={(e) => setResults(e.target.value)}
                    />

                    {/* Buttons */}
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