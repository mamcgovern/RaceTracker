import React from 'react'

export default function PlayersPage({ data }) {
    const players = data?.players ?? []

    return (
        <div className="page-container">

            <h1>Players</h1>

            <p className="subtitle">
                Current game participants (locked for this session)
            </p>

            {players.length === 0 ? (
                <div className="card">
                    <div className="card-info">
                        <div className="card-title">
                            No players set
                        </div>
                        <div className="card-description">
                            Start a new game to add players.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid2">

                    {players.map((p, i) => (
                        <div className="card" key={p.code || i}>
                            <div className="card-info">

                                <div className="card-title">
                                    Player {i + 1}
                                </div>

                                <div className="card-subtitle">
                                    {p.name}
                                </div>

                                <div className="card-description">
                                    Code: <b>{p.code}</b>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}