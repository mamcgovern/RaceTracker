import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="home-wrapper">

            {/* Page Title */}
            <div className="home-hero">
                <h1>Race Tracker</h1>
            </div>
            <p className="subtitle">
                Description of the webapp.
            </p>
            <button
                className="btn"
                onClick={(e) => {
                    e.stopPropagation()
                    navigate("/rounds")
                }}
            >
                Start
            </button>

        </div>
    )
}