import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Leaderboard({ data }) {
    const navigate = useNavigate()

    console.log("🏁 Leaderboard render")
    console.log("Raw data:", data)

    const players = data?.players || []
    const rounds = data?.rounds || []

    console.log("👥 Players:", players)
    console.log("🏎 Rounds:", rounds)

    // =========================
    // SCORE CALC DEBUG
    // =========================
    const calculatePoints = (results) => {
        if (!results) return {}

        console.log("🧮 Calculating points for:", results)

        const pointsMap = {}

        const scoring = {
            0: 4,
            1: 3,
            2: 2,
            3: 1
        }

        results.split('').forEach((code, index) => {
            console.log(`➡️ Position ${index + 1}: ${code} = ${scoring[index]} pts`)

            pointsMap[code] = (pointsMap[code] || 0) + scoring[index]
        })

        console.log("📊 Round result map:", pointsMap)

        return pointsMap
    }

    // =========================
    // TOTAL SCORES
    // =========================
    const scores = useMemo(() => {
        console.log("🔄 Recalculating leaderboard scores...")

        const totals = {}

        players.forEach(p => {
            totals[p.code] = 0
        })

        rounds.forEach(r => {
            const roundScores = calculatePoints(r.results || "")

            Object.entries(roundScores).forEach(([code, pts]) => {
                totals[code] += pts
            })
        })

        console.log("🏆 Total scores by code:", totals)

        return players.map(p => ({
            ...p,
            points: totals[p.code] || 0
        }))
    }, [players, rounds])

    // =========================
    // SORT
    // =========================
    const sorted = [...scores].sort((a, b) => b.points - a.points)

    console.log("🥇 Sorted leaderboard:", sorted)

    return (
        <div className="page-container">

            <h1>Leaderboard</h1>

            <div className="grid1">
                {sorted.map((p, i) => (
                    <div className="card" key={p.code || i}>

                        <div className="card-info">

                            <div className="card-title">
                                #{i + 1} {p.name}
                            </div>

                            <div className="card-subtitle">
                                Code: {p.code}
                            </div>

                            <div className="card-description">
                                Points: {p.points}
                            </div>

                        </div>

                    </div>
                ))}
            </div>
            <div className="grid1">
                <div className="card">
                    <button
                        className="card-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate("/rounds")
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}