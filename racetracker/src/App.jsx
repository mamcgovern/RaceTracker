import { Routes, Route } from 'react-router-dom'

import Header from './components/Header.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

import Home from './components/Home.jsx'


export default function App() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <main className="page-container py-4">
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </>
    )
}