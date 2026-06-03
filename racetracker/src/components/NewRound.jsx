import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewRound({ data, addRound }) {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [results, setResults] = useState('')

    const handleSave = () => {
        const nextRound =
            (data.rounds?.length || 0) > 0
                ? Math.max(...data.rounds.map(r => r.round)) + 1
                : 1

        addRound({
            round: nextRound,
            name,
            results
        })

        navigate('/rounds')
    }

    return (
        <div className="page-container">
            <h1>New Round</h1>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Round name"
            />

            <textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Results (e.g. FMND)"
            />

            <button className="btn" onClick={handleSave}>
                Create Round
            </button>
        </div>
    )
}