import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function EditRound({ data, updateRound }) {
    const { roundId } = useParams()
    const navigate = useNavigate()

    const round = data.rounds.find(
        r => r.round === Number(roundId)
    )

    const [name, setName] = useState(round?.name || '')
    const [results, setResults] = useState(round?.results || '')

    // ✅ MOVE THIS HERE (shared scope)
    const validCodes = data.players.map(p => p.code.toUpperCase())

    const handleSave = () => {
        const cleanedResults = results.trim().toUpperCase()

        // must match player count
        if (cleanedResults.length !== validCodes.length) {
            alert(`Results must contain exactly ${validCodes.length} codes.`)
            return
        }

        // no duplicates
        if (new Set(cleanedResults).size !== validCodes.length) {
            alert('Each player code must be used exactly once.')
            return
        }

        // only valid codes
        for (const code of cleanedResults) {
            if (!validCodes.includes(code)) {
                alert(`Invalid player code: ${code}`)
                return
            }
        }

        updateRound(roundId, {
            ...round,
            name,
            results: cleanedResults
        })

        navigate('/rounds')
    }

    return (
        <div className="page-container">

            <h1>Edit Round {roundId}</h1>

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
                        className="form-input "
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
                            Save Changes
                        </button>

                    </div>

                </div>
            </div>

        </div>
    )
}