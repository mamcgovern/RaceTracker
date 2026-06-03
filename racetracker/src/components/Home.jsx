import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {

    return (
        <div className="home-wrapper">

            {/* Page Title */}
            <div className="home-hero">
                <h1>Race Tracker</h1>
                <p className="subtitle">
                    Description of the webapp.
                </p>
            </div>

        </div>
    )
}