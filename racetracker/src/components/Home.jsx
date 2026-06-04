import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home({ resetGame }) {
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
            {/* <p className="subtitle">
                Description of the webapp.
            </p> */}

            <button className="btn" onClick={handleStart}>
                Start New Game
            </button>

        </div>
    )
}