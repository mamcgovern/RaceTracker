import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import data from '../data/sampleData.json'

export default function EditRound({ data, updateRound }) {
    const { roundId } = useParams()
    const navigate = useNavigate()

    const round = data.rounds.find(
        r => r.round === Number(roundId)
    )

    const [name, setName] = useState(round?.name || '')
    const [results, setResults] = useState(round?.results || '')

    const handleSave = () => {
        updateRound(roundId, {
            ...round,
            name,
            results
        })

        navigate('/rounds')
    }

    return (
        <div className="page-container">

            <h1>Edit Round {roundId}</h1>

            <div className="card form-card">

                <div className="card-info">

                    {/* Round Title */}
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
                            Save Changes
                        </button>

                    </div>

                </div>
            </div>

        </div>
    )
}