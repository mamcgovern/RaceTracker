import React from 'react'
import data from '../data/sampleData.json'
import { calculateScores } from '../utils/calculateScores'

function Card({ position, item }) {
    return (
        <div className="card">
            <div className="card-info">

                <div className="card-title">
                    #{position} {item.name}
                </div>

                <div className="card-subtitle">
                    {item.code}
                </div>

                <div className="card-description">
                    {item.points} pts
                </div>

            </div>
        </div>
    )
}

export default function Leaderboard() {

    const players = calculateScores(data)
        .sort((a, b) => b.points - a.points)

    if (!data.rounds || data.rounds.length === 0) {
        return (
            <div className="page-container">
                <h1>Leaderboard</h1>

                <div className="card">
                    <div className="card-info">
                        <div className="card-title">
                            No rounds yet
                        </div>
                        <div className="card-description">
                            Create your first round to generate scores.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">

            <h1>Leaderboard</h1>

            <div className="grid1">
                {players.map((player, index) => (
                    <Card
                        key={player.code}
                        position={index + 1}
                        item={player}
                    />
                ))}
            </div>

        </div>
    )
}