import { Routes, Route } from 'react-router-dom'

import Header from './components/Header.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

import Home from './components/Home.jsx'

import AddPlayers from './components/AddPlayers.jsx'
import Rounds from './components/Rounds.jsx'
import NewRound from './components/NewRound.jsx'
import GameOver from './components/GameOver.jsx'
import Leaderboard from './components/Leaderboard.jsx'


export default function App() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <main className="page-container py-4">
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />
                    {/* Add Players */}
                    <Route path="/add-players" element={<AddPlayers />} />
                    {/* Rounds */}
                    <Route path="/rounds" element={<Rounds />} />
                    {/* New Round */}
                    <Route path="rounds/new-round" element={<NewRound />} />
                    {/* Leaderboard */}
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    {/* Game-Over */}
                    <Route path="/game-over" element={<GameOver />} />
                </Routes>
            </main>
        </>
    )
}