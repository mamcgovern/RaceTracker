import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings({ resetGame }) {
    const navigate = useNavigate()

    return (
        <div className="page-container">

            <h1>Settings</h1>

            <div className="grid1">

                {/* RESET GAME */}
                <div className="card">
                    <div className="card-info">

                        <div className="card-title">
                            Reset Game
                        </div>

                        <div className="card-description">
                            This will delete all rounds and players and start fresh.
                        </div>

                        <button
                            className="btn"
                            onClick={() => {
                                resetGame()
                                navigate('/')
                            }}
                        >
                            Reset
                        </button>

                    </div>
                </div>

                {/* FUTURE SETTINGS PLACEHOLDER */}
                <div className="card">
                    <div className="card-info">

                        <div className="card-title">
                            App Info
                        </div>

                        <div className="card-description">
                            Version 1.0 — Race Tracker
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}