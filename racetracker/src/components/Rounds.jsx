import React from 'react'
import { useNavigate } from 'react-router-dom'
import data from '../data/sampleData.json'

function Card({ item }) {
    const navigate = useNavigate()
    const deleteLink = "";

    return (
        <div className="card">
            <div className="card-info">
                <div className="card-title">Round {item.round}</div>
                <div className="card-subtitle">{item.name}</div>
                <div className="card-description">{item.results}</div>

                <div className="grid2">
                    {/* Edit Button */}
                    <button
                        className="card-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/rounds/edit/${item.round}`)
                        }}
                    >
                        Edit
                    </button>

                    {/* TODO: Make functional */}
                    {/* Delete Button */}
                    <button
                        className="card-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(deleteLink)
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Rounds() {
    const navigate = useNavigate()
    const Rounds = data?.rounds || []

    return (
        <div>
            <h1>Rounds</h1>
            {/* Previous Rounds */}
            <div className="grid2">
                {Rounds.map((item) => (
                    <Card key={item.name + item.link} item={item} />
                ))}
            </div>
            {/* Add Round */}
            <div className="grid1">
                <div className="card">
                    <div className="card-info">
                        <div className="grid3">
                            {/* New Round */}
                            <button
                                className="card-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate("/rounds/new-round")
                                }}
                            >
                                + New Round
                            </button>
                            {/* Leaderboard */}
                            <button
                                className="card-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate("/leaderboard")
                                }}
                            >
                                Leaderboard
                            </button>
                            {/* End Game */}
                            <button
                                className="card-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate("/game-over")
                                }}
                            >
                                End Game
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}