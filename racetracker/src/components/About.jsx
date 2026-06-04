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

                        The scoring system is:
                        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
                            <li>1st place → 4 points</li>
                            <li>2nd place → 3 points</li>
                            <li>3rd place → 2 points</li>
                            <li>4th place → 1 point</li>
                        </ul>

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