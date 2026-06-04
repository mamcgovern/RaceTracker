import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import initialData from './data/sampleData.json'

import Header from './components/Header.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

import Home from './components/Home'
import AddPlayers from './components/AddPlayers'
import Rounds from './components/Rounds'
import NewRound from './components/NewRound'
import EditRound from './components/EditRound'
import Leaderboard from './components/Leaderboard'
import GameOver from './components/GameOver'

import PlayersPage from './components/PlayersPage'
import About from './components/About'
import Settings from './components/Settings'

const STORAGE_KEY = 'race-tracker-data'

export default function App() {

    // =========================
    // LOAD FROM STORAGE OR INIT
    // =========================
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (saved) {
            console.log("🔄 Loaded saved game")
            return JSON.parse(saved)
        }

        console.log("🆕 New game session created")

        return {
            players: null,   // 👈 forces setup step
            rounds: []
        }
    })

    // =========================
    // PERSIST DATA
    // =========================
    useEffect(() => {
        console.log("💾 Saving state:", data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }, [data])

    // =========================
    // SET PLAYERS (ONE TIME ONLY)
    // =========================
    const addPlayers = (players) => {
        if (data.players?.length > 0) {
            console.log("⚠️ Players already set — locked")
            return
        }

        console.log("👥 Setting players:", players)

        setData(prev => ({
            ...prev,
            players
        }))
    }

    // =========================
    // RESET GAME
    // =========================
    const resetGame = () => {
        console.log("🔄 Resetting rounds & players")

        const freshData = {
            players: [],
            rounds: []
        }

        setData(freshData)
        localStorage.setItem('race-tracker-data', JSON.stringify(freshData))
    }

    // =========================
    // ROUND CRUD
    // =========================
    const addRound = (newRound) => {
        console.log("➕ Adding round:", newRound)

        setData(prev => ({
            ...prev,
            rounds: [...(prev.rounds || []), newRound]
        }))
    }

    const updateRound = (roundId, updatedRound) => {
        console.log("✏️ Updating round:", roundId)

        setData(prev => ({
            ...prev,
            rounds: prev.rounds.map(r =>
                r.round === Number(roundId) ? updatedRound : r
            )
        }))
    }

    const deleteRound = (roundId) => {
        console.log("🗑 Deleting round:", roundId)

        setData(prev => ({
            ...prev,
            rounds: prev.rounds.filter(r => r.round !== Number(roundId))
        }))
    }

    return (
        <>
            <ScrollToTop />
            <Header />

            <Routes>

                {/* =========================
                    HOME (ENTRY POINT)
                ========================= */}
                <Route
                    path="/"
                    element={
                        data.players
                            ? <Home resetGame={resetGame} data={data} />
                            : <AddPlayers addPlayers={addPlayers} />
                    }
                />

                {/* =========================
                    SETUP (EXPLICIT ROUTE TOO)
                ========================= */}
                <Route
                    path="/addplayers"
                    element={
                        <AddPlayers addPlayers={addPlayers} />
                    }
                />

                {/* =========================
                    ROUNDS
                ========================= */}
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
                    path="/players"
                    element={
                        <PlayersPage
                            data={data}
                        />
                    }
                />

                <Route
                    path="/about"
                    element={
                        <About />
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <Settings
                            resetGame={resetGame}
                        />
                    }
                />
                {/* =========================
                    END STATES
                ========================= */}
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