import React, { useState, useEffect } from 'react'
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

const STORAGE_KEY = 'race-tracker-data'

export default function App() {

    // Load from localStorage OR fallback to initial JSON
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)

        console.log("🔄 App init")
        console.log("Saved data:", saved)

        const parsed = saved ? JSON.parse(saved) : initialData

        console.log("Loaded data:", parsed)

        return parsed
    })

    // Save every change
    useEffect(() => {
        console.log("📦 State updated:", data)

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

        console.log("💾 Saved to localStorage")
    }, [data])

    // RESET GAME
    const resetGame = () => {
        console.log("🔄 RESET GAME TRIGGERED")

        const fresh = {
            ...initialData,
            rounds: []
        }

        console.log("🧼 Reset state:", fresh)

        setData(fresh)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    }

    // ADD ROUND
    const addRound = (newRound) => {
        console.log("➕ Adding round:", newRound)

        setData(prev => {
            const updated = {
                ...prev,
                rounds: [...(prev.rounds || []), newRound]
            }

            console.log("📊 New rounds array:", updated.rounds)

            return updated
        })
    }

    // UPDATE ROUND
    const updateRound = (roundId, updatedRound) => {
        setData(prev => ({
            ...prev,
            rounds: prev.rounds.map(r =>
                r.round === Number(roundId) ? updatedRound : r
            )
        }))
    }

    // DELETE ROUND
    const deleteRound = (roundId) => {
        console.log("🗑 Deleting round:", roundId)

        setData(prev => {
            const updated = {
                ...prev,
                rounds: prev.rounds.filter(r => r.round !== Number(roundId))
            }

            console.log("📊 After delete:", updated.rounds)

            return updated
        })
    }

    return (
        <>
            <ScrollToTop />
            <Header />

            <Routes>

                <Route
                    path="/"
                    element={<Home resetGame={resetGame} />}
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
                            data={data}
                            addRound={addRound}
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