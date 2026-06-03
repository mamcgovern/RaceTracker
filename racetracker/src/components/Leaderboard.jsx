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