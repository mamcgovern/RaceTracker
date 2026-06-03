import React from 'react'
import data from '../data/sampleData.json'

function Card({ position, item }) {
    return (
        <div className="card">
            <div className="card-info">

                <div className="card-title">
                    Position #{position}
                </div>

                <div className="card-subtitle">
                    {item.name}
                </div>

                <div className="card-description">
                    Points: {item.points}
                </div>

            </div>
        </div>
    )
}

export default function Leaderboard() {
    const players = data?.players || []

    // sort highest points first
    const sortedPlayers = [...players].sort(
        (a, b) => b.points - a.points
    )

    return (
        <div className="page-container">

            <h1>Leaderboard</h1>

            <div className="grid1">
                {sortedPlayers.map((player, index) => (
                    <Card
                        key={player.name + index}
                        position={index + 1}
                        item={player}
                    />
                ))}
            </div>
        </div>
    )
}