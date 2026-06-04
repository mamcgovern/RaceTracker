import React from 'react'

export default function About() {
    return (
        <div className="page-container">

            <h1>About</h1>

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

        </div>
    )
}