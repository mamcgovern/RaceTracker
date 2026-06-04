import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiSettings } from 'react-icons/fi'

export default function Header() {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div className="header-wrapper">
            <nav className="header">

                <div className="header-left">
                    <Link to="/" className="brand">
                        Race Tracker
                    </Link>
                </div>

                <div className="header-right" ref={ref}>

                    {/* Gear button */}
                    <button
                        className="icon-btn"
                        onClick={() => setOpen(v => !v)}
                    >
                        <FiSettings size={20} />
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="dropdown">

                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/players')
                                    setOpen(false)
                                }}
                            >
                                Players
                            </button>

                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/about')
                                    setOpen(false)
                                }}
                            >
                                About
                            </button>

                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/settings')
                                    setOpen(false)
                                }}
                            >
                                Settings
                            </button>

                        </div>
                    )}

                </div>

            </nav>
        </div>
    )
}