import React from 'react'

export default function About() {
    return (
        <div className="page-container">

            <h1>About Race Tracker</h1>

            <div className="card">
                <div className="card-info">

                    <div className="card-title">
                        How the App Works
                    </div>

                    <div className="card-description">
                        Race Tracker is a simple scoring system designed to track ranked results across multiple rounds.
                        Each round records the finishing order of players using their assigned single-letter codes.
                    </div>

                </div>
            </div>

            <div className="card">
                <div className="card-info">

                    <div className="card-title">
                        How Scoring Works
                    </div>

                    <div className="card-description">
                        Each round is entered as a sequence of player codes.
                        <br /><br />

                        <p className="subtitle" style={{ fontWeight: 'bold'}}>The scoring system is:</p>
                        <p className="subtitle">1st place → 4 points</p>
                        <p className="subtitle">2nd place → 3 points</p>
                        <p className="subtitle">3rd place → 2 points</p>
                        <p className="subtitle">4th place → 1 point</p>
                        <br />

                        Example round:
                        <b> RMND </b>
                        <br />
                        → R gets 4, M gets 3, N gets 2, D gets 1
                    </div>

                </div>
            </div>

            <div className="card">
                <div className="card-info">

                    <div className="card-title">
                        Data Structure
                    </div>

                    <div className="card-description">
                        The app stores two main pieces of data in memory:
                        <br /><br />

                        <p className='card-subtitle'>Players:</p>
                        A fixed roster created at the start of the game. Each player has:
                        <p className='subtitle'>Name</p>
                        <p className='subtitle'>Unique code (used in round results)</p>
                        <p className='subtitle'>Calculated points (derived from rounds)</p>

                        <br />

                        <p className='card-subtitle'>Rounds:</p>
                        Each round contains:
                        <p className='subtitle'>Round number (auto-generated)</p>
                        <p className='subtitle'>Optional round name</p>
                        <p className='subtitle'>Results string (e.g. RMND)</p>
                    </div>

                </div>
            </div>

            <div className="card">
                <div className="card-info">

                    <div className="card-title">
                        Where Data is Stored
                    </div>

                    <div className="card-description">
                        All game data is stored in React state while the app is running.
                        <br /><br />

                        This means:
                        <p className='subtitle'>Data updates instantly when you add or edit rounds</p>
                        <p className='subtitle'>Refreshing the page resets the game unless a new persistence layer is added</p>
                    </div>

                </div>
            </div>

            <div className="card">
                <div className="card-info">

                    <div className="card-title">
                        Design Philosophy
                    </div>

                    <div className="card-description">
                        The app was built to be:
                        <p className='subtitle'>Fast and lightweight</p>
                        <p className='subtitle'>Easy to update mid-game</p>
                        <p className='subtitle'>Focused on clarity over complexity</p>
                        <p className='subtitle'>Mobile-friendly for on-the-go scoring</p>

                        It avoids unnecessary backend complexity and instead focuses on a clean, reactive UI where all state is derived from the current game session.
                    </div>

                </div>
            </div>

        </div>
    )
}