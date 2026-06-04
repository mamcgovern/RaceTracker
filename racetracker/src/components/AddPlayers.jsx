import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_PLAYERS = [
    { name: 'Maddie', code: 'R', points: 0 },
    { name: 'Nick', code: 'N', points: 0 },
    { name: 'Mary', code: 'M', points: 0 },
    { name: 'Damien', code: 'D', points: 0 }
]

export default function AddPlayers({ addPlayers }) {
    const navigate = useNavigate()

    const [players, setLocalPlayers] = useState([
        { name: '', code: '' },
        { name: '', code: '' },
        { name: '', code: '' },
        { name: '', code: '' }
    ])

    const [error, setError] = useState('')

    const handleChange = (index, field, value) => {
        const updated = [...players]
        updated[index][field] = value
        setLocalPlayers(updated)
    }

    const handleSubmit = () => {
        console.log("👥 Raw input players:", players)

        // =========================
        // VALIDATION
        // =========================
        const cleaned = players.map(p => ({
            name: p.name.trim(),
            code: p.code.trim().toUpperCase(),
            points: 0
        }))

        // Check empty fields
        const hasEmpty = cleaned.some(p => !p.name || !p.code)
        if (hasEmpty) {
            setError("All players must have a name and a code.")
            return
        }

        // Check unique codes
        const codes = cleaned.map(p => p.code)
        const uniqueCodes = new Set(codes)

        if (uniqueCodes.size !== 4) {
            setError("Each player must have a unique 1-letter code.")
            return
        }

        // Check single-character codes
        const invalidCode = cleaned.some(p => p.code.length !== 1)
        if (invalidCode) {
            setError("Each code must be exactly 1 letter.")
            return
        }

        console.log("✅ Final players:", cleaned)

        // Save into global state
        addPlayers(cleaned)

        // Go straight into the game
        navigate('/rounds')
    }

    // TODO: Remove testing button
    const handleAddDefault = () => {
        console.log("⚙️ Adding default players")

        addPlayers(DEFAULT_PLAYERS)

        // Go straight into the game
        navigate('/rounds')
    }

    return (
        <div className="page-container">

            <h1>Set Up Players</h1>

            {/* TODO: Remove testing button */}
            <button className="btn secondary" onClick={handleAddDefault}>
                Add Default
            </button>

            <p className="subtitle">
                Create 4 players (this cannot be changed later)
            </p>

            {/* =========================
                PLAYER INPUTS
            ========================= */}
            <div className="grid1">

                {players.map((p, i) => (
                    <div className="card" key={i}>
                        <div className="card-info">

                            <div className="card-title">
                                Player {i + 1}
                            </div>

                            <input
                                className="form-input"
                                placeholder="Name"
                                value={p.name}
                                onChange={(e) =>
                                    handleChange(i, 'name', e.target.value)
                                }
                            />

                            <input
                                className="form-input"
                                placeholder="Code (1 letter)"
                                maxLength={1}
                                value={p.code}
                                onChange={(e) =>
                                    handleChange(i, 'code', e.target.value)}
                            />

                        </div>
                    </div>
                ))}

            </div>

            {/* =========================
                ERROR MESSAGE
            ========================= */}
            {error && (
                <div className="card" style={{ border: '1px solid red' }}>
                    <div className="card-info">
                        <div className="card-description" style={{ color: 'red' }}>
                            {error}
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                SUBMIT BUTTON
            ========================= */}
            <button className="btn" onClick={handleSubmit}>
                Start Game
            </button>

        </div>
    )
}