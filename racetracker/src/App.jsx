import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

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
const THEME_KEY = 'race-tracker-theme'

export default function App() {

    // =========================
    // DARK MODE STATE
    // =========================
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem(THEME_KEY) === 'dark'
    })

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')

        if (darkMode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [darkMode])

    // =========================
    // LOAD DATA
    // =========================
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (saved) {
            console.log("🔄 Loaded saved game")
            return JSON.parse(saved)
        }

        console.log("🆕 New game session created")

        return {
            players: null,
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
    // PLAYERS
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
        console.log("🔄 Resetting game")

        const freshData = {
            players: null,
            rounds: []
        }

        setData(freshData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData))
    }

    // =========================
    // ROUNDS
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

    // =========================
    // ENTRY LOGIC FIXED
    // =========================
    const hasPlayers = (data?.players?.length ?? 0) > 0

    return (
        <>
            <ScrollToTop />

            <Header />

            <Routes>

                {/* =========================
                    HOME
                ========================= */}
                <Route
                    path="/"
                    element={
                        hasPlayers
                            ? <Home resetGame={resetGame} data={data} />
                            : <AddPlayers addPlayers={addPlayers} />
                    }
                />

                {/* =========================
                    SETUP
                ========================= */}
                <Route
                    path="/addplayers"
                    element={<AddPlayers addPlayers={addPlayers} />}
                />

                {/* =========================
                    ROUNDS
                ========================= */}
                <Route
                    path="/rounds"
                    element={
                        <Rounds data={data} deleteRound={deleteRound} />
                    }
                />

                <Route
                    path="/rounds/new-round"
                    element={
                        <NewRound data={data} addRound={addRound} />
                    }
                />

                <Route
                    path="/rounds/edit/:roundId"
                    element={
                        <EditRound data={data} updateRound={updateRound} />
                    }
                />

                {/* =========================
                    INFO PAGES
                ========================= */}
                <Route path="/players" element={<PlayersPage data={data} />} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/settings"
                    element={<Settings
                        resetGame={resetGame}
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode} />}
                />

                {/* =========================
                    RESULTS
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