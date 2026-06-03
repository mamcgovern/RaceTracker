import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import initialData from './data/sampleData.json'

import Header from './components/Header.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

import Home from './components/Home'
import Rounds from './components/Rounds'
import NewRound from './components/NewRound'
import EditRound from './components/EditRound'
import Leaderboard from './components/Leaderboard'
import GameOver from './components/GameOver'

export default function App() {
    const [data, setData] = useState(initialData)

    // =========================
    // RESET GAME (START NEW SEASON)
    // =========================
    const resetGame = () => {
        setData(prev => ({
            ...prev,
            rounds: []
        }))
    }

    // =========================
    // ROUNDS CRUD
    // =========================

    const addRound = (newRound) => {
        setData(prev => ({
            ...prev,
            rounds: [...prev.rounds, newRound]
        }))
    }

    const updateRound = (roundId, updatedRound) => {
        setData(prev => ({
            ...prev,
            rounds: prev.rounds.map(r =>
                r.round === Number(roundId) ? updatedRound : r
            )
        }))
    }

    const deleteRound = (roundId) => {
        setData(prev => ({
            ...prev,
            rounds: prev.rounds.filter(r => r.round !== Number(roundId))
        }))
    }

    // =========================
    // PLAYERS (for leaderboard)
    // =========================

    const updatePlayerPoints = (playerName, newPoints) => {
        setData(prev => ({
            ...prev,
            players: prev.players.map(p =>
                p.name === playerName
                    ? { ...p, points: newPoints }
                    : p
            )
        }))
    }

    return (
        <>

            <ScrollToTop />

            <Header />
            <Routes>

                <Route
                    path="/"
                    element={
                        <Home
                            data={data}
                            resetGame={resetGame}
                        />
                    }
                />

                <Route
                    path="/rounds"
                    element={
                        <Rounds
                            data={data}
                            deleteRound={deleteRound}
                        />
                    }
                />

                <Route
                    path="/rounds/new-round"
                    element={
                        <NewRound
                            addRound={addRound}
                            data={data}
                        />
                    }
                />

                <Route
                    path="/rounds/edit/:roundId"
                    element={
                        <EditRound
                            data={data}
                            updateRound={updateRound}
                        />
                    }
                />

                <Route
                    path="/leaderboard"
                    element={<Leaderboard data={data} />}
                />

                <Route
                    path="/gameover"
                    element={<GameOver data={data} />}
                />

            </Routes>
        </>
    )
}