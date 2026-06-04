import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewRound({ data, addRound }) {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [results, setResults] = useState('')

    const handleSave = () => {
        const cleanedResults = results.trim().toUpperCase()

        const validCodes = data.players.map(p => p.code.toUpperCase())

        // Must be exactly 4 characters
        if (cleanedResults.length !== validCodes.length) {
            alert(`Results must contain exactly ${validCodes.length} codes.`)
            return
        }

        // Check for duplicates
        if (new Set(cleanedResults).size !== validCodes.length) {
            alert('Each player code must be used exactly once.')
            return
        }

        // Check that all entered codes are valid
        for (const code of cleanedResults) {
            if (!validCodes.includes(code)) {
                alert(`Invalid player code: ${code}`)
                return
            }
        }

        // Check that every player appears
        const sortedEntered = [...cleanedResults].sort().join('')
        const sortedExpected = [...validCodes].sort().join('')

        if (sortedEntered !== sortedExpected) {
            alert('Results must contain every player code exactly once.')
            return
        }

        const nextRound =
            (data.rounds?.length || 0) > 0
                ? Math.max(...data.rounds.map(r => r.round)) + 1
                : 1

        addRound({
            round: nextRound,
            name,
            results: cleanedResults
        })

        navigate('/rounds')
    }

    return (
        <div className="page-container">
            <h1>New Round</h1>

            <div className="card form-card">
                <div className="card-info">
                    <input
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Round name"
                    />

                    <p className="subtitle">
                        Valid codes: {data.players.map(p => p.code).join(', ')}
                    </p>
                    <input
                        className="form-input"
                        value={results}
                        onChange={(e) => setResults(e.target.value)}
                        placeholder="Results (e.g. FMND)"
                    />

                    <button className="btn" onClick={handleSave}>
                        Create Round
                    </button>
                </div>
            </div>
        </div>
    )
}