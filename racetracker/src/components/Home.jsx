import React from 'react'
import { useNavigate } from 'react-router-dom'

function Continue({ data }) {
    const navigate = useNavigate()

    const hasGame =
        (data?.players?.length ?? 0) > 0 &&
        (data?.rounds?.length ?? 0) >= 0

    if (!hasGame) return null

    console.log("🎮 Old Game Exists — Continue available")

    return (
        <button
            className="btn secondary"
            onClick={() => navigate('/rounds')}
        >
            Continue Game
        </button>
    )
}

export default function Home({ resetGame, data }) {
    const navigate = useNavigate()

    const handleStart = () => {
        resetGame()
        navigate('/addplayers')
    }

    return (
        <div className="home-wrapper">

            {/* Page Title */}
            <div className="home-hero">
                <h1>Race Tracker</h1>
            </div>

            {/* CONTINUE (only shows if game exists) */}
            <Continue data={data} />

            {/* START NEW GAME */}
            <button className="btn" onClick={handleStart}>
                Start New Game
            </button>

        </div>
    )
}