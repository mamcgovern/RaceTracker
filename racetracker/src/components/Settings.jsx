import React from 'react'

export default function Settings({ resetGame, darkMode, toggleDarkMode }) {

    return (
        <div className="page-container">

            <h1>Settings</h1>

            <div className="grid1">

                {/* =========================
                    THEME TOGGLE
                ========================= */}
                <div className="card">
                    <div className="card-info">

                        <div className="card-title">
                            Theme
                        </div>

                        <div className="card-description">
                            Toggle between light and dark mode.
                        </div>

                        <button
                            className="btn"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </button>

                    </div>
                </div>

                {/* =========================
                    RESET GAME
                ========================= */}
                <div className="card">
                    <div className="card-info">

                        <div className="card-title">
                            Reset Game
                        </div>

                        <div className="card-description">
                            This will delete all rounds and players.
                        </div>

                        <button
                            className="btn secondary"
                            onClick={resetGame}
                        >
                            Reset
                        </button>

                    </div>
                </div>

                {/* =========================
                    APP INFO
                ========================= */}
                <div className="card">
                    <div className="card-info">

                        <div className="card-title">
                            About App
                        </div>

                        <div className="card-description">
                            Race Tracker v1 — scoring-based race ranking system.
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}