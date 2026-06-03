import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { calculateScores } from '../utils/calculateScores'

function Podium({ players }) {
    const first = players[0]
    const second = players[1]
    const third = players[2]

    return (
        <div className="podium">

            <div className="podium-card second">
                <div className="podium-rank">2</div>
                <div className="podium-name">{second?.name}</div>
                <div className="podium-points">{second?.points} pts</div>
            </div>

            <div className="podium-card first">
                <div className="podium-rank">1</div>
                <div className="podium-name">{first?.name}</div>
                <div className="podium-points">{first?.points} pts</div>
            </div>

            <div className="podium-card third">
                <div className="podium-rank">3</div>
                <div className="podium-name">{third?.name}</div>
                <div className="podium-points">{third?.points} pts</div>
            </div>

        </div>
    )
}

export default function GameOver({ data }) {
    const navigate = useNavigate()

    const players = calculateScores(data)
        .sort((a, b) => b.points - a.points)

    const podium = players.slice(0, 3)
    const rest = players.slice(3)

    // 🎉 CONFETTI ON LOAD (1st place only)
    useEffect(() => {
        if (!podium[0]) return

        const duration = 3 * 1000
        const end = Date.now() + duration

        const colors = ['#ff0000', '#ffffff', '#ffd700']

        const frame = () => {
            confetti({
                particleCount: 6,
                spread: 70,
                origin: { y: 0.6 },
                colors
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }

        frame()
    }, [podium])

    return (
        <div className="page-container">

            <h1>Victory Lane</h1>

            <Podium players={podium} />

            <div className="grid1">
                {rest.map((player, index) => (
                    <div className="card" key={`${player.name}-${index}`}>
                        <div className="card-info">
                            <div className="card-title">
                                #{index + 4} {player.name}
                            </div>
                            <div className="card-description">
                                {player.points} pts
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid1">
                <div className="card">
                    <div className="card-info">
                        {/* New Game */}
                        <button
                            className="card-btn"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate("/")
                            }}
                        >
                            New Game
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}